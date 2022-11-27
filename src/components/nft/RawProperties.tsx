import { RawTokenProperties } from "src/types/Sandbox";
import { FC, Fragment } from "react";
import { Pill } from "src/components/content/Pill";
import { Row } from "react-bootstrap";
interface Props {
  properties: RawTokenProperties;
}
export const RawProperties: FC<RawTokenProperties> = (
  props: RawTokenProperties
) => {
  const keys = props.properties ? Object.keys(props.properties) : [];
  console.log("properties", props.properties);
  return (
    <div>
      {keys.map((k, index) => (
        <Fragment key={index}>
          <Pill color={"red"}>
            <Row>{k}</Row>
            <Row>{props.properties[k]}</Row>
          </Pill>
        </Fragment>
      ))}
    </div>
  );
};
