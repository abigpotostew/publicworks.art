import { FC } from "react";
import { Form } from "react-bootstrap";
import { EditUserRequest, EditUserRequestZ } from "src/store/user.types";
import { TooltipInfo } from "../tooltip";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ButtonPW as Button } from "../button/Button";
import { UserSerializable } from "@publicworks/db-typeorm/serializable";

// const formatInTimeZone = (date: Date, fmt: string, tz: string) =>
//   format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

export interface EditProfileProps {
  onSubmit:
    | ((req: Partial<EditUserRequest>) => void)
    | ((req: Partial<EditUserRequest>) => Promise<void>);
  defaultValues?: UserSerializable;
}

const schema = EditUserRequestZ;
export const EditProfile: FC<EditProfileProps> = (props: EditProfileProps) => {
  // auth context here
  const defaults = {
    name: props.defaultValues?.name || "",
  };
  const formik = useFormik({
    initialValues: defaults,
    onSubmit: async (values) => {
      // console.log("values", values);
      // alert(JSON.stringify(values, null, 2));
      await props.onSubmit(values);
    },
    validationSchema: toFormikValidationSchema(schema),
  });

  return (
    <>
      <>
        <Form
          onSubmit={(...a) => {
            return formik.handleSubmit(...a);
          }}
          noValidate
        >
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>
              Username{" "}
              <TooltipInfo>User name displayed on publicworks.art</TooltipInfo>
            </Form.Label>
            <Form.Control
              value={formik.values.name}
              onChange={formik.handleChange}
              isValid={formik.touched.name && !formik.errors.name}
              isInvalid={formik.touched.name && !!formik.errors.name}
              name="name"
            />
            <Form.Control.Feedback type={"valid"}>
              Looks good!
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </>
    </>
  );
};
