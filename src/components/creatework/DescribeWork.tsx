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
import { LiveMedia } from "../media/LiveMedia";
import { generateTxHash } from "../../generateHash";
import { normalizeMetadataUri } from "../../wasm/metadata";
import { BsArrowRepeat } from "react-icons/bs";
import { FlexBox } from "../layout/FlexBoxCenter";
import { DropZone } from "../DropZone";
import { TooltipInfo } from "../TooltipInfo";

export interface CreateWorkProps {
  onCreateProject:
    | ((req: Partial<EditProjectRequest>) => void)
    | ((req: Partial<EditProjectRequest>) => Promise<void>);
  defaultValues?: WorkSerializable;
}

export const DescribeWork: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const user = { address: "stars1up88jtqzzulr6z72cq6uulw9yx6uau6ew0zegy" };
  const defaults = {
    description: props.defaultValues?.description || "",
    blurb: props.defaultValues?.blurb || "",
    codeCid: props.defaultValues?.codeCid,
    externalLink: props.defaultValues?.externalLink || "",
    creator: props.defaultValues?.creator || "",
  };
  const [projectDescription, setProjectDescription] = useState<string>(
    defaults.description
  );
  const [projectBlurb, setProjectBlurb] = useState<string>(defaults.blurb);
  const [externalLink, setExternalLink] = useState<string>(
    defaults.externalLink
  );
  const [creator, setCreator] = useState<string>(defaults.creator);

  const [hash, setHash] = useState<string>(generateTxHash());

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const req = {
      projectDescription,
      projectBlurb,
      creator,
      externalLink,
    };
    props.onCreateProject(req);
  };

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  return (
    <>
      <Container>
        <h2>Work Description</h2>
        {defaults.codeCid && (
          <RowWideContainer>
            <div>
              {defaults?.codeCid && (
                <>
                  <LiveMedia
                    ipfsUrl={
                      normalizeMetadataUri("ipfs://" + defaults.codeCid) +
                      "?hash=" +
                      hash
                    }
                    minHeight={500}
                    style={{}}
                  ></LiveMedia>
                  <a onClick={onClickRefreshHash}>
                    <FlexBox
                      style={{
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <div>New Hash</div>
                      <BsArrowRepeat style={{ marginLeft: ".5rem" }} />
                    </FlexBox>
                  </a>
                </>
              )}
            </div>
          </RowWideContainer>
        )}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formWorkDescription">
            <Form.Label>
              Description{" "}
              <TooltipInfo>
                Description is included in NFT metadata.
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={defaults.description}
              placeholder={"Appears in every NFT description"}
              onChange={(e) => setProjectDescription(e.target.value)}
              name="project_description"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formWorkBlurb">
            <Form.Label>
              Blurb{" "}
              <TooltipInfo>
                Short collection description that is stored on chain and
                dsiaplayed on the launchpad. Cannot be changed after contract
                creation.
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={defaults.blurb}
              placeholder={"Appears on publicworks.art"}
              onChange={(e) => setProjectBlurb(e.target.value)}
              name="project_blurb"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formExternalLink">
            <Form.Label>
              External Link{" "}
              <TooltipInfo>
                Optional link that is included on chain and displayed on
                publicworks.art
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={defaults.externalLink}
              placeholder={"artproject.com"}
              onChange={(e) => setExternalLink(e.target.value)}
              name="external_link"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCreator">
            <Form.Label>
              Author Name{" "}
              <TooltipInfo>
                What name do you want displayed as the creator?
              </TooltipInfo>
            </Form.Label>
            <Form.Control
              defaultValue={defaults.creator}
              placeholder={"skymagic.eth"}
              onChange={(e) => setCreator(e.target.value)}
              name="creator"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Container>
    </>
  );
};
