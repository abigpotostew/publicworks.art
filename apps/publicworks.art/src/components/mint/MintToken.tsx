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
import SpinnerLoading from "../loading/Loader";
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
    ? fromTimestamp(minterQuery.data?.config?.start_time).getTime() > Date.now()
    : false;

  const isSoldOut = soldOutQuery.data === true;
  const loading =
    soldOutQuery.isLoading ||
    minterQuery.isLoading ||
    mintMutation.isLoading ||
    minterPrice.isLoading;
  const mintDisabled =
    isSoldOut ||
    loading ||
    !work?.minter ||
    mintMutation.isLoading ||
    !minterPrice.data;

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
          <Form onSubmit={props.handleSubmit}>
            <div className="d-flex justify-content-sm-start align-items-center gap-3">
              <Form.Group className="mb-3" controlId="quantity">
                <Form.Label># to Mint</Form.Label>
                <Form.Control
                  type="number"
                  step="1"
                  min="1"
                  max="10000"
                  onWheel={numberInputOnWheelPreventChange}
                  value={props.values.quantity}
                  name="quantity"
                  onChange={props.handleChange}
                  // isValid={props.touched.quantity && !props.errors.quantity}
                  isInvalid={props.touched.quantity && !!props.errors.quantity}
                />

                <Form.Control.Feedback type="invalid">
                  {props.errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>
              <ButtonPW
                type="submit"
                disabled={props.isSubmitting || mintDisabled}
                className={"h-50"}
              >
                Mint
                <>
                  {loading ? (
                    <>
                      {" "}
                      <SpinnerLoading />{" "}
                    </>
                  ) : null}
                </>
              </ButtonPW>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
