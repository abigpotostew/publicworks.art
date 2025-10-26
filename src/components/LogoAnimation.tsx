import React, { useEffect, useMemo, useRef, useState } from "react";
// import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from "next/dynamic";
import { Container } from "react-bootstrap";
import useSize from "@react-hook/size";
import { type P5CanvasInstance } from "@p5-wrapper/react";

/**
 * The magic box should be smaller and more 3d
 * poof coming out when the mint comes out
 * animate the bottom to be more 3d by moving up and down as well as top face
 */

const ReactP5Wrapper = dynamic(
  // @ts-ignore
  () => import("@p5-wrapper/react").then((mod) => mod.ReactP5Wrapper),
  {
    ssr: false,
  }
);

function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function ease(x: number): number {
  return easeInOutQuart(x);
}

const containerHeight = 400;
let fontRegular: any;
const LogoAnimation: React.FC = () => {
  const ref = useRef(null);
  const [sketchKey, setSketchKey] = useState(0);
  const [widthContainer, heightContainer] = useSize(ref);
  useEffect(() => {
    setSketchKey((p) => p + 1);
  }, [widthContainer]);

  const sketchMemo = useMemo(
    () => createSketch(widthContainer, containerHeight),
    [widthContainer, containerHeight]
  );

  return (
    <Container
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        height: containerHeight,
      }}
    >
      {/* @ts-ignore */}
      <ReactP5Wrapper key={sketchKey} sketch={sketchMemo} />
    </Container>
  );
  // return <Sketch setup={setup} draw={draw} />;
};

const createSketch = (widthContainer: number, containerHeight: number) => {
  return (p5: P5CanvasInstance) => {
    p5.preload = () => {
      fontRegular = p5.loadFont("/font/AdventPro-Medium.ttf");
    };

    //See annotations in JS for more information
    p5.setup = () => {
      p5.createCanvas(widthContainer, containerHeight); //.parent(canvasParentRef);
      p5.colorMode(p5.HSB);
      // p5.noSmooth()
    };

    p5.draw = () => {
      // console.log('vel',vel )
      p5.push();
      p5.background(255);
      // p5.translate(p5.width / 2, p5.height / 2)
      // p5.noFill()
      // p5.stroke(255)

      p5.textAlign(p5.CENTER, p5.CENTER);
      // p5.textSize(width/10)
      p5.textFont(fontRegular, p5.width / 10);

      p5.push();
      p5.translate(p5.width / 2, p5.height / 2);
      const n = 5;
      // for (let i = 0; i < n; i++) {
      // }

      p5.push();
      const rot = p5.millis() / 1000;
      const rotm = p5.PI / 8;
      p5.rotate((rot * rotm) % rotm);
      let w = p5.textWidth("Public") * 1.05;
      p5.text("Public", -w / 2, 0);
      p5.pop();
      p5.rotate((rot * rotm) % rotm);
      w = p5.textWidth("Works") * 1.05;
      p5.text("Works", w / 2, 0);

      p5.pop();

      p5.noStroke();
    };
  };
};

interface Vector {
  x: number;
  y: number;
}

//easeOutExpo
const easeParticle = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export default LogoAnimation;
