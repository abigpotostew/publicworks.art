import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from "next/dynamic";
import { Container } from "react-bootstrap";
import useSize from "@react-hook/size";
import { hashCode } from "../util/hashcode";
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
const LogoAnimation: React.FC = () => {
  const ref = useRef(null);
  const [sketchKey, setSketchKey] = useState(0);
  const [widthContainer, heightContainer] = useSize(ref);
  useEffect(() => {
    setSketchKey((p) => p + 1);
  }, [widthContainer]);

  const [doRender, setDoRender] = useState(false);

  useEffect(() => {
    setDoRender(true);
  }, []);

  const preload = (p5: p5Types) => {
    fontRegular = p5.loadFont("/font/AdventPro-Medium.ttf");
  };

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(widthContainer, containerHeight).parent(canvasParentRef);
    p5.colorMode(p5.HSB);
    // p5.noSmooth()
  };

  const draw = (p5: p5Types) => {
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

    // const drawCurve = function (curve: Bezier, i: number) {
    //   const colors = ["red", "orange", "teal", "blue"];
    //   p5.push();
    //   p5.translate(50, 50);
    //   p5.stroke(colors[i % colors.length]);
    //   p5.noFill();
    //   const p = curve.points;
    //   const [ox, oy] = [0, 0];
    //   // console.log(p);
    //   p5.bezier(
    //     p[0].x + ox,
    //     p[0].y + oy,
    //     p[1].x + ox,
    //     p[1].y + oy,
    //     p[2].x + ox,
    //     p[2].y + oy,
    //     p[3].x + ox,
    //     p[3].y + oy
    //   );
    //
    //   p5.noStroke();
    //
    //   for (let j = 0; j < p.length; j++) {
    //     p5.fill(colors[j]);
    //     p5.ellipse(p[j].x, p[j].y, 4, 4);
    //   }
    //
    //   // p5.fill("blue");
    //   // p5.ellipse(p[3].x, p[3].y, 4, 4);
    //   //
    //   // p5.fill("orange");
    //   // p5.ellipse(p[1].x, p[1].y, 4, 4);
    //   // p5.fill("teal");
    //   // p5.ellipse(p[2].x, p[2].y, 4, 4);
    //   p5.pop();
    // };
    //
    // const attempt1 = () => {
    //   const points = [
    //     [
    //       [0, 0],
    //       [0, 100],
    //       [100, 100],
    //     ],
    //     [
    //       [100, 100],
    //       [100, 0],
    //       [0, 0],
    //     ],
    //   ];
    //   const curves = points.map((sbe) => {
    //     const points = sbe.map((p) => ({ x: p[0], y: p[1] }));
    //     return Bezier.cubicFromPoints(points[0], points[1], points[2], 0.5);
    //   });
    //   // const curve = new Bezier(points);
    //   // p5.textWidth();
    //
    //   // p5.push();
    //   // p5.translate(100, 100);
    //   // p5.stroke(0);
    //   drawCurve(curves[0], 0);
    //   drawCurve(curves[1], 1);
    //   // p5.pop();
    // };
    //
    // const attempt2 = () => {
    //   const [w, h] = [200, 200];
    //   const [cx, cy] = [w / 2, h / 2];
    //   const pad = 0;
    //
    //   const r = (w - 2 * pad) / 2,
    //     k = 0.55228,
    //     kr = k * r;
    //   const [ex, ey] = [w / 8, h / 8];
    //   const points = [
    //     // first curve:
    //     { x: cx + ex, y: pad },
    //     { x: cx + kr, y: pad },
    //     { x: w - pad, y: cy - kr },
    //     { x: w - pad, y: cy - ey },
    //     // subsequent curve right side
    //     { x: w - pad, y: cy - ey },
    //     { x: w - pad, y: cy + ey },
    //     { x: w - pad, y: cy + ey },
    //     // subsequent curve bottom right corner
    //     { x: w - pad, y: cy + ey + kr },
    //     { x: cx + kr + ex, y: h - pad + ey },
    //     { x: cx + ex, y: h - pad + ey },
    //     // subsequent curve
    //     { x: cx - kr, y: h - pad },
    //     { x: pad, y: cy + kr },
    //     { x: pad, y: cy },
    //     // final curve control point
    //     { x: pad, y: cy - kr },
    //     { x: cx - kr, y: pad },
    //   ];
    //   if (p5.frameCount === 0) console.log({ points });
    //   const quad = false; //cubic!
    //   const pts = points;
    //   const c1 = quad
    //     ? new Bezier(pts[0], pts[1], pts[2])
    //     : new Bezier(pts[0], pts[1], pts[2], pts[3]);
    //
    //   const c2 = quad
    //     ? new Bezier(pts[2], pts[3], pts[4])
    //     : new Bezier(pts[3], pts[4], pts[5], pts[6]);
    //
    //   const c3 = quad
    //     ? new Bezier(pts[4], pts[5], pts[6])
    //     : new Bezier(pts[6], pts[7], pts[8], pts[9]);
    //
    //   const c4 = quad
    //     ? new Bezier(pts[6], pts[7], pts[0])
    //     : new Bezier(pts[9], pts[10], pts[11], pts[12]);
    //
    //   const c5 = quad
    //     ? new Bezier(pts[6], pts[7], pts[0])
    //     : new Bezier(pts[12], pts[13], pts[14], pts[0]);
    //
    //   const curves = [c1, c2, c3, c4, c5];
    //   for (let i = 0; i < 3; i++) {
    //     drawCurve(curves[i], i);
    //     // const outlines = curves[i].outline(30);
    //     // for (const outlineC of outlines.curves) {
    //     //   const ps = outlineC.points;
    //     //   if (ps.length === 4) {
    //     //     // const inner = Bezier.cubicFromPoints(ps[0], ps[1], ps[2], 0.5);
    //     //     drawCurve(outlineC, i);
    //     //   }
    //     // }
    //   }
    //
    //   // c4.drawSkeleton();
    //   // c4.drawCurve();
    //   // c4.drawPoints(false);
    // };
    // attempt2();

    p5.noStroke();
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

export default LogoAnimation;
