import { parseISO } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import { FC, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { EditProjectRequest } from "src/store";
import { WorkSerializable } from "src/dbtypes/works/workSerializable";
import { RowWideContainer } from "../layout/RowWideContainer";
import { TooltipInfo } from "../tooltip/TooltipInfo";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { isISODate } from "src/util/isISODate";
import { ButtonPW as Button } from "../button/Button";
import { useWallet } from "@stargazezone/client";
import { isStarAddress, toStars } from "../../wasm/address";

// const formatInTimeZone = (date: Date, fmt: string, tz: string) =>
//   format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

function defaultDate() {
  const date = new Date();
  const coeff = 1000 * 60 * 60 * 24;
  const rounded = new Date(Math.round(date.getTime() / coeff + 1) * coeff);
  return rounded;
}

function defaultTime() {
  const rounded = defaultDate();
  return formatDateInput(rounded);
}

function formatDateInput(date: Date) {
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

export const schema = z.object({
  maxTokens: z.number().min(1).max(10_000).optional().default(1),
  startDate: z
    .string()
    .refine(isISODate, { message: "Not a valid ISO string date " })
    .refine((v) => new Date(v) > new Date(), "Must be in the future")
    .transform((v) => parseISO(v).toISOString())
    .optional(),
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

const formatInUTC = (date: Date | null | undefined) => {
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
export const NftDetails2: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const sgwallet = useWallet();
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
      defaultTime(),
  };
  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values, { resetForm }) => {
      console.log("values", values);
      // alert(JSON.stringify(values, null, 2));

      await props.onCreateProject({
        ...values,
        startDate: values.startDate
          ? parseISO(values.startDate).toISOString()
          : undefined,
      });
    },
    validationSchema: toFormikValidationSchema(schema),
    // validateOnMount: true,
  });
  useEffect(() => {
    props.formValid({ isTouched: formik.dirty, isValid: formik.isValid });
  }, [formik.isValid, formik.dirty]);

  //todo add license field

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
              onWheel={() => false}
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
              onWheel={() => false}
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
