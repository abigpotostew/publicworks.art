import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { LogoHeader } from "src/components/logo/LogoHeader";

const Logo = () => {
  const fontSize = 95;
  const aniSize = fontSize * 1.2;
  return (
    <div>
      <LogoHeader />
    </div>
  );
};

Logo.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Logo;
