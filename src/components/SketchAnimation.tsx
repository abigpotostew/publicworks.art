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
const xn = 7;
const yn = 5;
const bgColor = "#212529";

const colorModifiers = new Array(xn * yn).fill(0);
let sizeNorm: number;
let border: number;
let width: number;
let height: number;
const numNfts = 2;

const nftNames = [
  "GenArt",
  "PFP",
  "ASCII",
  "1of1",
  "Animation",
  "Interactive",
  "JS Art",
  "AI Art",
];
let nftIds: string[] = [];
const animationDuration = 3000;
let puff: Puff;
let newPuff: () => void;
const createNftName = (p5: p5Types, existing: string[]) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const nameTry = p5.random(nftNames);
    if (!existing.length || nameTry !== existing[0]) {
      existing.unshift(nameTry);
      break;
    }
  }
};

const containerHeight = 400;
let fontRegular: p5Types.Font;
let mintColor: p5Types.Color;
let mintColorFrame: p5Types.Color;
const SketchAnimation: React.FC = () => {
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
    nftIds = [];
    p5.colorMode(p5.HSB);
    for (let i = 0; i < numNfts; i++) {
      // nftIds.push(p5.random(nftNames))
      createNftName(p5, nftIds);
    }
    p5.createCanvas(widthContainer, containerHeight).parent(canvasParentRef);
    // p5.noSmooth()
    sizeNorm = 0.9;
    border = (1 - sizeNorm) * 0.5;
    const smaller = p5.min(p5.width * 0.25, p5.height * 0.8);
    width = smaller * 0.8;
    height = smaller * 0.8;
    newPuff = () => {
      puff = new Puff(10, (i) => {
        const s = { x: 0, y: 0 };
        const end = {
          x: p5.random(0.15) * width * 3 + 0.1 * width,
          y: (p5.random() - p5.random()) * height * 0.6,
        };
        return new Particle(s, end);
      });
    };
    newPuff();
    mintColor = p5.color("#000");
    mintColorFrame = p5.color("#5d5d5d");
  };
  //
  const nftColor = (name: string) => hashCode(name) % 100;

  const drawMints = (p5: p5Types) => {
    //based on time, draw up to 3 mint cards

    const aniTime = (p5.millis() % animationDuration) / animationDuration;
    const localWidth = ((p5.width - width) / 2) * 0.75;

    const localWidthBorder = ((p5.width - width) / 2) * 0.15;
    const n = 2;
    const localWidthIndiv = localWidth / n;
    const boxSize = localWidthIndiv * 0.7;
    const halfBoxSize = boxSize * 0.5;
    p5.push();

    // @ts-ignore
    // p5.drawingContext.clearRect(0, 0, localWidthBorder, p5.height);

    const drawMint = () => {
      p5.stroke(mintColorFrame);
      p5.noFill();
      p5.strokeWeight(2);
      const lineWidth = boxSize * 0.2;
      const lineWidthHalft = lineWidth * 0.5;
      const drawFrame = () => {
        //top left
        p5.rect(0, 0, lineWidth, lineWidthHalft);
        p5.rect(0, 0, lineWidthHalft, lineWidth);
        // top right
        p5.rect(boxSize - lineWidthHalft, 0, lineWidthHalft, lineWidth);
        p5.rect(boxSize - lineWidth, 0, lineWidth, lineWidthHalft);
        // bottom right
        p5.rect(
          boxSize - lineWidthHalft,
          boxSize - lineWidth,
          lineWidthHalft,
          lineWidth
        );
        p5.rect(
          boxSize - lineWidth,
          boxSize - lineWidthHalft,
          lineWidth,
          lineWidthHalft
        );
        // bottom left
        p5.rect(0, boxSize - lineWidth, lineWidthHalft, lineWidth);
        p5.rect(0, boxSize - lineWidthHalft, lineWidth, lineWidthHalft);
      };
      const drawOutlineFrame = () => {
        //top left
        p5.beginShape();
        p5.vertex(0, 0);
        p5.vertex(lineWidth, 0);
        p5.vertex(lineWidth, lineWidthHalft);
        p5.vertex(lineWidthHalft, lineWidthHalft);
        p5.vertex(lineWidthHalft, lineWidth);
        p5.vertex(0, lineWidth);
        p5.endShape(p5.CLOSE);

        // // top right
        p5.beginShape();
        p5.vertex(boxSize - lineWidth, 0);
        p5.vertex(boxSize, 0);
        p5.vertex(boxSize, lineWidth);
        p5.vertex(boxSize - lineWidthHalft, lineWidth);
        p5.vertex(boxSize - lineWidthHalft, lineWidthHalft);
        p5.vertex(boxSize - lineWidth, lineWidthHalft);
        p5.endShape(p5.CLOSE);

        // // bottom right
        p5.beginShape();
        p5.vertex(boxSize - lineWidthHalft, boxSize - lineWidth);
        p5.vertex(boxSize, boxSize - lineWidth);
        p5.vertex(boxSize, boxSize);
        p5.vertex(boxSize - lineWidth, boxSize);
        p5.vertex(boxSize - lineWidth, boxSize - lineWidthHalft);
        p5.vertex(boxSize - lineWidthHalft, boxSize - lineWidthHalft);
        p5.endShape(p5.CLOSE);

        // // bottom left
        p5.beginShape();
        p5.vertex(0, boxSize - lineWidth);
        p5.vertex(lineWidthHalft, boxSize - lineWidth);
        p5.vertex(lineWidthHalft, boxSize - lineWidth + lineWidthHalft);
        p5.vertex(lineWidth, boxSize - lineWidth + lineWidthHalft);
        p5.vertex(lineWidth, boxSize - lineWidth + lineWidth);
        p5.vertex(0, boxSize - lineWidth + lineWidth);
        p5.endShape(p5.CLOSE);
        // p5.rect(0, boxSize - lineWidth, lineWidthHalft, lineWidth);
        // p5.rect(0, boxSize - lineWidthHalft, lineWidth, lineWidthHalft);
      };
      drawOutlineFrame();

      p5.fill(mintColor);
      p5.textAlign(p5.CENTER, p5.CENTER);
      // p5.textSize(width/10)
      p5.textFont(fontRegular, width / 8);
      p5.text("Mint", boxSize / 2, boxSize / 2);
    };

    const boxYOffset = p5.height / 2 - boxSize * 0.75;
    if (aniTime < 0.5) {
      //render still
      for (let i = 0; i < n; i++) {
        p5.push();
        p5.translate(localWidthBorder + localWidth * (i / n), boxYOffset);
        drawMint();
        p5.pop();
      }
    } else {
      //rtender moving

      const aniTimeLocal = (aniTime - 0.5) * 2;
      for (let i = 0; i < n + 1; i++) {
        p5.push();
        const aniOffset = ease(aniTimeLocal);
        p5.translate(
          localWidthBorder +
            localWidth * (i / n) +
            aniOffset * localWidth * (1 / n) -
            localWidth * (1 / n),
          boxYOffset
        );
        drawMint();
        p5.pop();
      }
    }
    p5.erase();
    p5.rect(0, 0, localWidthBorder, p5.height);
    p5.noErase();

    p5.pop();
  };

  const drawNfts = (p5: p5Types) => {
    //based on time, draw up to 3 mint cards
    const aniTime = (p5.millis() % animationDuration) / animationDuration;
    const localWidth = ((p5.width - width) / 2) * 0.75;

    const localWidthBorder = ((p5.width - width) / 2) * 0.16;

    const localWidthIndiv = localWidth / numNfts;
    const boxSize = localWidthIndiv * 0.7;
    p5.push();
    const boxYOffset = p5.height / 2 - boxSize * 0.75;

    // @ts-ignore
    // p5.drawingContext.clearRect(0, 0, localWidthBorder, p5.height);

    p5.translate(p5.width / 2, 0);

    const drawNft = (name: string) => {
      const col = nftColor(name);
      p5.fill(col, 80, 90);
      p5.rect(0, 0, boxSize, boxSize);
      p5.fill(100 - col, 80, 0);
      p5.textAlign(p5.CENTER, p5.CENTER);

      // const name = p5.random(nftNames)
      // p5.textSize(width/10)
      p5.textFont(fontRegular, width / 8);
      p5.text(name, boxSize / 2, boxSize / 2);
    };

    if (aniTime < 0.5) {
      if (nftIds.length > numNfts) {
        nftIds.pop();
      }
      //render still
      for (let i = 0; i < numNfts; i++) {
        p5.push();
        p5.translate(
          width / 3 + localWidthBorder + localWidth * (i / numNfts),
          boxYOffset
        );
        drawNft(nftIds[i]);
        p5.pop();
      }
    } else {
      if (nftIds.length <= numNfts) {
        // nftIds.unshift(p5.random(nftNames))
        createNftName(p5, nftIds);
      }
      //render moving

      const aniTimeLocal = (aniTime - 0.5) * 2;

      for (let i = 0; i < numNfts + 1; i++) {
        p5.push();
        const aniOffset = ease(aniTimeLocal);
        p5.translate(
          width / 3 +
            localWidthBorder +
            localWidth * (i / numNfts) +
            aniOffset * localWidth * (1 / numNfts) -
            localWidth * (1 / numNfts),
          p5.height / 2 - boxSize * 0.75
        );
        drawNft(nftIds[i]);
        p5.pop();
      }
    }

    const spuff = 0.75;
    if (aniTime > spuff) {
      const aniTimeLocal = p5.map(aniTime, spuff, 1, 0, 1);
      p5.push();
      p5.translate(boxSize * 0.7, p5.height / 2 - boxSize * 0.5);
      p5.fill(nftColor(nftIds[1]), 100, 100);
      puff.draw(p5, aniTimeLocal);
      p5.pop();
    }
    p5.erase();
    // p5.fill(255)
    p5.rect(
      p5.width / 2 - localWidthBorder * 1.1,
      0,
      localWidthBorder * 1.1,
      p5.height
    );
    p5.noErase();

    p5.pop();
  };

  const draw = (p5: p5Types) => {
    // console.log('vel',vel )
    p5.push();
    p5.background(bgColor);
    // p5.translate(p5.width / 2, p5.height / 2)
    // p5.noFill()
    // p5.stroke(255)
    p5.clear();

    p5.noStroke();

    const sizeBox = Math.round((1 / xn) * width);
    const offsetMax = width * 0.18;
    // for (let x = 0; x < xn; x++) {
    //   for (let y = 0; y < yn; y++) {
    const faces = [];
    const sides = [];
    // for (let x = xn-1; x >= 0; x--) {
    //   for (let y = yn-1; y >= 0; y--) {
    // for (let x = 0; x < xn; x++) {
    const nfunc = (x: number, y: number) => {
      const nscale = 1.5;
      return Math.abs(
        p5.noise((x / xn) * nscale, (y / yn) * nscale, p5.millis() / 3000)
      );
    };

    const m = xn * yn;

    const time = (p5.millis() % animationDuration) / animationDuration;

    const timeWave = p5.sin(p5.millis() / animationDuration / 2) * 0.5 + 0.5;
    const hueWave = p5.sin((p5.millis() / animationDuration) * 0.25);
    for (let x = xn - 1; x >= 0; x--) {
      const bouncing =
        p5.sin((time + 0.25) * p5.TWO_PI + (1 - x / xn) * p5.TWO_PI) * 0.5 +
        0.5;
      for (let y = 0; y < yn; y++) {
        const i = y * xn + x;
        // p5.push()
        const noise = nfunc(x, y);
        const offset =
          Math.pow(noise * offsetMax * 0.25, 1) + bouncing * offsetMax * 0.75;
        //todo here pizzaset
        const getBoxesColor = () => {
          const yf = y / yn;
          const ycoloffset = (yf + timeWave) * 0.5;

          const color = p5.map(
            ycoloffset * 0.5 + 0.5 * bouncing,
            0,
            1,
            160 + hueWave * 30,
            220 + hueWave * 30
          );
          return color;
        };
        const color360 = getBoxesColor();

        const xp = Math.floor((x / xn) * width) + offset;
        const yp = Math.floor((y / yn) * height) - offset;

        faces.push(() => {
          let time = (p5.millis() % animationDuration) / animationDuration;
          if (time < 0.5) {
            time *= 2;
            time = ease(time);
          } else {
            time = 1 - (time - 0.5) * 2;
            time = ease(time);
          }
          // const color= (( time* 100) + xn % 100);
          // const newcol = p5.lerpColor(p5.color(0,80,70), p5.color(100), time)
          // p5.fill(100 - (color /*+ 20 * colorModifiers[i]*.2*/ ))
          p5.fill(color360, 80, 75);
          p5.rect(xp, yp, sizeBox, sizeBox);
        });
        sides.push(() => {
          //bottom
          // p5.fill(Math.round(360 - color + 360 * 0.1), 100, 90);
          p5.fill(color360, 75, 85);
          p5.beginShape();
          // face bottom left
          p5.vertex(xp, yp + sizeBox);
          p5.vertex(xp + sizeBox, yp + sizeBox);
          p5.vertex(xp + sizeBox - offset * 2, yp + sizeBox + offset * 2);
          p5.vertex(xp - offset * 2, yp + sizeBox + offset * 2);
          p5.endShape();
          //left
          p5.fill(color360, 75, 70);
          p5.beginShape();
          p5.vertex(xp, yp);
          p5.vertex(xp, yp + sizeBox);
          p5.vertex(xp - offset * 2, yp + offset * 2 + sizeBox);
          p5.vertex(xp - offset * 2, yp + offset * 2);
          p5.endShape();
        });
      }
    }

    const render = (rend: () => void) => {
      p5.push();
      rend();
      p5.pop();
    };

    const renderArray = (rends: (() => void)[]) => {
      for (const ren of rends) {
        render(ren);
      }
    };

    drawMints(p5);
    drawNfts(p5);

    p5.translate(
      p5.width / 2 - width / 2 - width * border,
      p5.height / 2 - height / 2 - height * border
    );
    for (let i = 0; i < faces.length; i++) {
      render(faces[i]);
      render(sides[i]);
    }
    // for (let ren of rends) {
    //   p5.push()
    //   ren()
    //   p5.pop()
    // }
    // renderArray(sides)
    // renderArray(faces)

    p5.pop();

    for (let i = 0; i < colorModifiers.length; i++) {
      colorModifiers[i] *= 0.98;
    }
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

class Particle {
  pos: Vector;
  end: Vector;

  constructor(pos: Vector, end: Vector) {
    this.pos = pos;
    this.end = end;
  }
}

//easeOutExpo
const easeParticle = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

class Puff {
  particles: Particle[];

  constructor(num: number, gen: (i: number) => Particle) {
    this.particles = [];
    for (let i = 0; i < num; i++) {
      this.particles[i] = gen(i);
    }
  }

  draw(p5: p5Types, time: number) {
    for (let i = 0; i < this.particles.length; i++) {
      const s = this.particles[i].pos;
      const e = this.particles[i].end;
      const dir = p5.createVector(e.x - s.x, e.y - s.y);
      const len = dir.mag();
      const pos = dir
        .normalize()
        .mult(easeParticle(time) * len)
        .add(s.x, s.y);
      p5.rect(pos.x, pos.y, height * 0.05, height * 0.05);
    }
  }
}

export default SketchAnimation;
