import React, { FC, FormEventHandler, useCallback, useState } from "react";
import { Form } from "react-bootstrap";
import { EditProjectRequest } from "../../store/project.types";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { RowWideContainer } from "../layout/RowWideContainer";
import { LiveMedia } from "../media/LiveMedia";
import { generateTxHash } from "../../generateHash";
import { BsArrowRepeat } from "react-icons/bs";
import { FlexBox } from "../layout/FlexBoxCenter";
import { DropZone } from "../DropZone";
import { ButtonPW as Button } from "../button/Button";
import { TooltipInfo } from "src/components/tooltip/TooltipInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { NeedToLoginButton } from "../login/NeedToLoginButton";
import useUserContext from "../../context/user/useUserContext";

const schema = z.object({
  name: z.string().min(3),
});

export interface CreateWorkProps {
  onCreateProject:
    | ((req: Partial<EditProjectRequest>) => void)
    | ((req: Partial<EditProjectRequest>) => Promise<void>);
  defaultValues?: WorkSerializable;
  onUpload?: (files: File[]) => Promise<void> | void;
}

export const NameWork: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const defaults = {
    name: props.defaultValues?.name || "",
    codeCid: props.defaultValues?.codeCid,
  };
  const [projectName, setProjectName] = useState<string>(defaults.name);
  const [hash, setHash] = useState<string>(generateTxHash());
  const { user } = useUserContext();
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const req = {
      name: projectName,
    };
    props.onCreateProject(req);
  };

  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values, { resetForm }) => {
      const req = {
        ...values,
      };
      await props.onCreateProject(req);
      await resetForm();
    },
    validationSchema: toFormikValidationSchema(schema),
    // validateOnMount: true,
  });

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  return (
    <>
      <>
        <>
          <Form
            onSubmit={(...a) => {
              return formik.handleSubmit(...a);
            }}
            noValidate
          >
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
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder="My Work"
                name="name"
                isValid={formik.touched.name && !formik.errors.name}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              {/*<Form.Text className="text-muted">*/}
              {/*  {"We'll never share your email with anyone else."}*/}
              {/*</Form.Text>*/}
            </Form.Group>

            {/*divider*/}

            {props.onUpload && (
              <RowWideContainer className={"mb-3"}>
                <div className={"mt-3 mb-3"}>
                  <h3>Upload your Work Zip</h3>
                  <DropZone
                    accept={"zip"}
                    onUpload={async (files) =>
                      props?.onUpload && props.onUpload(files)
                    }
                  >
                    <FontAwesomeIcon icon={"upload"} width={16} /> Drag and drop
                    your project zip file here, or click to upload
                  </DropZone>
                </div>
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
                </div>
              </RowWideContainer>
            )}

            {/*divider*/}

            {!user.data && <NeedToLoginButton />}
            {!!user.data && (
              <Button variant="primary" type="submit">
                Save
              </Button>
            )}
          </Form>
        </>
      </>
    </>
  );
};
