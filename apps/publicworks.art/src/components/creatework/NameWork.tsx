import React, { FC } from "react";
import { Form } from "react-bootstrap";
import { EditProjectRequest } from "../../store/project.types";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { DropZone } from "../DropZone";
import { ButtonPW, ButtonPW as Button } from "../button/Button";
import { TooltipInfo } from "src/components/tooltip/TooltipInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { NeedToLoginButton } from "../login/NeedToLoginButton";
import useUserContext from "../../context/user/useUserContext";
import { CreateLayout } from "./CreateLayout";

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
  const { user } = useUserContext();

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

  return (
    <div>
      <Form
        onSubmit={(...a) => {
          return formik.handleSubmit(...a);
        }}
        noValidate
      >
        <div className={"tw-flex tw-justify-center"}>
          <CreateLayout
            codeCid={defaults.codeCid ?? undefined}
            hideLiveMedia={!props.onUpload}
          >
            {!props.hideTitle && (
              <h2 className={"tw-pb-0 lg:tw-px-4 lg:tw-pt-4"}>Code Upload</h2>
            )}
            <Form.Group className="lg:tw-p-4" controlId="formWorkName">
              <Form.Label>
                Name{" "}
                <TooltipInfo>
                  Your work name is highly visible, on and off chain. This can
                  be changed later but not after deploying on chain.
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
              <div className={"tw-px-4 tw-pb-4"}>
                <p>Upload your Work Zip</p>
                <DropZone
                  accept={"zip"}
                  onUpload={async (files) =>
                    props?.onUpload && props.onUpload(files)
                  }
                >
                  <div
                    className={"tw-flex tw-flex-row tw-items-center tw-gap-4"}
                  >
                    <ButtonPW variant={"outline-primary"}>
                      <FontAwesomeIcon icon={"upload"} width={16} /> Upload
                    </ButtonPW>
                    Drag and drop your project zip file here, or click to upload
                  </div>
                </DropZone>
              </div>
            )}
          </CreateLayout>
        </div>
        {/*divider*/}
      </Form>
    </div>
  );
};
