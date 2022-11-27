import { RawTokenProperties } from "src/types/Sandbox";
import { FC } from "react";
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
        <span key={index}>
          {k}: {props.properties[k]}
        </span>
      ))}
    </div>
  );
};
