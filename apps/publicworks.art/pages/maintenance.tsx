import SpinAnimation from "../src/components/animations/SpinAnimation";

const aniSize = 200;
export const Maintenance = () => {
  return (
    <div className={"w-full flex flex-col items-center justify-center"}>
      <h1>
        <SpinAnimation animation={"orbits"} width={aniSize} height={aniSize} />
        Maintenance
        <SpinAnimation animation={"orbits"} width={aniSize} height={aniSize} />
      </h1>
      <p>
        Our site is currently undergoing maintenance. Please check back later.
      </p>
    </div>
  );
};

export default Maintenance;
