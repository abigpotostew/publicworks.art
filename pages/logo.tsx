import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import LogoAnimation from "src/components/LogoAnimation";
import SpinAnimation from "src/components/animations/SpinAnimation";
import { AutoContainer } from "src/components/layout/AutoContainer";

const Logo = () => {
  const fontSize = 95;
  const aniSize = fontSize * 1.2;
  return (
    <div>
      <AutoContainer
        style={{ fontSize }}
        bswidth={2}
        className={"d-inline text-center"}
      >
        <span className={"font-weight-bold"}>A home </span>
        <span
          style={{
            width: aniSize,
            height: aniSize,
            minWidth: aniSize,
            minHeight: aniSize,
          }}
          className={"d-inline-block"}
        >
          <SpinAnimation
            animation={"waveyFlower"}
            width={aniSize}
            height={aniSize}
          />
        </span>
        <span> for generative </span>
        <span
          style={{
            width: aniSize,
            height: aniSize,
            minWidth: aniSize,
            minHeight: aniSize,
          }}
          className={"d-inline-block"}
        >
          <SpinAnimation
            animation={"drawChasingTailMulti"}
            width={aniSize}
            height={aniSize}
          />
        </span>
        <span> art in the </span>
        {/*<SpinAnimation*/}
        {/*  animation={"waveyFlower"}*/}
        {/*  width={aniSize}*/}
        {/*  height={aniSize}*/}
        {/*/>*/}
        <span
          style={{
            width: aniSize,
            height: aniSize,
            minWidth: aniSize,
            minHeight: aniSize,
          }}
          className={"d-inline-block"}
        >
          <SpinAnimation
            animation={"orbits"}
            width={aniSize}
            height={aniSize}
          />
        </span>
        <span> cosmos </span>
      </AutoContainer>
      {/*<SpinAnimation animation={"kitchensink"} width={500} height={500} />*/}
    </div>
  );
};

Logo.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Logo;
