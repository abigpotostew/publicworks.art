import React, { useEffect, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from 'next/dynamic'
import { Container } from "react-bootstrap";
// Will only import `react-p5` on client-side

// @ts-ignore
const LogoSketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})


interface ComponentProps {
  //Your component props
}


const xn = 4;
const yn = 4;
const colorModifiers = new Array(xn * yn).fill(0);
let sizeNorm:number;
let border:number;
let width:number;
let height:number;
const SketchAnimation: React.FC<ComponentProps> = (props: ComponentProps) => {

  const [doRender, setDoRender] = useState(false);

  useEffect(() => {
    setDoRender(true)
  }, [])

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(200, 200).parent(canvasParentRef);
    p5.noSmooth()
     sizeNorm = 0.8;
     border = (1 - sizeNorm) * 0.5;
     width = p5.width * 0.8
     height = p5.height * 0.8
  };
  //
  const mouseMoved = (p5: p5Types) => {
    
  }

  const draw = (p5: p5Types) => {
    // console.log('vel',vel )
    p5.push()
    p5.background('#212529');
    // p5.translate(p5.width / 2, p5.height / 2)
    // p5.noFill()
    // p5.stroke(255)
    p5.clear()

    
    p5.translate(p5.width * border, p5.height * border)

    p5.noStroke();

    const sizeBox = Math.round(1 / xn * width);
    const offsetMax = width * 0.2
    // for (let x = 0; x < xn; x++) {
    //   for (let y = 0; y < yn; y++) {
    const faces = [];
    const sides = [];
    // for (let x = xn-1; x >= 0; x--) {
    //   for (let y = yn-1; y >= 0; y--) {
    // for (let x = 0; x < xn; x++) {
    const nfunc = (x: number, y: number) => {
      const nscale = .5;
      return Math.abs(p5.noise(x / xn * nscale, y / yn * nscale, p5.millis() / 3000));
    }
    const colliding=(x:number,y:number,size:number,offset:number)=>{
      
    }
    const m = xn * yn;
    for (let x = xn - 1; x >= 0; x--) {
      for (let y = 0; y < yn; y++) {
        const i = y * xn + x;
        // p5.push()
        const noise = (nfunc(x, y));
        const offset = Math.round(noise * offsetMax);
        const color = (i) / (m) * 255 ;

        const xp = Math.floor(x / xn * (width)) + offset;
        const yp = Math.floor(y / yn * (height)) - offset;
        if(colliding(xp,yp, sizeBox,offset)){
          
        }
        
        faces.push(() => {
          p5.fill(color + 50 * colorModifiers[i])
          p5.rect(xp, yp, sizeBox, sizeBox)
        })
        sides.push(() => {
          //bottom
          p5.fill(Math.round(color + 255 * 0.2))
          p5.beginShape()
          p5.vertex(xp, yp + sizeBox)
          p5.vertex(xp + sizeBox, yp + sizeBox)
          p5.vertex(xp + sizeBox - offset, yp + sizeBox + offset)
          p5.vertex(xp - offset, yp + sizeBox + offset)
          p5.endShape()
//left
          p5.fill(Math.round(color - color * .2))
          p5.beginShape()
          p5.vertex(xp, yp)
          p5.vertex(xp, yp + sizeBox)
          p5.vertex(xp - offset, yp + offset + sizeBox)
          p5.vertex(xp - offset, yp + offset)
          p5.endShape()
        })
      }
    }

    const render = (rend: () => void) => {
      p5.push()
      rend()
      p5.pop()
    }


    const renderArray = (rends: (() => void)[]) => {
      for (let ren of rends) {
        render(ren)
      }
    }

    for (let i = 0; i < faces.length; i++) {

      render(faces[i])
      render(sides[i])
    }
    // for (let ren of rends) {
    //   p5.push()
    //   ren()
    //   p5.pop()
    // }
    // renderArray(sides)
    // renderArray(faces)


    p5.pop()

    for (let i = 0; i < colorModifiers.length; i++) {
      colorModifiers[i]*=0.98;
    }
  };
  return <Container style={{ display: 'flex', justifyContent: 'center', height: 200 }}>
    {doRender &&
        <LogoSketch setup={setup} draw={draw} mouseMoved={mouseMoved}/>}
  </Container>
  // return <Sketch setup={setup} draw={draw} />;
};
export default SketchAnimation