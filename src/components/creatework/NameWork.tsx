import { FC, FormEventHandler, useCallback, useState } from "react";
import { Container, Form, Row } from "react-bootstrap";
import { RowThinContainer } from "../layout/RowThinContainer";
import { EditProjectRequest } from "../../store";
import { WorkSerializable } from "../../dbtypes/works/workSerializable";
import { RowWideContainer } from "../layout/RowWideContainer";
import { LiveMedia } from "../media/LiveMedia";
import { generateTxHash } from "../../generateHash";
import { normalizeMetadataUri } from "../../wasm/metadata";
import { BsArrowRepeat } from "react-icons/bs";
import { FlexBox } from "../layout/FlexBoxCenter";
import { DropZone } from "../DropZone";
import { ButtonPW as Button } from "../button/Button";
import { TooltipInfo } from "src/components/TooltipInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface CreateWorkProps {
  onCreateProject:
    | ((req: Partial<EditProjectRequest>) => void)
    | ((req: Partial<EditProjectRequest>) => Promise<void>);
  defaultValues?: WorkSerializable;
  onUpload?: (files: File[]) => Promise<void>;
}

export const NameWork: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const defaults = {
    name: props.defaultValues?.name || "",
    codeCid: props.defaultValues?.codeCid,
  };
  const [projectName, setProjectName] = useState<string>(defaults.name);
  const [hash, setHash] = useState<string>(generateTxHash());

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const req = {
      name: projectName,
    };
    props.onCreateProject(req);
  };

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  return (
    <>
      <>
        <>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formWorkName">
              <Form.Label>
                Name{" "}
                <TooltipInfo>
                  Your work name is highly visible, on and off chain. This can
                  be changed later.
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                type="text"
                defaultValue={defaults.name}
                placeholder="My Work"
                name="project_name"
                onChange={(e) => setProjectName(e.target.value)}
              />
              {/*<Form.Text className="text-muted">*/}
              {/*  {"We'll never share your email with anyone else."}*/}
              {/*</Form.Text>*/}
            </Form.Group>

            {/*divider*/}

            {props.onUpload && (
              <RowWideContainer>
                <div>
                  {!defaults?.codeCid && (
                    <>
                      <div style={{ minHeight: 500 }}></div>
                    </>
                  )}
                  {defaults?.codeCid && (
                    <>
                      <LiveMedia
                        ipfsUrl={{ cid: defaults.codeCid, hash }}
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
                  <h3>Upload your Work Zip</h3>
                  <DropZone
                    onUpload={async (files) =>
                      props?.onUpload && props.onUpload(files)
                    }
                  >
                    <FontAwesomeIcon icon={"upload"} width={16} /> Drag and drop
                    your project zip file here, or click to upload
                  </DropZone>
                </div>
              </RowWideContainer>
            )}

            {/*divider*/}

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </>
      </>
    </>
  );
};
