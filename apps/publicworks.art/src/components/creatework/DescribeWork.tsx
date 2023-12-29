import { ButtonPW as Button } from "../button/Button";
import { FlexBox } from "../layout/FlexBoxCenter";
import { LiveMedia } from "../media/LiveMedia";
import { TooltipInfo } from "../tooltip/TooltipInfo";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { useFormik } from "formik";
import { FC, useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { BsArrowRepeat } from "react-icons/bs";
import { generateTxHash } from "src/generateHash";
import { EditProjectRequest } from "src/store";
import { normalizeMetadataUri } from "src/wasm/metadata";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export interface CreateWorkProps {
  onCreateProject:
    | ((req: Partial<EditProjectRequest>) => void)
    | ((req: Partial<EditProjectRequest>) => Promise<void>);
  defaultValues?: WorkSerializable;
  formValid: (props: { isValid: boolean; isTouched: boolean }) => void;
}

export const schema = z.object({
  description: z.string(),
  blurb: z.string(),
  additionalDescription: z.string().optional(),
  creator: z.string(),
  externalLink: z.string().url().optional(),
});

export const DescribeWork: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  const defaults = {
    description: props.defaultValues?.description || undefined,
    blurb: props.defaultValues?.blurb || undefined,
    codeCid: props.defaultValues?.codeCid,
    externalLink: props.defaultValues?.externalLink || undefined,
    creator: props.defaultValues?.creator || "",
    name: props.defaultValues?.name || "",
    additionalDescription: props.defaultValues?.additionalDescription || "",
    // additionalDescription: props.defaultValues? || "",
  };

  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values, { resetForm }) => {
      // console.log("values", values);
      // alert(JSON.stringify(values, null, 2));
      await props.onCreateProject(values);
      await resetForm();
    },
    validationSchema: toFormikValidationSchema(schema),
    // validateOnMount: true,
  });

  const [hash, setHash] = useState<string>(generateTxHash());

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  useEffect(() => {
    props.formValid({
      isTouched: formik.dirty,
      isValid: formik.isValid,
    });
  }, [formik.isValid, formik.dirty, props]);
  return (
    <>
      <>
        <>
          <h2>Work Description</h2>

          {defaults.codeCid && (
            <div>
              {defaults?.codeCid && (
                <>
                  <LiveMedia
                    ipfsUrl={{
                      cid: defaults.codeCid,
                      hash,
                    }}
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
          )}
          <Form
            onSubmit={(...a) => {
              return formik.handleSubmit(...a);
            }}
            noValidate
          >
            <Form.Group className="mt-3 mb-3" controlId="formWorkName">
              <Form.Label>
                Name{" "}
                <TooltipInfo>
                  Name is highly visible, and is included in NFT metadata.
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                defaultValue={defaults.name}
                value={formik.values.name}
                placeholder={"Appears in every NFT"}
                onChange={formik.handleChange}
                name="name"
                isValid={formik.touched.name && !formik.errors.name}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

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
                value={formik.values.description}
                placeholder={"Appears in every NFT description"}
                onChange={formik.handleChange}
                name="description"
                // isValid={
                //   formik.touched.description && !formik.errors.description
                // }
                isInvalid={
                  formik.touched.description && !!formik.errors.description
                }
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWorkBlurb">
              <Form.Label>
                Blurb{" "}
                <TooltipInfo>
                  Short collection description that is stored on chain and
                  displayed on the launchpad. Cannot be changed after contract
                  creation.
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                defaultValue={defaults.blurb}
                value={formik.values.blurb}
                placeholder={"Appears on launchpad"}
                onChange={formik.handleChange}
                isValid={formik.touched.blurb && !formik.errors.blurb}
                isInvalid={formik.touched.blurb && !!formik.errors.blurb}
                name="blurb"
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAdditionalDescription">
              <Form.Label>
                Additional Description{" "}
                <TooltipInfo>
                  Optional extended description which only appears on
                  publicworks.art.
                </TooltipInfo>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                defaultValue={defaults.additionalDescription}
                value={formik.values.additionalDescription}
                placeholder={"Appears on publicworks.art"}
                onChange={formik.handleChange}
                isValid={
                  formik.touched.additionalDescription &&
                  !formik.errors.additionalDescription
                }
                isInvalid={
                  formik.touched.additionalDescription &&
                  !!formik.errors.additionalDescription
                }
                name="additionalDescription"
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
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
                defaultValue={defaults.externalLink}
                value={formik.values.externalLink}
                placeholder={"artproject.com"}
                onChange={formik.handleChange}
                isValid={
                  formik.touched.externalLink && !formik.errors.externalLink
                }
                isInvalid={
                  formik.touched.externalLink && !!formik.errors.externalLink
                }
                name="externalLink"
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.externalLink}
              </Form.Control.Feedback>
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
                placeholder={"skymagic"}
                name="creator"
                onChange={formik.handleChange}
                isValid={formik.touched.creator && !formik.errors.creator}
                isInvalid={formik.touched.creator && !!formik.errors.creator}
                value={formik.values.creator}
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.creator}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </>
      </>
    </>
  );
};
