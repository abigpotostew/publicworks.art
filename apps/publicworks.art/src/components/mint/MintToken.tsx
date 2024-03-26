// @flow
import * as React from "react";
import { useMinterPrice } from "../../hooks/useMinterPrice";
import { useMinter } from "../../hooks/wasm/useMinter";
import { Form } from "react-bootstrap";
import { numberInputOnWheelPreventChange } from "../creatework/NftDetails2";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { ButtonPW } from "../button/Button";
import { useMintMutation } from "../../hooks/useMintMutation";
import { useToast } from "../../hooks/useToast";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { useSoldOut } from "../../hooks/useSoldOut";
import { fromTimestamp } from "../../hooks/useUpdateDutchAuction";

type Props = {
  work: WorkSerializable | null;
};
const schema = z.object({
  quantity: z.number().min(1).max(10000),
});
export const MintToken = ({ work }: Props) => {
  const soldOutQuery = useSoldOut(work);
  const minterQuery = useMinter(work?.minter);
  const minterPrice = useMinterPrice({ minter: work?.minter });
  const mintMutation = useMintMutation();
  const toast = useToast();
  //todo handle auction not started yet
  const hasStarted = minterQuery.data?.config?.start_time
    ? fromTimestamp(minterQuery.data?.config?.start_time).getTime() < Date.now()
    : false;
  // console.log(
  //   "pizza minterQuery.data?.config?.start_time",
  //   minterQuery.data?.config?.start_time,
  //   minterQuery.data?.config?.start_time &&
  //     fromTimestamp(minterQuery.data?.config?.start_time).getTime(),
  //   hasStarted
  // );

  const isSoldOut = soldOutQuery.data === true;
  const loading =
    soldOutQuery.isLoading ||
    minterQuery.isLoading ||
    mintMutation.isPending ||
    minterPrice.isLoading;
  const mintDisabled =
    isSoldOut ||
    loading ||
    !work?.minter ||
    mintMutation.isPending ||
    !minterPrice.data ||
    !hasStarted;

  return (
    <div>
      <Formik
        initialValues={{ quantity: 1 }}
        validationSchema={toFormikValidationSchema(schema)}
        onSubmit={async (values, actions) => {
          const price = minterPrice.data?.current_price;
          if (!price || !work?.minter) {
            throw new Error("Price not found");
          }
          //price should be up to date since the hook fetches frequently
          //mint mutation
          const result = await mintMutation.mutateAsync({
            quantity: values.quantity,
            price: price.amount,
            minter: work?.minter,
          });
          if (result.success) {
            toast.txHash(
              "Mint Transaction Succeeded. View.",
              result.transactionHash
            );
            for (const tokenId of result.tokenIds) {
              toast.mint(`Minted token #${tokenId}. View.`, work.slug, tokenId);
            }
          }
        }}
      >
        {(props) => (
          <Form className={"row"} onSubmit={props.handleSubmit}>
            {/*<div className="d-flex justify-content-sm-start align-items-baseline gap-3">*/}
            <Form.Group className="row" controlId="quantity">
              <Form.Label
                className={"col-sm-2 col-form-label col-form-label-sm"}
              >
                # to Mint
              </Form.Label>
              <div className={"col-sm-2"}>
                <Form.Control
                  disabled={isSoldOut}
                  type="number"
                  step="1"
                  min="1"
                  max="10000"
                  onWheel={numberInputOnWheelPreventChange}
                  value={props.values.quantity}
                  name="quantity"
                  size={"sm"}
                  onChange={props.handleChange}
                  isInvalid={props.touched.quantity && !!props.errors.quantity}
                />

                <Form.Control.Feedback type="invalid">
                  {props.errors.quantity}
                </Form.Control.Feedback>
              </div>
              <div className={"col ps-3"}>
                <ButtonPW
                  type="submit"
                  name="buttonsbmt"
                  id={"buttonsbmt"}
                  disabled={props.isSubmitting || mintDisabled || isSoldOut}
                  className={"w-100"}
                >
                  Mint
                  <>
                    {mintMutation.isPending ? (
                      <>
                        {" "}
                        <span
                          className="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : null}
                  </>
                </ButtonPW>
              </div>
            </Form.Group>

            <Form.Group className="col" controlId="buttonsbmt">
              {/*<div className={``}>*/}
              {/*  <a*/}
              {/*    className={"btn"}*/}
              {/*    href={`${config.launchpadUrl}/` + work.minter}*/}
              {/*    rel="noreferrer"*/}
              {/*    target={"_blank"}*/}
              {/*  >*/}
              {/*    <Button size={"sm"} variant={"outline-primary"}>*/}
              {/*      Mint on stargaze.zone*/}
              {/*    </Button>*/}
              {/*  </a>*/}
              {/*</div>*/}
            </Form.Group>
            {/*</div>*/}
          </Form>
        )}
      </Formik>
    </div>
  );
};
