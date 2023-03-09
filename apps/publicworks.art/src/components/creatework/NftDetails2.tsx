import { parseISO } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import React, { FC, useEffect, WheelEvent } from "react";
import { Alert, Collapse, Form } from "react-bootstrap";
import { EditProjectRequest } from "src/store";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { TooltipInfo } from "../tooltip/TooltipInfo";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { isISODate } from "src/util/isISODate";
import { ButtonPW as Button } from "../button/Button";
import { useWallet } from "@stargazezone/client";
import { isStarAddress } from "../../wasm/address";
import { DutchAuctionChart } from "../dutch-action-chart/DutchAuctionChart";

// const formatInTimeZone = (date: Date, fmt: string, tz: string) =>
//   format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

export function defaultDate(hoursFromNow = 24) {
  const date = new Date();
  const coeff = 1000 * 60 * 60 * hoursFromNow;
  const rounded = new Date(Math.round(date.getTime() / coeff + 1) * coeff);
  return rounded;
}

export function defaultTime(hoursFromNow = 24) {
  const rounded = defaultDate(hoursFromNow);
  return formatDateInput(rounded);
}

export function formatDateInput(date: Date) {
  const out = `${format(date, "yyyy-MM-dd")}T${format(date, "kk:mm")}`;
  // console.log("default date", out);
  return out;
}

export interface CreateWorkProps {
  onCreateProject:
    | ((req: Partial<EditProjectRequest>) => void)
    | ((req: Partial<EditProjectRequest>) => Promise<void>);
  defaultValues?: WorkSerializable;
  formValid: (props: { isValid: boolean; isTouched: boolean }) => void;
}

export const schemaShared = z.object({
  startDate: z
    .string()
    .refine(isISODate, { message: "Not a valid ISO string date " })
    .refine((v) => new Date(v) > new Date(), "Must be in the future")
    .transform((v) => parseISO(v).toISOString())
    .optional(),
  isDutchAuction: z.boolean().optional(),
});
export const schemaMainPartial = z.object({
  maxTokens: z.number().min(1).max(10_000).optional().default(1),
  royaltyAddress: z
    .string()
    .optional()
    .refine((v) => !v || isStarAddress(v), 'Not a valid "stars" address'),
  royaltyPercent: z.number().min(0).max(100).optional(),
  resolution: z
    .string()
    .regex(/^(\d+):(\d+)$/, "Resolution must be in the format 'width:height'")
    .refine((v) => {
      const splits = v.split(":");
      const found = splits.find((v) => {
        const n = parseInt(v);
        return n > 10000 || n < 50;
      });
      return splits.length == 2 && !found;
    }, "Resolution must be less than 10000 and greater than 50"),
  selector: z.string(),
  license: z.string().max(1000).optional().nullable(),
  pixelRatio: z.number().min(0).max(10),
  priceStars: z.number().min(50),
});
// .merge(schemaShared);

export const schemaDutchAuctionPartial = z.object({
  dutchAuctionEndPrice: z.number().min(50).optional(),
  dutchAuctionEndDate: z
    .string()
    .refine(isISODate, { message: "Not a valid ISO string date " })
    .refine((v) => new Date(v) > new Date(), "Must be in the future")
    .transform((v) => parseISO(v).toISOString())
    .optional(),
  dutchAuctionDeclinePeriodSeconds: z.number().min(1).max(1000).default(300),
  dutchAuctionDecayRate: z.number().min(0).max(1).default(0.85),
});

const schemaNoDutchAuction = schemaMainPartial.merge(schemaShared);

const schemaDutchAuction = schemaMainPartial
  .merge(schemaShared)
  .merge(schemaDutchAuctionPartial)
  .refine((obj) => {
    if (obj.isDutchAuction) {
      return (
        !!obj.dutchAuctionEndPrice &&
        !!obj.dutchAuctionEndDate &&
        !!obj.dutchAuctionDecayRate &&
        !!obj.dutchAuctionDeclinePeriodSeconds
      );
    }
    return true;
  }, "All dutch auction fields are required if dutch auction is selected")
  .refine((obj) => {
    if (
      obj.isDutchAuction &&
      obj.startDate &&
      obj.dutchAuctionEndDate &&
      new Date(obj.startDate) < new Date(obj.dutchAuctionEndDate)
    ) {
      return false;
    }
    return true;
  }, "Dutch Auction end date must be after start date");

