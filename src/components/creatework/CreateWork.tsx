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
import { DropZone } from "../DropZone";

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
  const out = `${format(rounded, "yyyy-MM-dd")}T${format(rounded, "kk:mm")}`;
  console.log("default date", out);
  return out;
}

export interface CreateProjectRequest {
  projectName: string;
  projectBlurb: string;
  projectSize: number;
  projectDescription: string;
  startDate: string;
  royaltyAddress: string;
  royaltyPercent: number;
}

export interface CreateWorkProps {
  onCreateProject:
    | ((req: CreateProjectRequest) => void)
    | ((req: CreateProjectRequest) => Promise<void>);
  onUpload: (files: File[]) => Promise<void>;
}

const formatInUTC = (date: Date) => {
  const out = formatInTimeZone(date, "UTC", "LLLL d, yyyy kk:mm"); // 2014-10-25 06:46:20-04:00
  return out;
};
export const CreateWork: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const user = { address: "stars1up88jtqzzulr6z72cq6uulw9yx6uau6ew0zegy" };
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectBlurb, setProjectBlurb] = useState<string>("");
  const [projectSize, setProjectSize] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(defaultDate());
  const [royaltyAddress, setRoyaltyAddress] = useState<string>(user.address);
  const [royaltyPercent, setRoyaltyPercent] = useState<number>(5);
  const onDateChange: ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const parsed = parseISO(e.target.value); // , 'yyyy-LL-dd', new Date()
    console.log("actual date", e.target.value, "parsed date", parsed);
    const date = parsed;
    // date = setYear(date, parsed.getFullYear());
    // date = setMonth(date, parsed.getMonth());
    // date = setDay(date, parsed.getDate());
    setStartDate(date);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      // create project in api
      // create contract
      props.onCreateProject({
        projectName,
        projectBlurb,
        projectSize,
        projectDescription,
        startDate: startDate.toISOString(),
        royaltyAddress,
        royaltyPercent,
      });
    },
    [
      projectName,
      projectSize,
      projectDescription,
      startDate,
      royaltyAddress,
      royaltyPercent,
    ]
  );

  return (
    <Container>
      <RowThinContainer>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formWorkName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="My Work"
              name="project_name"
              onChange={(e) => setProjectName(e.target.value)}
            />
            {/*<Form.Text className="text-muted">*/}
            {/*  {"We'll never share your email with anyone else."}*/}
            {/*</Form.Text>*/}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formWorkDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={"Appears in every NFT description"}
              onChange={(e) => setProjectDescription(e.target.value)}
              name="project_description"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formWorkBlurb">
            <Form.Label>Blurb</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={"Appears on publicworks.art"}
              onChange={(e) => setProjectBlurb(e.target.value)}
              name="project_blurb"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formWorkSize">
            <Form.Label>Collection Size</Form.Label>
            <Form.Control
              type={"number"}
              placeholder={"1"}
              min={"1"}
              max={"10000"}
              onChange={(e) =>
                setProjectSize(parseInt(e.target.value, 10) || 1)
              }
              name="project_collection_size"
            />
          </Form.Group>
          {/*<Form.Group className="mb-3" controlId="formBasicCheckbox">*/}
          {/*  <Form.Check type="checkbox" label="Check me out" />*/}
          {/*</Form.Group>*/}

          <Form.Group className="mb-3" controlId="formWorkSize">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type={"datetime-local"}
              defaultValue={defaultTime()}
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

            <Form.Group className="mb-3" controlId="formRoyaltyAddress">
              <Form.Label>Royalty Address</Form.Label>
              <Form.Control
                type="text"
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
                defaultValue={5}
                name="project_royalty_percentage"
                onChange={(e) =>
                  setRoyaltyPercent(parseFloat(e.target.value) || 1)
                }
              />
            </Form.Group>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </RowThinContainer>

      <DropZone onUpload={(files) => props.onUpload(files)} />

      <Form
        action={"/api/workUpload"}
        method={"post"}
        encType={"multipart/form-data"}
      >
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Default file input example</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
    </Container>
  );
};
