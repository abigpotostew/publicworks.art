import p5Types from "p5";
function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function ease(x: number): number {
  return easeInOutQuart(x);
}
interface Opts {
  size: number;
  w: number;
  h: number;
  weightScale?: number;
  col?: p5Types.Color;
}
const dottedCircle = (p5: p5Types, { size, weightScale }: Opts) => {
  weightScale = weightScale || 0.1;
  const t = p5.millis() / 6000;
  const circum = size * p5.TWO_PI;
  const fixRadMax = size * 0.2;
  const ellipseRad = circum / 10;
  const orbitellipseRad = ellipseRad / 7;
  const phase = 4;
  const height = size * 0.1;
  p5.push();
  p5.noFill();
  p5.strokeCap(p5.ROUND);
  p5.strokeJoin(p5.ROUND);
  p5.strokeWeight(size * weightScale);

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
  p5.pop();
};
const orbits = (p5: p5Types, { size }: Opts) => {
  // size /= 2;
  const res = 1;
  const t = p5.millis() / 12000;
  const circum = (size / 2) * p5.TWO_PI;
  const ellipseRad = circum / 10;
  const ellipseRad2 = circum / 8;
  // const ellipseRad = circum / 10;
  const orbitellipseRad = ellipseRad / 2 / 1.8;
  const c1 = p5.color("#3774e8");
  const c2 = p5.color("#eea453");
  const c3 = p5.color("#ead26d");
  p5.push();

  p5.strokeCap(p5.ROUND);
  p5.strokeJoin(p5.ROUND);
  p5.strokeWeight(size / 6 / 2);

  p5.translate(size / 2, size / 2);

  for (let i = 0; i < res; i++) {
    const [x, y] = [0, 0];
    //   [
    //   p5.cos((t + i / res) * p5.TWO_PI) * fixRadMax +
    //     p5.cos((t * 2 + i / res) * p5.TWO_PI) * fixRadMax * 0.5,
    //   p5.sin((t + i / res) * p5.TWO_PI) * fixRadMax +
    //     p5.sin((t * 2 + i / res) * p5.TWO_PI) * fixRadMax * 0.5,
    // ];
    p5.stroke(c1);
    p5.noFill();
    p5.ellipse(x, y, ellipseRad);
    // p5.noStroke();
    // p5.strokeWeight(size / 6 / 7);
    const orbitsn = 10;
    const orbitRadiusChange = ease(p5.cos(t * 15) * 0.5 + 0.5);
    const orbitRadiusChangeOdd = ease(p5.cos(t * 15 + p5.PI) * 0.5 + 0.5);
    for (let j = 0; j < orbitsn; j++) {
      const change = j % 2 === 0 ? orbitRadiusChange : orbitRadiusChangeOdd;
      const rad = ellipseRad2 - ellipseRad2 * change * 0.2;
      const [ox, oy] = [
        p5.cos((j / orbitsn + t * 1.5 + i / res) * p5.TWO_PI) * rad,
        p5.sin((j / orbitsn + t * 1.5 + i / res) * p5.TWO_PI) * rad,
      ];
      if (j % 2 === 0) {
        p5.fill(c2);
        p5.stroke(c2);
      } else {
        p5.fill(c3);
        p5.stroke(c3);
      }
      // p5.noFill();
      p5.ellipse(
        x + ox,
        y + oy,
        (j % 2 === 0 ? 1 : 1) * orbitellipseRad * 0.5 +
          change * orbitellipseRad * 0.5
      );
    }
  }
  p5.pop();
};
const waveyFlower = (p5: p5Types, { w, h }: Opts) => {
  //
  const size = p5.min(w, h) / 1.7;
  const t = p5.millis() / 1000;
  const n = 4;
  const res = 40;
  p5.push();
  p5.noFill();
  p5.strokeWeight(size / 10);
  p5.strokeJoin(p5.ROUND);
  p5.strokeCap(p5.ROUND);
  const stemCol = p5.color("#83de1c");
  const ballCol = p5.color("#c41754");

  const gap = 0.8;
  const waveWidth = (size / n) * gap;
  const phase = p5.TWO_PI * 0.6;
  p5.translate(waveWidth * 0.7, size / 1.5);
  for (let i = 0; i < n; i++) {
    const ii = i / n;
    p5.translate(size / n, 0);
    p5.stroke(stemCol);
    p5.beginShape();
    for (let j = 0; j < res; j++) {
      const jj = j / res;
      p5.vertex(
        p5.sin(t + (j / res) * phase) * waveWidth * (1 - jj),
        (j / res) * size
      );
    }
    p5.endShape();
    p5.stroke(ballCol);
    const flowerRad = size / 3;
    const foffset = flowerRad / size;
    const x = p5.sin(t + (-foffset / res) * phase) * waveWidth * (1 + foffset);
    p5.push();
    p5.translate(0, -flowerRad / 3);
    p5.rotate(
      p5.sin(2.2 * ii * t + t + (-foffset / res) * phase) * p5.TWO_PI * 0.03
    );
    p5.translate(0, flowerRad / 3);
    p5.translate(x * 0.9, -flowerRad / 1.5);
    dottedCircle(p5, {
      size: flowerRad * 1.15,
      w: flowerRad,
      h: 0,
      weightScale: 0.1,
    });
    p5.pop();
    // p5.ellipse(x, 0, size / 10, size / 10);
  }
};