export const schemaDutchAuctionPartialWithValidations =
  schemaDutchAuctionPartial
    .merge(schemaShared)
    .refine((obj) => {
      if (obj.isDutchAuction) {
        return (
          !!obj.dutchAuctionEndPrice &&
          !!obj.dutchAuctionEndDate &&
          !!obj.dutchAuctionDecayRate &&
          !!obj.dutchAuctionDeclinePeriodSeconds
        );
      }
      return true;
    }, "All dutch auction fields are required if dutch auction is selected")
    .refine((obj) => {
      if (
        obj.isDutchAuction &&
        obj.startDate &&
        obj.dutchAuctionEndDate &&
        new Date(obj.startDate) < new Date(obj.dutchAuctionEndDate)
      ) {
        return false;
      }
      return true;
    }, "Dutch Auction end date must be after start date");

type SchemaTypeNoDutchAuction = z.infer<typeof schemaNoDutchAuction>;
type SchemaDutchAuctionType = z.infer<typeof schemaDutchAuction>;

export const formatInUTC = (date: Date | null | undefined) => {
  if (!date) {
    return "-";
  }
  try {
    const out = formatInTimeZone(date, "UTC", "LLLL d, yyyy kk:mm"); // 2014-10-25 06:46:20-04:00
    return out;
  } catch (e) {
    return "-";
  }
};

export const numberInputOnWheelPreventChange = (e: any) => {
  // Prevent the input value change
  e.target.blur();

  // Prevent the page/container scrolling
  e.stopPropagation();

  // Refocus immediately, on the next tick (after the currentfunction is done)
  setTimeout(() => {
    e.target.focus();
  }, 0);
};

