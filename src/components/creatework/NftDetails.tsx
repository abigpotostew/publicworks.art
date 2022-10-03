import { parseISO } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import { Button, Container, Form } from "react-bootstrap";
import { RowThinContainer } from "../layout/RowThinContainer";
import { CreateProjectRequest, EditProjectRequest } from "../../store";
import { WorkSerializable } from "../../dbtypes/works/workSerializable";
import { RowWideContainer } from "../layout/RowWideContainer";
import { TooltipInfo } from "../TooltipInfo";

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
}

const formatInUTC = (date: Date) => {
  const out = formatInTimeZone(date, "UTC", "LLLL d, yyyy kk:mm"); // 2014-10-25 06:46:20-04:00
  return out;
};
export const NftDetails: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const user = { address: "stars1up88jtqzzulr6z72cq6uulw9yx6uau6ew0zegy" };
  const defaults = {
    maxTokens: props.defaultValues?.maxTokens || 0,
    royaltyAddress: props.defaultValues?.royaltyAddress || user.address,
    royaltyPercent:
      (props?.defaultValues?.royaltyPercent &&
        props.defaultValues.royaltyPercent) ||
      5,

    resolution: props.defaultValues?.resolution || "1080:1080",
    pixelRatio: props.defaultValues?.pixelRatio || 1,
    selector: props.defaultValues?.selector || undefined,
    license: props.defaultValues?.license || undefined,
    priceStars: props.defaultValues?.priceStars || 50,
  };
  console.log("Defaults,", defaults);

  const [projectSize, setProjectSize] = useState<number>(defaults.maxTokens);
  const [startDate, setStartDate] = useState<Date>(defaultDate());
  const [royaltyAddress, setRoyaltyAddress] = useState<string>(
    defaults.royaltyAddress
  );
  const [royaltyPercent, setRoyaltyPercent] = useState<number>(
    defaults.royaltyPercent
  );
  const [resolution, setResolution] = useState<string>(defaults.resolution);
  const [pixelRatio, setPixelRatio] = useState<number>(defaults.pixelRatio);
  const [selector, setSelector] = useState<string | undefined>(
    defaults.selector
  );
  const [license, setLicense] = useState<string | undefined>(defaults.license);
  const [priceStars, setPriceStars] = useState<number>(defaults.priceStars);

  const onDateChange: ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const parsed = parseISO(e.target.value); // , 'yyyy-LL-dd', new Date()
    // console.log("actual date", e.target.value, "parsed date", parsed);
    const date = parsed;
    // date = setYear(date, parsed.getFullYear());
    // date = setMonth(date, parsed.getMonth());
    // date = setDay(date, parsed.getDate());
    setStartDate(date);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // create project in api
    // create contract
    const req = {
      projectSize,
      startDate: startDate.toISOString(),
      royaltyAddress,
      royaltyPercent,
      selector,
      resolution,
      priceStars,
      pixelRatio,
      license,
    };
    console.log("hello heres the request", req);
    props.onCreateProject(req);
  };

  return (
    <Container>
      <RowWideContainer>
        <Form onSubmit={onSubmit} noValidate>
          <Form.Group className="mb-3" controlId="formWorkSize">
            <Form.Label>Collection Size</Form.Label>
            <Form.Control
              type={"number"}
              placeholder={"1"}
              min={"1"}
              max={"10000"}
              defaultValue={props.defaultValues?.maxTokens}
              onChange={(e) =>
                setProjectSize(parseInt(e.target.value, 10) || 1)
              }
              name="project_collection_size"
            />
          </Form.Group>
          {/*<Form.Group className="mb-3" controlId="formBasicCheckbox">*/}
          {/*  <Form.Check type="checkbox" label="Check me out" />*/}
          {/*</Form.Group>*/}

          <Form.Group className="mb-3" controlId="formWorkStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type={"datetime-local"}
              // defaultValue={defaultTime()}
              defaultValue={
                (props.defaultValues?.startDate &&
                  formatDateInput(new Date(props.defaultValues.startDate))) ||
                defaultTime()
              }
              // className={'form-input mt-1 block w-full'}
              name="project_public_start_time"
              onChange={onDateChange}
            />

            <Form.Group className="mb-3" controlId="">
              <Form.Label>{`${formatInUTC(startDate)} UTC`}</Form.Label>
            </Form.Group>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>{`${startDate.toISOString()}`}</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPriceStars">
              <Form.Label>Price in $Stars</Form.Label>
              <Form.Control
                type="number"
                defaultValue={defaults.priceStars}
                min={50}
                name="project_price_stars"
                onChange={(e) => setPriceStars(parseFloat(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRoyaltyAddress">
              <Form.Label>Royalty Address</Form.Label>
              <Form.Control
                type="text"
                defaultValue={defaults.royaltyAddress}
                placeholder={user.address}
                name="project_royalty_address"
                onChange={(e) => setRoyaltyAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRoyaltyPercent">
              <Form.Label>Royalty Percent</Form.Label>
              <Form.Control
                type={"number"}
                placeholder={"5"}
                min={"0"}
                max={"100"}
                defaultValue={defaults.royaltyPercent}
                name="project_royalty_percentage"
                onChange={(e) =>
                  setRoyaltyPercent(parseFloat(e.target.value) || 1)
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSelector">
              <Form.Label>
                CSS Selector{" "}
                <TooltipInfo>
                  CSS selector targeting your sketch canvas element. Right click
                  your canvas element in the console and copy the css selector
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                type={"text"}
                placeholder={"#sketch > canvas"}
                name="project_selector"
                defaultValue={defaults.selector}
                onChange={(e) => setSelector(e.target.value)}
              />
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
                type={"text"}
                placeholder={"2000:2000"}
                defaultValue={defaults.resolution}
                name="project_resolution"
                onChange={(e) => setResolution(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPixelRatio">
              <Form.Label>
                Image Preview Pixel Ratio{" "}
                <TooltipInfo>
                  Pixel density to render the image preview
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                type={"number"}
                placeholder={"1"}
                defaultValue={defaults.pixelRatio}
                min={"0"}
                max={"10"}
                name="project_pixel_ratio"
                onChange={(e) => setPixelRatio(parseFloat(e.target.value) || 1)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLicense">
              <Form.Label>License</Form.Label>
              <Form.Control
                type={"text"}
                defaultValue={defaults.license}
                placeholder={"CBE-NECR-HS"}
                name="project_license"
                onChange={(e) => setLicense(e.target.value)}
              />
            </Form.Group>
          </Form.Group>

          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </RowWideContainer>

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
    </Container>
  );
};
