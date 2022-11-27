import { RowLogoContainer } from "src/components/layout/RowThinContainer";
import SpinAnimation from "src/components/animations/SpinAnimation";
import styles from "../../../styles/Logo.module.scss";

export const LogoHeader = () => {
  const fontSize = 120;
  const aniSize = fontSize * 1;
  return (
    <div>
      {/*<AutoContainer*/}
      {/*  style={{ fontSize }}*/}
      {/*  bswidth={2}*/}
      {/*  className={"d-inline text-center"}*/}
      {/*>*/}
      <RowLogoContainer className={`text-center ${styles.logotext}`}>
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
        <span> for generative art </span>
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
        <span> in the </span>
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
      </RowLogoContainer>
      {/*</AutoContainer>*/}
      {/*<SpinAnimation animation={"kitchensink"} width={500} height={500} />*/}
    </div>
  );
};
