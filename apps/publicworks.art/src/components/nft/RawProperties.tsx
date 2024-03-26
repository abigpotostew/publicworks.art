import { RawTokenProperties } from "src/types/Sandbox";
import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validAttributes } from "@publicworks/shared-utils/attributes";

interface Props {
  properties: RawTokenProperties;
}

export const RawProperties: FC<RawTokenProperties> = (
  props: RawTokenProperties
) => {
  const validity = validAttributes(props.properties);
  const keys = props.properties ? Object.keys(props.properties) : [];
  console.log("properties", props.properties);
  const acceptedAttrTypes = ["string", "boolean", "number"];
  return (
    <ul>
      {keys.map((k, index) => (
        <li key={index}>
          <span>
            {k}: {props.properties[k].toString()}{" "}
          </span>

          {!acceptedAttrTypes.includes(typeof props.properties[k]) ? (
            <span>
              <FontAwesomeIcon icon={"xmark"} width={18} /> This attribute value
              should be a string, number, or boolean but received{" "}
              {typeof props.properties[k]}.{" "}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
