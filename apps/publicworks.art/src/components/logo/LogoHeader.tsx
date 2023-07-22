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
      <RowLogoContainer
        className={`text-center ${styles.logotext}`}
        colClassName={"inline-flex items-baseline"}
      >
        <p>
          A home{" "}
          <span
            style={{
              width: aniSize,
              height: aniSize,
              minWidth: aniSize,
              minHeight: aniSize,
            }}
            className={"inline-flex items-baseline"}
          >
            <SpinAnimation
              animation={"waveyFlower"}
              width={aniSize}
              height={aniSize}
            />
          </span>{" "}
          for generative art{" "}
          <span
            style={{
              width: aniSize,
              height: aniSize,
              minWidth: aniSize,
              minHeight: aniSize,
            }}
            className={"inline-flex items-baseline"}
          >
            <SpinAnimation
              animation={"drawChasingTailMulti"}
              width={aniSize}
              height={aniSize}
            />
          </span>{" "}
          in the {/*<SpinAnimation*/}
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
            className={"inline-flex items-baseline"}
          >
            <SpinAnimation
              animation={"orbits"}
              width={aniSize}
              height={aniSize}
            />
          </span>{" "}
          cosmos
        </p>
      </RowLogoContainer>
      {/*</AutoContainer>*/}
      {/*<SpinAnimation animation={"kitchensink"} width={500} height={500} />*/}
    </div>
  );
};