const walkingCircle = (
  p5: p5Types,
  size: number,
  aniTime: number,
  col: p5Types.Color,
  weight: number
) => {
  const duration = 2;

  p5.push();
  p5.noFill();
  p5.strokeCap(p5.ROUND);
  p5.strokeWeight(weight);
  p5.stroke(col);
  const [n, rotations] = [4, 2.005];
  // [6, 2.98];
  const rad = size / n;

  // p5.translate(0, size / 6);
  const arcLenS = p5.TWO_PI * (1 / n);
  const arcLenE = p5.TWO_PI - arcLenS;

  const rtbucket = Math.floor(aniTime / duration);
  p5.rotate(0); //fixed
  const bucketROt = (p5.TWO_PI / rotations) * -rtbucket;
  p5.rotate(bucketROt);
  // p5.translate(p5.cos(-bucketROt) * rad, p5.sin(-bucketROt) * rad);

  const bucketAniTime = (aniTime % duration) / duration;
  if (bucketAniTime < 0.5) {
    const t = bucketAniTime * 2;
    p5.arc(0, 0, rad, rad, arcLenS, arcLenS + (arcLenE - arcLenS) * t);
    // console.log("1", t.toFixed(2));
  } else {
    const t = (bucketAniTime - 0.5) * 2;

    const s = arcLenS + t * (arcLenE - arcLenS);
    const e = arcLenS + (arcLenE - arcLenS);

    p5.arc(0, 0, rad, rad, s, e);
    // console.log("2", t.toFixed(2), aniTime);
  }
  p5.pop();
};

