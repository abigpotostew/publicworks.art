import React, { useEffect, useMemo, useRef, useState } from "react";
// import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from "next/dynamic";
import useSize from "@react-hook/size";
import { animationLibrary } from "src/components/animations/animations";
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
type Animations = keyof typeof animationLibrary | "kitchensink";
interface Props {
  width: number;
  height: number;
  animation: Animations;
}
const containerHeight = 400;
const SpinAnimaton: React.FC<Props> = ({ animation, width, height }) => {
  const ref = useRef(null);
  const [sketchKey, setSketchKey] = useState(0);
  const [widthContainer, heightContainer] = useSize(ref);
  //console.log([width, height], [widthContainer, heightContainer]);
  // useEffect(() => {
  //   setSketchKey((p) => p + 1);
  // }, [widthContainer, heightContainer]);

  // const [doRender, setDoRender] = useState(true);

  // useEffect(() => {
  //   // setDoRender(true);
  // }, []);

  const sketchMemo = useMemo(
    () => createSketch({ width, height, animation }),
    [width, height, animation]
  );

  return (
    <div ref={ref} className={"d-inline"}>
      {/* @ts-ignore */}
      <ReactP5Wrapper key={sketchKey} sketch={sketchMemo} />
    </div>
  );
  // return <Sketch setup={setup} draw={draw} />;
};

const createSketch = ({
  width,
  height,
  animation,
}: {
  width: number;
  height: number;
  animation: Animations;
}) => {
  return (p5: P5CanvasInstance) => {
    //See annotations in JS for more information
    p5.setup = () => {
      p5.createCanvas(width, height); //.parent(canvasParentRef);
      p5.colorMode(p5.HSB);
    };

    p5.draw = () => {
      // console.log('vel',vel )
      p5.push();
      p5.background(255);

      const kitchenSink = () => {
        p5.push();
        p5.translate(p5.width * 0.75, p5.height / 2);
        animationLibrary.drawChasingTail(p5, {
          size: p5.min(p5.width, p5.height) / 4,
          w: p5.min(p5.width, p5.height) / 4,
          h: p5.height,
        });
        p5.pop();
        p5.push();
        p5.translate(p5.width * 0.25, p5.height / 2);
        animationLibrary.orbits(p5, {
          size: p5.min(p5.width, p5.height) / 4,
          w: p5.min(p5.width, p5.height) / 4,
          h: p5.height,
        });
        p5.pop();
        p5.push();
        p5.translate(p5.width * 0.5, p5.height / 2);
        animationLibrary.dottedCircle(p5, {
          size: p5.min(p5.width, p5.height) / 5,
          w: p5.min(p5.width, p5.height) / 5,
          h: p5.height,
        });
        p5.pop();
        p5.push();
        p5.translate(p5.width * 0.5, p5.height * 0.6);
        animationLibrary.segmentedSquad(p5, {
          size: p5.min(p5.width, p5.height) / 5,
          w: p5.min(p5.width, p5.height) / 5,
          h: p5.height,
        });
        p5.pop();

        p5.push();
        p5.translate(p5.width * 0.1, p5.height * 0.3);
        animationLibrary.segmentedSquad2(p5, {
          size: p5.min(p5.width, p5.height) / 5,
          w: p5.min(p5.width, p5.height) / 5,
          h: p5.height,
        });
        p5.pop();

        p5.push();
        p5.translate(p5.width * 0.1, p5.height * 0.5);

        animationLibrary.yinyang(p5, {
          size: p5.min(p5.width, p5.height) / 5,
          w: p5.min(p5.width, p5.height) / 5,
          h: p5.height,
        });
        p5.pop();

        p5.push();
        p5.translate(p5.width * 0.1, p5.height * 0.7);

        animationLibrary.walkingCircleCombined(p5, {
          size: p5.min(p5.width, p5.height) * 0.8 * 2,
          w: p5.min(p5.width, p5.height) * 0.8 * 2,
          h: p5.height,
        });
        p5.pop();

        p5.push();
        p5.translate(p5.width * 0.4, p5.height * 0.1);

        animationLibrary.waveyFlower(p5, {
          size: p5.width * 0.3,
          w: p5.width * 0.3,
          h: p5.height,
        });
        p5.pop();
      };
      p5.clear();
      if (animation === "kitchensink") {
        kitchenSink();
      } else {
        p5.push();
        animationLibrary[animation](p5, {
          size: p5.width,
          w: p5.width,
          h: p5.height,
        });
        // animationLibrary.waveyFlower(p5, p5.width, p5.height);
        p5.pop();
      }
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

export default SpinAnimaton;
