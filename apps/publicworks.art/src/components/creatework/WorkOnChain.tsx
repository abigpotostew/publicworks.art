// @flow
import * as React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import SpinnerLoading from "../loading/Loader";
import { ButtonPW as Button, ButtonPW } from "../button/Button";
import { Form } from "react-bootstrap";
import { TooltipInfo } from "../tooltip/TooltipInfo";
import { z } from "zod";
import { isStarAddress } from "../../wasm/address";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Collapse from "react-bootstrap/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMintAirdrop } from "../../hooks/useMintAirdrop";
import { FlexBox } from "../layout/FlexBoxCenter";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { ChangePrice } from "../mint/ChangePrice";
import { useMinter } from "../../hooks/wasm/useMinter";
import { useRouter } from "next/router";
import { useMigrateMutation } from "../../hooks/useMigrateMutation";
import { GrowingDot } from "../spinner/GrowingDot";

export const schema = z.object({
  addresses: z
    .string()
    .refine((addresses) => {
      return !addresses
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0)
        .find((a) => !isStarAddress(a));
    }, "Invalid star address")
    .refine((addresses) => {
      const valid = addresses
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0)
        .filter((a) => isStarAddress(a));
      return valid.length === 1;
    }, "Only 1 address is allowed for airdrop"),
});

type Props = {
  minter?: string | null;
  slug?: string | null;
  work?: WorkSerializable | null;
};
export const WorkOnChain = ({ minter, slug, work }: Props) => {
  const router = useRouter();
  const secretDefined = !!router.query.secret;
  const [airdropVisible, setAirdropVisible] = useState<boolean>(false);
  const [changePriceVisible, setChangePriceVisible] = useState<boolean>(false);
  const migrateMutate = useMigrateMutation();

  const getMinterQuery = useMinter(minter);
  const defaults = {
    addresses: "",
  };

  let mutateAidrop: ((addrs: string) => void) | undefined = undefined;
  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values) => {
      if (mutateAidrop) mutateAidrop(values.addresses);
    },
    validationSchema: toFormikValidationSchema(schema),
  });
  const { mutation: airdropMutationOnChain } = useMintAirdrop();
  const airdropMutation = useMutation(async (addressList: string) => {
    if (!minter || !slug) {
      throw new Error("missing minter address");
    }
    const addresses = addressList
      .split(",")
      .map((a) => a.trim())
      .filter((a) => isStarAddress(a));
    console.log("airdropping to addresses", addresses);
    await airdropMutationOnChain.mutateAsync({
      recipients: addresses,
      minter,
      slug: slug,
    });
  });
  mutateAidrop = airdropMutation.mutate;

  if (!minter) {
    return (
      <>
        Your work is not instantiated on chain yet. Go back and finish deploying
        your smart contract!
      </>
    );
  }

  if (getMinterQuery.isLoading) {
    return (
      <>
        <SpinnerLoading />
      </>
    );
  }

  return (
    <div>
      <div>
        <FlexBox>
          <ButtonPW
            variant={"outline-primary"}
            target={"_blank"}
            href={`https://testnet.publicawesome.dev/launchpad/${minter}`}
            className={"Margin-T-1"}
          >
            View on Stargaze.zone
          </ButtonPW>
          <ButtonPW
            variant={"outline-primary"}
            target={"_blank"}
            href={`/work/${slug}`}
            className={"Margin-T-1 Margin-L-1"}
          >
            View on PublicWorks.art
          </ButtonPW>
        </FlexBox>
        <div>
          <a
            href={"#"}
            onClick={(event) => {
              event.preventDefault();
              console.log(
                "pizza hello set airdropVisible to ",
                !airdropVisible
              );
              setAirdropVisible(!airdropVisible);
            }}
          >
            <h5>
              {airdropVisible ? (
                <FontAwesomeIcon icon={"minus"} width={14} />
              ) : (
                <FontAwesomeIcon icon={"plus"} width={14} />
              )}
              Admin Airdrop
            </h5>
          </a>
          <Collapse in={airdropVisible}>
            <Form
              onSubmit={(...a) => {
                return formik.handleSubmit(...a);
              }}
              noValidate={true}
              className={"Margin-L-1"}
            >
              <Form.Group controlId="formAirdropAddresses">
                <Form.Label>
                  Airdrop To <TooltipInfo>Airdrop costs 15 stars.</TooltipInfo>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={formik.values.addresses}
                  placeholder={"stars123..."}
                  onChange={formik.handleChange}
                  name="addresses"
                  isValid={formik.touched.addresses && !formik.errors.addresses}
                  isInvalid={
                    formik.touched.addresses && !!formik.errors.addresses
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.addresses}
                </Form.Control.Feedback>
                <Button variant="info" type="submit" className={"Margin-T-1"}>
                  Airdrop!
                </Button>
                {airdropMutation.isLoading && <SpinnerLoading />}
              </Form.Group>
            </Form>
          </Collapse>
        </div>
        <div>
          <a
            href={"#"}
            onClick={(event) => {
              event.preventDefault();
              setChangePriceVisible(!changePriceVisible);
            }}
          >
            <h5>
              {changePriceVisible ? (
                <FontAwesomeIcon icon={"minus"} width={14} />
              ) : (
                <FontAwesomeIcon icon={"plus"} width={14} />
              )}
              Update Price
            </h5>
          </a>
          <Collapse key={"collapseChangePrice"} in={changePriceVisible}>
            <div>
              {(!!work && !!getMinterQuery.data && (
                <ChangePrice work={work} minter={getMinterQuery.data} />
              )) ||
                null}
            </div>
          </Collapse>
        </div>
        {secretDefined && (
          <Button
            variant="danger"
            onClick={() =>
              work?.minter
                ? migrateMutate.mutate({ minter: work?.minter })
                : null
            }
            className={"Margin-T-1"}
          >
            Migrate to V2! {migrateMutate.isLoading && <GrowingDot />}
          </Button>
        )}
      </div>

      {/*<div>MinterPrice: {JSON.stringify(minterPrice.data, undefined, 2)}</div>*/}
    </div>
  );
};