const walkingCircleCombined = (p5: p5Types, { size }: Opts) => {
  const c1 = p5.color("#a4038f");
  const c2 = p5.color("#e57f3b");
  const n = 10;
  const weight = (size / n) * 0.05;
  for (let i = 0; i < n; i++) {
    const inf = i / n;
    const offset = inf * 1.5;

    walkingCircle(
      p5,
      size * inf + size / 4,
      p5.millis() / 1000 + offset,
      p5.lerpColor(c1, c2, inf),
      weight
    );
  }

  // walkingCircle(p5, size / 2, p5.millis() / 1000 + 0.25);
  // walkingCircle(p5, size / 4, p5.millis() / 1000 + 0.25 * 0.5);
};
const yinyang = (p5: p5Types, { size }: Opts) => {
  //

  const drawArcs = (t: number, r: number) => {
    p5.push();
    p5.fill("black");
    p5.rotate(p5.HALF_PI + t * p5.PI);
    p5.arc(0, 0, r, r, 0, p5.PI);
    p5.fill("grey");
    p5.rotate(p5.PI);
    p5.arc(0, 0, r, r, 0, p5.PI);
    p5.pop();
  };

  p5.push();
  p5.noStroke();
  //yin yang
  drawArcs(0, size);
  p5.push();
  p5.translate(0, -size / 4);

  p5.fill("grey");
  p5.ellipse(0, 0, size / 2);
  p5.pop();
  p5.push();
  p5.translate(0, size / 4);

  p5.fill("black");
  p5.ellipse(0, 0, size / 2);

  p5.pop();
  p5.pop();
};
const segmentedSquad2 = (p5: p5Types, { size }: Opts) => {
  const aniTime = p5.millis() / 9000;
  let t = aniTime % 1;
  // const calcT
  if (t < 0.5) {
    t = ease(t * 2);
  } else {
    t = 1 + ease((t - 0.5) * 2);
  }
  p5.noStroke();

  const c1 = p5.color("#a4ff68");
  const c2 = p5.color("#7316f8");
  const drawArcs = (t: number, r: number) => {
    p5.push();
    p5.fill(c1);
    p5.rotate(p5.HALF_PI + t * p5.PI);
    p5.arc(0, 0, r, r, 0, p5.PI);
    p5.fill(c2);
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

  p5.fill(c1);
  p5.rect(-size / 4, 0, size / 2, size);
  p5.fill(c2);
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
const drawChasingTail = (p5: p5Types, { w, col }: Opts) => {
  const size = w * 0.35;
  const res = size * 2;
  const aniTime = p5.millis() / 200;
  let a = aniTime;
  const len = p5.TWO_PI * 0.85;
  const circleRotation = (a / res) * w * 0.07837037;
  const fixRad = size;
  const phase = 4;
  const height = size * 0.1;
  p5.push();
  p5.translate(w / 2, w / 2);
  p5.noFill();
  p5.beginShape();
  p5.strokeCap(p5.ROUND);
  p5.strokeJoin(p5.ROUND);
  p5.strokeWeight(size / 2.5);
  col = col || p5.color("#6029f1");
  const circleColor = p5.color("#cf67ec");
  const circleColor2 = p5.color("#67ecb5");
  p5.stroke(col);

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
  //dotted stuff
  // const changingRad = p5.sin(a) * height;
  // const of = 4 / res + 1;
  // const [x, y] = [
  //   p5.cos(of * len + circleRotation) * fixRad,
  //   // p5.cos(of * len + circleRotation) * changingRad,
  //   p5.sin(of * len + circleRotation) * fixRad,
  //   // p5.sin(of * len + circleRotation) * changingRad,
  // ];
  // p5.fill(col);
  // p5.noStroke();
  // p5.fill(circleColor);

  // p5.translate(x, y);
  // p5.rotate(circleRotation);
  // p5.noFill();
  // p5.stroke(circleColor);
  // animationLibrary.dottedCircle(p5, { size, w: 0, h: 0 });
  // p5.stroke(circleColor2);
  // animationLibrary.dottedCircle(p5, { size: size / 2, w: 0, h: 0 });

  // p5.fill(col);
  // p5.noStroke();
  // const ndots = 10;
  // for (let i = 0; i < ndots; i++) {
  //   const changingRad = p5.sin(0.25) * height;
  //   const of = (i / ndots) * p5.TWO_PI + p5.TWO_PI * 0.46;
  //   const [x, y] = [
  //     p5.cos(of) * fixRad + p5.cos(of) * changingRad,
  //     p5.sin(of) * fixRad + p5.sin(of) * changingRad,
  //   ];
  //   p5.ellipse(x, y, size / 5);
  // }
  p5.pop();
};

const drawChasingTailMulti = (p5: p5Types, opts: Opts) => {
  drawChasingTail(p5, { ...opts });
  p5.translate(opts.w / 4, opts.w / 4);
  drawChasingTail(p5, { ...opts, w: opts.w / 2, col: p5.color("#cf67ec") });
  p5.translate(opts.w / 6, opts.w / 6);
  drawChasingTail(p5, { ...opts, w: opts.w / 6, col: p5.color("#ea1167") });
};

const segmentedSquad = (p5: p5Types, { size }: Opts) => {
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

export const animationLibrary = {
  orbits,
  dottedCircle,
  waveyFlower,
  walkingCircleCombined,
  // walkingCircle,
  yinyang,
  segmentedSquad2,
  segmentedSquad,
  drawChasingTail,
  drawChasingTailMulti,
};
