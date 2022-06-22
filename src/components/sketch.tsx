import React, { ReactComponentElement, useEffect, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from 'next/dynamic'
import { Container, Row } from "react-bootstrap";
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})


interface ComponentProps {
  //Your component props
}

let vel = 0;
let accel = 0;
let previousHeading;

const HomepageSketch: React.FC<ComponentProps> = (props: ComponentProps) => {

  const [doRender, setDoRender] = useState(false);

  useEffect(() => setDoRender(true), [])

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(200, 200).parent(canvasParentRef);
    previousHeading = p5.createVector();

  };

  const mouseMoved = (p5: p5Types) => {
    if (p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height)
      return;
    const heading = p5.createVector(p5.mouseX, p5.mouseY)
    const pointer = heading.sub(previousHeading)
    const length = pointer.mag()
    accel +=  length/p5.TWO_PI*0.002;
    previousHeading = heading;
  }

  const draw = (p5: p5Types) => {
    vel += accel;
    accel *= 0.95;
    vel *= 0.99;
    // console.log('vel',vel )
    p5.push()
    p5.background('#212529');
    p5.translate(p5.width / 2, p5.height / 2)
    p5.noFill()
    p5.stroke(255)
    // p5.clear()

    p5.strokeCap(p5.ROUND)
    p5.strokeJoin(p5.ROUND)
    const m = 8;
    for (let j = 0; j < m; j++) {
      p5.strokeWeight((j + 2) / m * 4)
      p5.beginShape()
      p5.push()
      p5.rotate(vel*0.2 + p5.sin(p5.millis() / 1000 * 1.0 * (j * 0.4)) * 0.15)
      const r = (j + 1) / m * p5.width / 2 * 0.9;
      const n = 3;
      for (let i = 0; i < n; i++) {
        p5.vertex(p5.cos(i / n * p5.TWO_PI - p5.HALF_PI) * r, p5.sin(i / n * p5.TWO_PI - p5.HALF_PI) * r)
      }

      // p5.vertex(30,30)
      // p5.vertex(-30,30)
      p5.endShape(p5.CLOSE)
      p5.pop()
    }

    p5.pop()
  };
  return <Container style={{ display: 'flex', justifyContent: 'center', height: 200 }}>
    {doRender &&
        <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved}/>}
  </Container>
  // return <Sketch setup={setup} draw={draw} />;
};
export default HomepageSketch