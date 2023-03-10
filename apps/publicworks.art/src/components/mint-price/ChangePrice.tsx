// @flow
import * as React from "react";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { schema } from "../creatework/WorkOnChain";
import {
  defaultTime,
  formatDateInput,
  formatInUTC,
  numberInputOnWheelPreventChange,
  schemaDutchAuctionPartialWithValidations,
  SchemaDutchAuctionType,
  schemaNoDutchAuction,
} from "../creatework/NftDetails2";
import {
  fromCoin,
  fromTimestamp,
  useSetDutchAuction,
} from "../../hooks/useUpdateDutchAuction";
import { Alert, Collapse, Form } from "react-bootstrap";
import { TooltipInfo } from "../tooltip";
import { parseISO } from "date-fns";
import { DutchAuctionChart } from "../dutch-action-chart/DutchAuctionChart";
import { Minter } from "../../../@stargazezone/client";
import { ButtonPW } from "../button/Button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/useToast";
import { z } from "zod";
import { useSetPrice } from "../../hooks/useUpdatePrice";
import { useEditWorkMutation } from "../../hooks/useEditWorkMutation";
import SpinnerLoading from "../loading/Loader";

type Props = {
  minter: Minter;
  work: WorkSerializable;
};

export const ChangePrice = ({ minter, work }: Props) => {
  //grab the config on chain! use that here instead of the work
  const config = minter.config;
  const isDutchAuction = !!config?.dutch_auction_config;
  const dutchAuction = config?.dutch_auction_config;
  const toast = useToast();

  const defaults = {
    priceStars: fromCoin(config.unit_price) || 50,
    isDutchAuction: isDutchAuction,
    startDate:
      (config.start_time &&
        formatDateInput(fromTimestamp(config.start_time))) ||
      defaultTime(24),
    dutchAuctionEndPrice: dutchAuction
      ? fromCoin(dutchAuction.resting_unit_price)
      : 0,
    dutchAuctionEndDate: dutchAuction
      ? formatDateInput(fromTimestamp(dutchAuction.end_time))
      : defaultTime(25),
    dutchAuctionDeclinePeriodSeconds: dutchAuction
      ? dutchAuction.decline_period_seconds
      : 300,
    dutchAuctionDecayRate: dutchAuction
      ? dutchAuction.decline_decay / 1_000_000
      : 0.85,
  };

  const setDutchAuctionMutation = useSetDutchAuction();
  const setPriceMutation = useSetPrice();
  const editWorkMutation = useEditWorkMutation();
  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values, { resetForm }) => {
      if (values.isDutchAuction && setDutchAuctionMutation) {
        //todo only allow this for new minters
        await setDutchAuctionMutation.mutateAsync({
          work,
          config: {
            startTimeMs: new Date(values.startDate).getTime(),
            unit_price: values.priceStars,
            endTimeMs: new Date(values.dutchAuctionEndDate).getTime(),
            restingUnitPrice: values.dutchAuctionEndPrice,
            declineDecay: values.dutchAuctionDecayRate,
            declinePeriodSeconds: values.dutchAuctionDeclinePeriodSeconds,
          },
        });
        await editWorkMutation.mutateAsync({
          id: work.id,
          startDate: values.startDate,
          priceStars: values.priceStars,
          dutchAuctionEndDate: values.dutchAuctionEndDate,
          dutchAuctionEndPrice: values.dutchAuctionEndPrice,
          dutchAuctionDeclinePeriodSeconds:
            values.dutchAuctionDeclinePeriodSeconds,
          dutchAuctionDecayRate: values.dutchAuctionDecayRate,
        });
        toast.success("Dutch auction updated on chain");
      }
      if (!values.isDutchAuction && setPriceMutation) {
        await setPriceMutation.mutateAsync({
          work,
          config: { unit_price: values.priceStars },
        });
        await editWorkMutation.mutateAsync({
          id: work.id,
          priceStars: values.priceStars,
        });
        toast.success("Price updated on chain");
      }
      //todo save it in the db before the transaction
      // await resetForm();
    },
    validationSchema: {
      validate: (form: SchemaDutchAuctionType) => {
        if (!form.isDutchAuction) {
          console.log("validating no dutch auction", form);
          return toFormikValidationSchema(
            z.object({ priceStars: z.number().min(50) })
          ).validate(form);
        }
        console.log("validating with dutch auction", form);
        return toFormikValidationSchema(
          schemaDutchAuctionPartialWithValidations
        ).validate(form);
      },
    },
    // validateOnMount: true,
  });

  // const executeUpdateDutchAuction = useMutation(
  //   async (formikIn: typeof formik) => {
  //     formikIn.
  //   }
  // );
  return (
    <div>
      <Form
        onSubmit={(...a) => {
          return formik.handleSubmit(...a);
        }}
        noValidate
      >
        <Form.Group className="mb-3" controlId="formIsDutchAuction">
          <Form.Label>
            Dutch Auction{" "}
            <TooltipInfo>
              Dutch Auctions gradually lower the mint price over time.
            </TooltipInfo>
          </Form.Label>
          <Form.Check
            name="isDutchAuction"
            type="switch"
            checked={formik.values.isDutchAuction}
            // value={formik.values.isDutchAuction?.toString()}
            onChange={formik.handleChange}
            isValid={
              formik.touched.isDutchAuction && !formik.errors.isDutchAuction
            }
          />
        </Form.Group>

        <Collapse in={!formik.values.isDutchAuction}>
          <div>
            <Form.Group className="mb-3" controlId="priceStars">
              <Form.Label>
                Price in $Stars <TooltipInfo>Public mint price</TooltipInfo>
              </Form.Label>
              <Form.Control
                type="number"
                onWheel={numberInputOnWheelPreventChange}
                value={formik.values.priceStars}
                name="priceStars"
                onChange={formik.handleChange}
                isValid={formik.touched.priceStars && !formik.errors.priceStars}
                isInvalid={
                  formik.touched.priceStars && !!formik.errors.priceStars
                }
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.priceStars}
              </Form.Control.Feedback>
            </Form.Group>
            <ButtonPW disabled={formik.isSubmitting} type="submit">
              Update Public Price
            </ButtonPW>
          </div>
        </Collapse>

        <Collapse in={formik.values.isDutchAuction}>
          <div>
            <Form.Group className="mb-3" controlId="formWorkStartTime">
              <Form.Label>
                Start Time <TooltipInfo>Public mint start time</TooltipInfo>
              </Form.Label>
              <Form.Control
                type={"datetime-local"}
                name="startDate"
                onChange={formik.handleChange}
                value={formik.values.startDate}
                isValid={formik.touched.startDate && !formik.errors.startDate}
                isInvalid={
                  formik.touched.startDate && !!formik.errors.startDate
                }
              />
              <Form.Label>
                {`${formatInUTC(parseISO(formik.values.startDate))} UTC`}
              </Form.Label>

              <Form.Control.Feedback type="invalid">
                {formik.errors.startDate}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDutchAuctionEndDate">
              <Form.Label>
                End Time{" "}
                <TooltipInfo>
                  When the Dutch Auction ends, the price will be fixed at the
                  resting price. Tokens can still be minted after the auction
                  ends.
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                type={"datetime-local"}
                name="dutchAuctionEndDate"
                onChange={formik.handleChange}
                value={formik.values.dutchAuctionEndDate}
                isValid={
                  formik.touched.dutchAuctionEndDate &&
                  !formik.errors.dutchAuctionEndDate
                }
                isInvalid={
                  formik.touched.dutchAuctionEndDate &&
                  !!formik.errors.dutchAuctionEndDate
                }
              />
              <Form.Label>
                {`${formatInUTC(
                  parseISO(formik.values.dutchAuctionEndDate)
                )} UTC`}
              </Form.Label>

              <Form.Control.Feedback type="invalid">
                {formik.errors.dutchAuctionEndDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="priceStars">
              <Form.Label>
                Start Price in $Stars{" "}
                <TooltipInfo>Public mint price</TooltipInfo>
              </Form.Label>
              <Form.Control
                type="number"
                onWheel={numberInputOnWheelPreventChange}
                value={formik.values.priceStars}
                name="priceStars"
                onChange={formik.handleChange}
                isValid={formik.touched.priceStars && !formik.errors.priceStars}
                isInvalid={
                  formik.touched.priceStars && !!formik.errors.priceStars
                }
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.priceStars}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="dutchAuctionEndPrice">
              <Form.Label>
                Resting Price in $Stars{" "}
                <TooltipInfo>
                  Final resting price after the auction has finished.
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                type="number"
                onWheel={numberInputOnWheelPreventChange}
                value={formik.values.dutchAuctionEndPrice}
                name="dutchAuctionEndPrice"
                onChange={formik.handleChange}
                isValid={
                  formik.touched.dutchAuctionEndPrice &&
                  !formik.errors.dutchAuctionEndPrice
                }
                isInvalid={
                  formik.touched.dutchAuctionEndPrice &&
                  !!formik.errors.dutchAuctionEndPrice
                }
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.dutchAuctionEndPrice}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="dutchAuctionDeclinePeriodSeconds"
            >
              <Form.Label>
                Price Drop Interval{" "}
                <TooltipInfo>
                  The price will drop at this interval. 5 minutes is recommended
                  (300 seconds).
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                type="number"
                onWheel={numberInputOnWheelPreventChange}
                value={formik.values.dutchAuctionDeclinePeriodSeconds}
                name="dutchAuctionDeclinePeriodSeconds"
                onChange={formik.handleChange}
                isValid={
                  formik.touched.dutchAuctionDeclinePeriodSeconds &&
                  !formik.errors.dutchAuctionDeclinePeriodSeconds
                }
                isInvalid={
                  formik.touched.dutchAuctionDeclinePeriodSeconds &&
                  !!formik.errors.dutchAuctionDeclinePeriodSeconds
                }
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.dutchAuctionDeclinePeriodSeconds}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="dutchAuctionDecayRate">
              <Form.Label>
                Price Decay Rate{" "}
                <TooltipInfo>
                  The auction price drops based on a decay rate. When above 0.5
                  the price drops quickly then gradually slows down. When under
                  0.5, the price drops slowly then gradually speeds up near
                  auction end. When equal to 0.5 the price drops linearly.
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.000001"
                onWheel={numberInputOnWheelPreventChange}
                value={formik.values.dutchAuctionDecayRate}
                name="dutchAuctionDecayRate"
                onChange={formik.handleChange}
                isValid={
                  formik.touched.dutchAuctionDecayRate &&
                  !formik.errors.dutchAuctionDecayRate
                }
                isInvalid={
                  formik.touched.dutchAuctionDecayRate &&
                  !!formik.errors.dutchAuctionDecayRate
                }
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.dutchAuctionDecayRate}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Label>
              <Alert variant={"info"}>
                This graph depicts the price over the duration of the dutch
                auction. Elapsed time is a close estimate because actual time is
                based on the blockchain.
              </Alert>
            </Form.Label>
            <DutchAuctionChart
              startPrice={formik.values.priceStars || 50}
              endPrice={formik.values.dutchAuctionEndPrice || 50}
              startTime={
                formik.values.startDate
                  ? new Date(formik.values.startDate)
                  : new Date()
              }
              endTime={
                formik.values.dutchAuctionEndDate
                  ? new Date(formik.values.dutchAuctionEndDate)
                  : new Date()
              }
              declinePeriodSeconds={
                formik.values.dutchAuctionDeclinePeriodSeconds || 300
              }
              decay={formik.values.dutchAuctionDecayRate || 0.92435}
            />
            <ButtonPW
              disabled={formik.isSubmitting || !formik.dirty}
              type="submit"
            >
              Update Dutch Auction
              <>
                {formik.isSubmitting && (
                  <>
                    {" "}
                    <SpinnerLoading />
                  </>
                )}
              </>
            </ButtonPW>
          </div>
        </Collapse>
      </Form>
    </div>
  );
};