export const NftDetails2: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const sgwallet = useWallet();
  console.log("NftDetails2 work maxTokens", props.defaultValues?.maxTokens);
  const defaults = {
    maxTokens: props.defaultValues?.maxTokens || 0,
    royaltyAddress:
      props.defaultValues?.royaltyAddress || sgwallet.wallet?.address || "",
    royaltyPercent:
      (props?.defaultValues?.royaltyPercent &&
        props.defaultValues.royaltyPercent) ||
      5,

    resolution: props.defaultValues?.resolution || "1080:1080",
    pixelRatio: props.defaultValues?.pixelRatio || 1,
    selector: props.defaultValues?.selector || undefined,
    license: props.defaultValues?.license || undefined,
    priceStars: props.defaultValues?.priceStars || 50,
    startDate:
      (props.defaultValues?.startDate &&
        formatDateInput(new Date(props.defaultValues.startDate))) ||
      defaultTime(24),
    isDutchAuction: props.defaultValues?.isDutchAuction || false,
    dutchAuctionEndPrice: props.defaultValues?.dutchAuctionEndPrice || 50,
    dutchAuctionEndDate:
      (props.defaultValues?.dutchAuctionEndDate &&
        formatDateInput(new Date(props.defaultValues.dutchAuctionEndDate))) ||
      defaultTime(25),
    dutchAuctionDeclinePeriodSeconds:
      props.defaultValues?.dutchAuctionDeclinePeriodSeconds || 300,
    dutchAuctionDecayRate: props.defaultValues?.dutchAuctionDecayRate || 0.85,
  };
  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values, { resetForm }) => {
      console.log("values", values);
      //check dutch auction here
      // alert(JSON.stringify(values, null, 2));

      await props.onCreateProject({
        ...values,
        startDate: values.startDate
          ? parseISO(values.startDate).toISOString()
          : undefined,
      });
      await resetForm();
    },
    validationSchema: {
      validate: (form: SchemaDutchAuctionType) => {
        if (!form.isDutchAuction) {
          console.log("validating no dutch auction", form);
          return toFormikValidationSchema(schemaNoDutchAuction).validate(form);
        }
        console.log("validating with dutch auction", form);
        return toFormikValidationSchema(schemaDutchAuction).validate(form);
      },
    },
    // validateOnMount: true,
  });
  console.log("formik.values.isDutchAuction", formik.values.isDutchAuction);
  useEffect(() => {
    props.formValid({ isTouched: formik.dirty, isValid: formik.isValid });
  }, [formik.isValid, formik.dirty]);

  return (
    <>
      <h2>On Chain Configuration</h2>
      <>
        <Form
          onSubmit={(...a) => {
            return formik.handleSubmit(...a);
          }}
          noValidate
        >
          <Form.Group className="mb-3" controlId="formMaxTokens">
            <Form.Label>
              Collection Size{" "}
              <TooltipInfo>
                Max number of NFTs that can be minted until sell out.
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              onWheel={numberInputOnWheelPreventChange}
              type={"number"}
              value={formik.values.maxTokens}
              onChange={formik.handleChange}
              isValid={formik.touched.maxTokens && !formik.errors.maxTokens}
              isInvalid={formik.touched.maxTokens && !!formik.errors.maxTokens}
              name="maxTokens"
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.maxTokens}
            </Form.Control.Feedback>
          </Form.Group>
          {/*<Form.Group className="mb-3" controlId="formBasicCheckbox">*/}
          {/*  <Form.Check type="checkbox" label="Check me out" />*/}
          {/*</Form.Group>*/}
          <Form.Group className="mb-3" controlId="formWorkStartTime">
            <Form.Label>
              Start Time <TooltipInfo>Public mint start time</TooltipInfo>
            </Form.Label>
            <Form.Control
              type={"datetime-local"}
              // defaultValue={defaultTime()}

              // className={'form-input mt-1 block w-full'}
              name="startDate"
              onChange={formik.handleChange}
              value={formik.values.startDate}
              isValid={formik.touched.startDate && !formik.errors.startDate}
              isInvalid={formik.touched.startDate && !!formik.errors.startDate}
            />
            <Form.Label>
              {`${formatInUTC(parseISO(formik.values.startDate))} UTC`}
            </Form.Label>

            <Form.Control.Feedback type="invalid">
              {formik.errors.startDate}
            </Form.Control.Feedback>
          </Form.Group>

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

          <Form.Group className="mb-3" controlId="formIsDutchAuction">
            <Form.Label>
              Dutch Auction{" "}
              <TooltipInfo>
                Dutch Auctions gradually lower the mint price over time.
              </TooltipInfo>
            </Form.Label>
            <Form.Check
              name="isDutchAuction"
              type="checkbox"
              checked={formik.values.isDutchAuction}
              // value={formik.values.isDutchAuction?.toString()}
              onChange={formik.handleChange}
              isValid={
                formik.touched.isDutchAuction && !formik.errors.isDutchAuction
              }
            />
          </Form.Group>

          <Collapse in={formik.values.isDutchAuction}>
            <div>
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
                    The price will drop at this interval. 5 minutes is
                    recommended (300 seconds).
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
                    The auction price drops based on a decay rate. When above
                    0.5 the price drops quickly then gradually slows down. When
                    under 0.5, the price drops slowly then gradually speeds up
                    near auction end. When equal to 0.5 the price drops
                    linearly.
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
                  auction. Elapsed time is a close estimate because actual time
                  is based on the blockchain.
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
            </div>
          </Collapse>

          <Form.Group className="mb-3" controlId="formRoyaltyAddress">
            <Form.Label>
              Royalty Address{" "}
              <TooltipInfo>
                Royalty payout address for secondary marketplace sales. Note:
                Mint proceeds go to the creator's address.
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              name="royaltyAddress"
              onWheel={numberInputOnWheelPreventChange}
              type="text"
              value={formik.values.royaltyAddress}
              onChange={formik.handleChange}
              isValid={
                formik.touched.royaltyAddress && !formik.errors.royaltyAddress
              }
              isInvalid={
                formik.touched.royaltyAddress && !!formik.errors.royaltyAddress
              }
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.royaltyAddress}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRoyaltyPercent">
            <Form.Label>
              Royalty Percent{" "}
              <TooltipInfo>
                Percentage of secondary sales that must payout to your royalty
                address.
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              type="number"
              value={formik.values.royaltyPercent}
              name="royaltyPercent"
              onChange={formik.handleChange}
              isValid={
                formik.touched.royaltyPercent && !formik.errors.royaltyPercent
              }
              isInvalid={
                formik.touched.royaltyPercent && !!formik.errors.royaltyPercent
              }
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.royaltyPercent}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSelector">
            <Form.Label>
              Canvas Selector{" "}
              <TooltipInfo>
                CSS selector targetting your sketch. This is used to capture the
                preview image of your canvas.
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              placeholder={"#sketch > canvas"}
              type="text"
              value={formik.values.selector}
              name="selector"
              onChange={formik.handleChange}
              isValid={formik.touched.selector && !formik.errors.selector}
              isInvalid={formik.touched.selector && !!formik.errors.selector}
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.selector}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formResolution">
            <Form.Label>
              <span>
                Image Preview Resolution{" "}
                <TooltipInfo>
                  Dimensions of the NFT image in the format "width:height"
                </TooltipInfo>
              </span>
            </Form.Label>

            <Form.Control
              name="resolution"
              placeholder={"1080:1080"}
              type="text"
              value={formik.values.resolution}
              onChange={formik.handleChange}
              isValid={formik.touched.resolution && !formik.errors.resolution}
              isInvalid={
                formik.touched.resolution && !!formik.errors.resolution
              }
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.resolution}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLicense">
            <Form.Label>
              <span>
                NFT License{" "}
                <TooltipInfo>
                  Optional NFT License. This is used to display the license on
                  the NFT and in the NFT metadata.
                </TooltipInfo>
              </span>
            </Form.Label>

            <Form.Control
              name="license"
              placeholder={"NFT License"}
              type="text"
              value={formik.values.license}
              onChange={formik.handleChange}
              isValid={formik.touched.license && !formik.errors.license}
              isInvalid={formik.touched.license && !!formik.errors.license}
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.license}
            </Form.Control.Feedback>
          </Form.Group>

          {/*<Form.Group className="mb-3" controlId="formPixelRatio">*/}
          {/*  <Form.Label>*/}
          {/*    Image Preview Pixel Ratio{" "}*/}
          {/*    <TooltipInfo>*/}
          {/*      Pixel density to render the image preview*/}
          {/*    </TooltipInfo>*/}
          {/*  </Form.Label>*/}
          {/*  <Form.Control*/}
          {/*    type={"number"}*/}
          {/*    placeholder={"1"}*/}
          {/*    defaultValue={defaults.pixelRatio}*/}
          {/*    min={"0"}*/}
          {/*    max={"10"}*/}
          {/*    name="project_pixel_ratio"*/}
          {/*    onChange={(e) => setPixelRatio(parseFloat(e.target.value) || 1)}*/}
          {/*  />*/}
          {/*</Form.Group>*/}
          {/*<Form.Group className="mb-3" controlId="formLicense">*/}
          {/*  <Form.Label>License</Form.Label>*/}
          {/*  <Form.Control*/}
          {/*    type={"text"}*/}
          {/*    defaultValue={defaults.license}*/}
          {/*    placeholder={"CBE-NECR-HS"}*/}
          {/*    name="project_license"*/}
          {/*    onChange={(e) => setLicense(e.target.value)}*/}
          {/*  />*/}
          {/*</Form.Group>*/}
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </>

      {/*<Form*/}
      {/*  action={"/api/workUpload"}*/}
      {/*  method={"post"}*/}
      {/*  encType={"multipart/form-data"}*/}
      {/*>*/}
      {/*  <Form.Group controlId="formFile" className="mb-3">*/}
      {/*    <Form.Label>Default file input example</Form.Label>*/}
      {/*    <Form.Control type="file" />*/}
      {/*  </Form.Group>*/}
      {/*  <Button variant="primary" type="submit">*/}
      {/*    Upload*/}
      {/*  </Button>*/}
      {/*</Form>*/}
    </>
  );
};
