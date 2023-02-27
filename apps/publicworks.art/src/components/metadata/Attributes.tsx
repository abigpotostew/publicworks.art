// @flow
import * as React from "react";
import { Attribute } from "src/hooks/useNftMetadata";
import { Table } from "react-bootstrap";
import styles from "./Attributes.module.scss";
type Props = {
  attributes: Attribute[];
};
export const Attributes = ({ attributes }: Props) => {
  return (
    <Table bordered className={styles.tableRounded}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {attributes.map((attribute, i) => (
          <tr key={i}>
            <td>{attribute.trait_type}</td>
            <td>{attribute.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
