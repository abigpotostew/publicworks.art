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
import { RowMediumContainer } from "../layout/RowMediumContainer";

const schema = z.object({
  name: z.string().min(3),
});

export interface CreateWorkProps {
  onCreateProject:
    | ((req: Partial<EditProjectRequest>) => void)
    | ((req: Partial<EditProjectRequest>) => Promise<void>);
  defaultValues?: WorkSerializable;
  onUpload?: (files: File[]) => Promise<void> | void;
  hideTitle?: boolean;
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
    <RowWideContainer>
      <Form
        onSubmit={(...a) => {
          return formik.handleSubmit(...a);
        }}
        noValidate
      >
        <div className={"tw-flex tw-justify-center"}>
          <div
            className={
              "tw-inline-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6"
            }
          >
            <div
              className={
                "tw-col-span-2 tw-ring-slate-100 lg:tw-ring-1 tw-rounded-md tw-bg-white tw-sm:rounded-lg"
              }
            >
              {!props.hideTitle && (
                <h2 className={"tw-pb-0 lg:tw-px-4 lg:tw-pt-4"}>Code Upload</h2>
              )}
              <Form.Group className="lg:tw-p-4" controlId="formWorkName">
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
              <div className={"tw-px-4"}>
                {!!user.data && (
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                )}
              </div>
              <div className={"tw-px-4 tw-py-4"}>
                {!user.data && <NeedToLoginButton />}
              </div>
              {props.onUpload && (
                <div className={"tw-px-4"}>
                  <p>Upload your Work Zip</p>
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
              )}
            </div>
            <div className={""}>
              {props.onUpload && (
                <RowWideContainer className={"mb-3 "}>
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
            </div>
          </div>
        </div>
        {/*divider*/}
      </Form>
    </RowWideContainer>
  );
};
