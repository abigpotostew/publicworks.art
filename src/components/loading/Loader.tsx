import React from "react";
import { Puff } from "react-loader-spinner";

export default function SpinnerLoading() {
  return (
    <span style={{ display: "inline-block" }}>
      <Puff color="#00BFFF" height={16} width={16} />{" "}
    </span>
  );
}
