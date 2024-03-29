import React from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export const ConfettiScreen = () => {
  const { width, height } = useWindowSize();
  return (
    <Confetti
      width={width}
      height={height * 2.5}
      numberOfPieces={100}
      recycle={true}
    />
  );
};
