import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from 'next/dynamic'
import { Container } from "react-bootstrap";
import useSize from "@react-hook/size";
import { hashCode } from "../util/hashcode";
// Will only import `react-p5` on client-side

// @ts-ignore
const LogoSketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})


interface ComponentProps {
  //Your component props
}
function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}
function ease(x:number):number{
  return easeInOutQuart(x)
}

const xn = 8;
const yn = 8;
const bgColor = '#212529'

const colorModifiers = new Array(xn * yn).fill(0);
let sizeNorm:number;
let border:number;
let width:number;
let height:number;
const numNfts = 2;
const nftNames=['GenArt','PFP','1of1',"Interactive","JS Art", 'AI Art'];
let nftIds:string[]=[];
const animationDuration=3000;
const createNftName=(p5:p5Types, existing:string[])=>{
  while(true){
    const nameTry = p5.random(nftNames)
    if(!existing.length || nameTry!== existing[0]){
      existing.unshift(nameTry)
      break;
    }
  }
}

const containerHeight = 400;
const SketchAnimation: React.FC<ComponentProps> = (props: ComponentProps) => {
  const ref = useRef(null);
  const [sketchKey, setSketchKey]=useState(0)
  const [widthContainer, heightContainer] = useSize(ref)
  useEffect(()=>{
    setSketchKey((p)=>p+1)
  },[widthContainer])

  const [doRender, setDoRender] = useState(false);

  useEffect(() => {
    setDoRender(true)
  }, [])

  
  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    nftIds=[];
    p5.colorMode(p5.HSB)
    for (let i = 0; i < numNfts; i++) {
      // nftIds.push(p5.random(nftNames))
      createNftName(p5,nftIds)
    }
    p5.createCanvas(widthContainer, containerHeight).parent(canvasParentRef);
    // p5.noSmooth()
     sizeNorm = 0.8;
     border = (1 - sizeNorm) * 0.5;
     const smaller=p5.min(p5.width*0.25,p5.height*0.8)
     width = smaller * 0.8
     height = smaller * 0.8
  };
  //
  const mouseMoved = (p5: p5Types) => {
    
  }
  const nftColor=(name:string)=> hashCode(name)%100;
  
  const drawMints = (p5:p5Types)=>{
    //based on time, draw up to 3 mint cards
    
    const aniTime =( p5.millis() % animationDuration )/animationDuration;
    const localWidth = (p5.width-width)/2* .75;
    
    const localWidthBorder = (p5.width-width)/2* .25;
    const n = 2;
    const localWidthIndiv=localWidth/n;
    const boxSize=localWidthIndiv*0.4;
    p5.push()


    // @ts-ignore
    // p5.drawingContext.clearRect(0, 0, localWidthBorder, p5.height);
    
    
    const drawMint=()=>{
      p5.fill(50);
      p5.rect(0, 0, boxSize,boxSize)
      p5.fill(100)
      p5.textAlign(p5.CENTER,p5.CENTER)
      p5.text('Mint',boxSize/2,boxSize/2)
    }
    
    if(aniTime<0.5){
      //render still
      for (let i = 0; i < n; i++) {
        p5.push()
        p5.translate(localWidthBorder + localWidth*(i/n), p5.height/2-boxSize*0.5)
        drawMint()
        p5.pop()
      }
      
    }else{
      //rtender moving

      const aniTimeLocal = (aniTime-0.5)*2;
      for (let i = 0; i < n+1; i++) {
        p5.push()
        const aniOffset=ease(aniTimeLocal);
        p5.translate(localWidthBorder + localWidth*(i/n) +aniOffset*localWidth*((1)/n) - localWidth*((1)/n), p5.height/2-boxSize*0.5)
        drawMint()
        p5.pop()
      }
    }
    p5.erase();
    p5.rect(0,0,localWidthBorder,p5.height)
    p5.noErase()
    
    p5.pop()
  }

  const drawNfts = (p5:p5Types)=>{
    //based on time, draw up to 3 mint cards
    const aniTime =( p5.millis() % animationDuration )/animationDuration;
    const localWidth = (p5.width-width)/2* .75;

    const localWidthBorder = (p5.width-width)/2* .25;
    
    const localWidthIndiv=localWidth/numNfts;
    const boxSize=localWidthIndiv*0.4;
    p5.push()


    // @ts-ignore
    // p5.drawingContext.clearRect(0, 0, localWidthBorder, p5.height);

    p5.translate(p5.width/2,0)

    const drawNft=(name:string)=>{
      const col = nftColor(name)
      p5.fill(col,80,90);
      p5.rect(0, 0, boxSize,boxSize)
      p5.fill(100-col, 80, 0)
      p5.textAlign(p5.CENTER,p5.CENTER)
      
      // const name = p5.random(nftNames)
      p5.text(name,boxSize/2,boxSize/2)
    }

    if(aniTime<0.5){
      if(nftIds.length>numNfts){
        nftIds.pop()
      }
      //render still
      for (let i = 0; i < numNfts; i++) {
        p5.push()
        p5.translate(width/3 + localWidthBorder + localWidth*(i/numNfts), p5.height/2-boxSize*0.5)
        drawNft(nftIds[i])
        p5.pop()
      }

    }else{
      if(nftIds.length<=numNfts){
        // nftIds.unshift(p5.random(nftNames))
        createNftName(p5,nftIds)
      }
      //render moving

      const aniTimeLocal = (aniTime-0.5)*2;
      for (let i = 0; i < numNfts+1; i++) {
        p5.push()
        const aniOffset=ease(aniTimeLocal);
        p5.translate(width/3 + localWidthBorder + localWidth*(i/numNfts) +aniOffset*localWidth*((1)/numNfts) - localWidth*((1)/numNfts), p5.height/2-boxSize*0.5)
        drawNft(nftIds[i])
        p5.pop()
      }
    }
    p5.erase();
    // p5.fill(255)
    p5.rect(p5.width/2-localWidthBorder*1.1,0, localWidthBorder*1.1,p5.height)
    p5.noErase()

    p5.pop()
  }
  
  const draw = (p5: p5Types) => {
    // console.log('vel',vel )
    p5.push()
    p5.background(bgColor);
    // p5.translate(p5.width / 2, p5.height / 2)
    // p5.noFill()
    // p5.stroke(255)
    p5.clear()
    

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
      const nscale = 1.5;
      return Math.abs(p5.noise(x / xn * nscale, y / yn * nscale, p5.millis() / 3000));
    }
    const colliding=(x:number,y:number,size:number,offset:number)=>{
      
    }
    const m = xn * yn;

    let time = (((p5.millis() )%animationDuration)/animationDuration);
    
    for (let x = xn - 1; x >= 0; x--) {
      const bouncing = p5.sin((time+.25)*p5.TWO_PI + (1-x/xn)*p5.TWO_PI)*0.5+0.5;
      for (let y = 0; y < yn; y++) {
        const i = y * xn + x;
        // p5.push()
        const noise = (nfunc(x, y));
        const offset = Math.round(noise * offsetMax*.5 + (bouncing*offsetMax*0.25));
        const color = bouncing * 100 * 0.4;//(i) / (m) * 100 ;

        const xp = Math.floor(x / xn * (width)) + offset;
        const yp = Math.floor(y / yn * (height)) - offset;

        faces.push(() => {
          let time = (((p5.millis() )%animationDuration)/animationDuration);
          if(time<0.5){
            time*=2;
            time=ease(time);
          }else{
            time=1-(time-0.5)*2
            time=ease(time)
          }
          // const color= (( time* 100) + xn % 100);
          
          p5.fill(100 - (color /*+ 20 * colorModifiers[i]*.2*/ ))
          p5.rect(xp, yp, sizeBox, sizeBox)
        })
        sides.push(() => {
          //bottom
          p5.fill(Math.round(100-color + 100 * 0.1))
          p5.beginShape()
          p5.vertex(xp, yp + sizeBox)
          p5.vertex(xp + sizeBox, yp + sizeBox)
          p5.vertex(xp + sizeBox - offset, yp + sizeBox + offset)
          p5.vertex(xp - offset, yp + sizeBox + offset)
          p5.endShape()
//left
          p5.fill(Math.round(100-color - color * .1))
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
    
    drawMints(p5)
    drawNfts(p5)
    
    
    p5.translate(p5.width/2 - width/2 -width * border ,p5.height/2 - height/2 - height * border)
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
  
  return <Container ref={ref} style={{ display: 'flex', justifyContent: 'center', height: containerHeight }}>
    {doRender &&
        <LogoSketch key={sketchKey} setup={setup} draw={draw} mouseMoved={mouseMoved}/>}
  </Container>
  // return <Sketch setup={setup} draw={draw} />;
};
export default SketchAnimation