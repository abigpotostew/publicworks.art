import { FC, useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { LiveMedia } from "../media/LiveMedia";
import { BsArrowRepeat } from "react-icons/bs";
import { FlexBox } from "../layout/FlexBoxCenter";
import { TooltipInfo } from "../TooltipInfo";
import { ButtonPW as Button } from "../button/Button";
import { generateTxHash } from "src/generateHash";
import { normalizeMetadataUri } from "src/wasm/metadata";
import { WorkSerializable } from "src/dbtypes/works/workSerializable";
import { EditProjectRequest } from "src/store";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";

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
  creator: z.string(),
  externalLink: z.string().url().optional(),
});

export const DescribeWork: FC<CreateWorkProps> = (props: CreateWorkProps) => {
  // auth context here
  const user = { address: "stars1up88jtqzzulr6z72cq6uulw9yx6uau6ew0zegy" };
  const defaults = {
    description: props.defaultValues?.description || "",
    blurb: props.defaultValues?.blurb || "",
    codeCid: props.defaultValues?.codeCid,
    externalLink: props.defaultValues?.externalLink || undefined,
    creator: props.defaultValues?.creator || "",
  };

  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values) => {
      // console.log("values", values);
      // alert(JSON.stringify(values, null, 2));
      await props.onCreateProject(values);
    },
    validationSchema: toFormikValidationSchema(schema),
  });

  const [hash, setHash] = useState<string>(generateTxHash());

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  useEffect(() => {
    props.formValid({ isTouched: formik.dirty, isValid: formik.isValid });
  }, [formik.isValid, formik.touched]);
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
          )}
          <Form
            onSubmit={(...a) => {
              return formik.handleSubmit(...a);
            }}
            noValidate
          >
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
                isValid={
                  formik.touched.description && !formik.errors.description
                }
                isInvalid={
                  formik.touched.description && !!formik.errors.description
                }
              />
              <Form.Control.Feedback type={"valid"}>
                Looks good!
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
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
                rows={2}
                defaultValue={defaults.blurb}
                value={formik.values.blurb}
                placeholder={"Appears on publicworks.art"}
                onChange={formik.handleChange}
                isValid={formik.touched.blurb && !formik.errors.blurb}
                isInvalid={formik.touched.blurb && !!formik.errors.blurb}
                name="blurb"
              />
              <Form.Control.Feedback type={"valid"}>
                Looks good!
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type={"valid"}>
                Looks good!
              </Form.Control.Feedback>
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
                placeholder={"skymagic.eth"}
                name="creator"
                onChange={formik.handleChange}
                isValid={formik.touched.creator && !formik.errors.creator}
                isInvalid={formik.touched.creator && !!formik.errors.creator}
                value={formik.values.creator}
              />
              <Form.Control.Feedback type={"valid"}>
                Looks good!
              </Form.Control.Feedback>
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
