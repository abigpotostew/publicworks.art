import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from "next/dynamic";
import { Container } from "react-bootstrap";
import useSize from "@react-hook/size";
// Will only import `react-p5` on client-side

/**
 * The magic box should be smaller and more 3d
 * poof coming out when the mint comes out
 * animate the bottom to be more 3d by moving up and down as well as top face
 */

// @ts-ignore
const LogoSketch = dynamic(
  // @ts-ignore
  () => import("react-p5").then((mod) => mod.default),
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
let fontRegular: p5Types.Font;
const SpinAnimaton: React.FC = () => {
  const ref = useRef(null);
  const [sketchKey, setSketchKey] = useState(0);
  const [widthContainer, heightContainer] = useSize(ref);
  useEffect(() => {
    setSketchKey((p) => p + 1);
  }, [widthContainer, heightContainer]);

  const [doRender, setDoRender] = useState(false);

  useEffect(() => {
    setDoRender(true);
  }, []);

  const preload = (p5: p5Types) => {
    // fontRegular = p5.loadFont("/font/AdventPro-Medium.ttf");
  };

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(widthContainer, containerHeight).parent(canvasParentRef);
    p5.colorMode(p5.HSB);
    // p5.noSmooth()
  };

  // const drawTwirlingCircles = (p5: p5Types, size: number) => {
  //   p5.fill("black");
  //   p5.noStroke();
  //   const rmax = size;
  //   const rmin = size / 2;
  //   const offsetF = size;
  //   const poss = [
  //     p5.createVector(0, -1),
  //     p5.createVector(1, 0),
  //     p5.createVector(0, 1),
  //     p5.createVector(-1, 0),
  //   ];
  //   const aniTime = 3000;
  //   const t = ease((p5.millis() / aniTime) % 1);
  //   const drawit = (
  //     scale: number,
  //     s: p5Types.Vector,
  //     e: p5Types.Vector,
  //     flip = false
  //   ) => {
  //     const offset = scale * offsetF;
  //     s = s.copy().mult(offset);
  //     e = e.copy().mult(offset);
  //     const r = p5.lerp(rmax * scale, rmin * scale, flip ? 1 - t : t);
  //     const p = p5Types.Vector.lerp(s, e, t);
  //
  //     p5.ellipse(p.x, p.y, r);
  //   };
  //   const n = 2;
  //   for (let i = 0; i < n; i++) {
  //     const z = Math.pow((i + 1) / n, 1.75);
  //     drawit(z, poss[0], poss[1], i % 2 === 0);
  //     drawit(z, poss[1], poss[2], (i + 1) % 2 === 0);
  //     drawit(z, poss[2], poss[3], i % 2 === 0);
  //     drawit(z, poss[3], poss[0], (i + 1) % 2 === 0);
  //   }
  // };
  // const drawWorm = (p5: p5Types, size: number) => {
  //   const res = 60;
  //   let a = p5.millis() / 100;
  //   const len = p5.TWO_PI * 0.1;
  //   const circleRotation = a / res;
  //   const fixRad = size;
  //   const phase = 1.5;
  //   const height = size / 8;
  //   p5.noFill();
  //   p5.beginShape();
  //   p5.strokeCap(p5.ROUND);
  //   p5.strokeJoin(p5.ROUND);
  //   p5.strokeWeight(size / 12);
  //
  //   const step = (p5.TWO_PI * phase) / res;
  //   for (let i = 0; i < res; i++) {
  //     const changingRad = p5.sin(a) * height;
  //
  //     const [x, y] = [
  //       p5.cos((i / res) * 2 * len + circleRotation) * fixRad +
  //         p5.cos((i / res) * len + circleRotation) * changingRad * 0.5,
  //       p5.sin((i / res) * 2 * len + circleRotation) * fixRad +
  //         p5.sin((i / res) * len + circleRotation) * changingRad * 0.5,
  //     ];
  //     p5.vertex(x, y);
  //     // p5.vertex((i / res) * size, p5.sin(a) * height);
  //     // p5.ellipse(x, y, 10, 10);
  //     a += step;
  //   }
  //   p5.endShape();
  // };
  const drawChasingTail = (p5: p5Types, size: number) => {
    const res = size / 2;
    let a = p5.millis() / 200;
    const len = p5.TWO_PI * 0.85;
    const circleRotation = (a / res) * 10.58;
    const fixRad = size;
    const phase = 4;
    const height = size * 0.1;
    p5.noFill();
    p5.beginShape();
    p5.strokeCap(p5.ROUND);
    p5.strokeJoin(p5.ROUND);
    p5.strokeWeight(size / 5);
    p5.stroke("purple");

    const step = (p5.TWO_PI * phase) / res;
    for (let i = 0; i < res; i++) {
      const changingRad = p5.sin(a) * height;

      const [x, y] = [
        p5.cos((i / res) * len + circleRotation) * fixRad +
          p5.cos((i / res) * len + circleRotation) * changingRad,
        p5.sin((i / res) * len + circleRotation) * fixRad +
          p5.sin((i / res) * len + circleRotation) * changingRad,
      ];
      p5.vertex(x, y);
      // p5.vertex((i / res) * size, p5.sin(a) * height);
      // p5.ellipse(x, y, 10, 10);
      a += step;
    }
    p5.endShape();
    const changingRad = p5.sin(a) * height;
    const of = 4 / res + 1;
    const [x, y] = [
      p5.cos(of * len + circleRotation) * fixRad,
      // p5.cos(of * len + circleRotation) * changingRad,
      p5.sin(of * len + circleRotation) * fixRad,
      // p5.sin(of * len + circleRotation) * changingRad,
    ];
    p5.fill("purple");
    p5.noStroke();
    p5.ellipse(x, y, size / 2);
  };

  const orbits = (p5: p5Types, size: number) => {
    const res = 1;
    const t = p5.millis() / 6000;
    const circum = size * p5.TWO_PI;
    const fixRadMax = size * 0.2;
    const ellipseRad = circum / 10;
    const orbitellipseRad = ellipseRad / 7;
    const phase = 4;
    const height = size * 0.1;
    p5.noFill();
    p5.strokeCap(p5.ROUND);
    p5.strokeJoin(p5.ROUND);
    p5.strokeWeight(size / 6);

    const dottedCircle = () => {
      const segments = 4;
      for (let i = 0; i < segments; i++) {
        p5.arc(
          0,
          0,
          ellipseRad,
          ellipseRad,
          (i / segments) * p5.TWO_PI,
          ((i + 1) / segments) * p5.TWO_PI
        );
      }
    };

    for (let i = 0; i < res; i++) {
      const [x, y] = [
        p5.cos((t + i / res) * p5.TWO_PI) * fixRadMax +
          p5.cos((t * 2 + i / res) * p5.TWO_PI) * fixRadMax * 0.5,
        p5.sin((t + i / res) * p5.TWO_PI) * fixRadMax +
          p5.sin((t * 2 + i / res) * p5.TWO_PI) * fixRadMax * 0.5,
      ];
      p5.ellipse(x, y, ellipseRad);
      const orbitsn = 3;
      for (let j = 0; j < orbitsn; j++) {
        const [ox, oy] = [
          p5.cos((j / orbitsn + t * 1.5 + i / res) * p5.TWO_PI) * ellipseRad,
          p5.sin((j / orbitsn + t * 1.5 + i / res) * p5.TWO_PI) * ellipseRad,
        ];
        p5.ellipse(x + ox, y + oy, (j === 0 ? 2 : 1) * orbitellipseRad);
      }
    }
  };

  const dottedCircle = (p5: p5Types, size: number) => {
    const res = 1;
    const t = p5.millis() / 6000;
    const circum = size * p5.TWO_PI;
    const fixRadMax = size * 0.2;
    const ellipseRad = circum / 10;
    const orbitellipseRad = ellipseRad / 7;
    const phase = 4;
    const height = size * 0.1;
    p5.noFill();
    p5.strokeCap(p5.ROUND);
    p5.strokeJoin(p5.ROUND);
    p5.strokeWeight(size / 10);

    const dottedCircle = () => {
      const segments = 7;
      const spacing = 0.5;
      const segmentArc = (1 / segments) * p5.TWO_PI * (1 - spacing);
      for (let i = 0; i < segments; i++) {
        p5.arc(
          0,
          0,
          ellipseRad,
          ellipseRad,
          (i / segments) * p5.TWO_PI,
          (i / segments) * p5.TWO_PI + segmentArc
        );
      }
    };
    const dottedCircleMoving = () => {
      const segments = 7;

      const spacing = t % 1;
      const segmentArc = (1 / segments) * p5.TWO_PI * (1 - spacing);
      for (let i = 0; i < segments; i++) {
        p5.arc(
          0,
          0,
          ellipseRad,
          ellipseRad,
          (i / segments) * p5.TWO_PI,
          (i / segments) * p5.TWO_PI + segmentArc
        );
      }
    };
    dottedCircle();
  };
  const segmentedSquad = (p5: p5Types, size: number) => {
    const aniTime = (p5.millis() / 5000) % 1;
    let t = aniTime;
    // const calcT
    if (t < 0.5) {
      t = ease(t * 2);
    } else {
      t = 1 + ease((t - 0.5) * 2);
    }
    p5.noStroke();

    const drawArcs = (t: number, r: number) => {
      p5.push();
      p5.fill("blue");
      p5.rotate(p5.HALF_PI + t * p5.PI);
      p5.arc(0, 0, r, r, 0, p5.PI);
      p5.fill("teal");
      p5.rotate(p5.PI);
      p5.arc(0, 0, r, r, 0, p5.PI);
      p5.pop();
    };
    p5.fill("blue");
    p5.rect(0, 0, size / 2, size);
    p5.fill("teal");
    p5.rect(size / 2, 0, size / 2, size);
    p5.translate(size / 2, size / 2);
    drawArcs(t, size);
    drawArcs(1 - t, size / 2);
  };
  const segmentedSquad2 = (p5: p5Types, size: number) => {
    const aniTime = p5.millis() / 9000;
    let t = aniTime % 1;
    // const calcT
    if (t < 0.5) {
      t = ease(t * 2);
    } else {
      t = 1 + ease((t - 0.5) * 2);
    }
    p5.noStroke();

    const drawArcs = (t: number, r: number) => {
      p5.push();
      p5.fill("blue");
      p5.rotate(p5.HALF_PI + t * p5.PI);
      p5.arc(0, 0, r, r, 0, p5.PI);
      p5.fill("teal");
      p5.rotate(p5.PI);
      p5.arc(0, 0, r, r, 0, p5.PI);
      p5.pop();
    };

    p5.push();
    p5.rectMode(p5.CENTER);
    const doRot = (rots: number) => {
      const rtbucket = (Math.floor(aniTime * rots) / rots) % 1;
      const rt = ease((aniTime * rots) % 1);
      p5.rotate(rtbucket * p5.TWO_PI + (rt * p5.TWO_PI) / rots);
    };

    p5.fill("blue");
    p5.rect(-size / 4, 0, size / 2, size);
    p5.fill("teal");
    p5.rect(size / 4, 0, size / 2, size);
    p5.ellipse(0, 0, 10, 10);
    doRot(5);
    drawArcs(t, size);
    p5.pop();
    // p5.translate(size / 2, size / 2);
    p5.push();
    doRot(8);
    drawArcs(t, size * 0.8);
    p5.pop();
    p5.push();
    doRot(3);
    drawArcs((1 - t) * 2, size / 2);
    p5.pop();
  };
  const draw = (p5: p5Types) => {
    // console.log('vel',vel )
    p5.push();
    p5.background(255);
    // p5.translate(p5.width / 2, p5.height / 2)
    // p5.noFill()
    // p5.stroke(255)
    // p5.push();
    // p5.translate(p5.width / 4, p5.height / 2);
    // drawTwirlingCircles(p5, p5.min(p5.width, p5.height) / 4);
    // p5.pop();
    //
    p5.push();
    p5.translate(p5.width * 0.75, p5.height / 2);
    drawChasingTail(p5, p5.min(p5.width, p5.height) / 4);
    p5.pop();
    p5.push();
    p5.translate(p5.width * 0.25, p5.height / 2);
    orbits(p5, p5.min(p5.width, p5.height) / 4);
    p5.pop();
    p5.push();
    p5.translate(p5.width * 0.5, p5.height / 2);
    dottedCircle(p5, p5.min(p5.width, p5.height) / 5);
    p5.pop();
    p5.push();
    p5.translate(p5.width * 0.5, p5.height * 0.6);
    segmentedSquad(p5, p5.min(p5.width, p5.height) / 5);
    p5.pop();

    p5.push();
    p5.translate(p5.width * 0.1, p5.height * 0.3);
    segmentedSquad2(p5, p5.min(p5.width, p5.height) / 5);
    p5.pop();
  };

  return (
    <Container
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        height: containerHeight,
      }}
    >
      {doRender && (
        <LogoSketch
          key={sketchKey}
          preload={preload}
          setup={setup}
          draw={draw}
          // mouseMoved={mouseMoved}
        />
      )}
    </Container>
  );
  // return <Sketch setup={setup} draw={draw} />;
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
