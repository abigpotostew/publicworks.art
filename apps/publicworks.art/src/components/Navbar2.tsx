import { Button, ButtonGroup, Container, Nav, Navbar } from "react-bootstrap";

import styles from "../../styles/Home.module.scss";
import Link from "next/link";
import { useCosmosWallet } from "./provider/CosmosWalletProvider";
import config from "../wasm/config";
import { ButtonPW } from "./button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpinnerLoading from "src/components/loading/Loader";
import { useWallet, WalletInfo } from "@stargazezone/client";
import { FC } from "react";
import { WalletContextValue } from "@stargazezone/client/react/wallet/WalletContext";
import useUserContext from "src/context/user/useUserContext";
import { useNameInfo, useProfileInfo } from "../hooks/sg-names";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const NavBar2: FC = () => {
  const sgwallet = useWallet();
  const { user } = useUserContext();
  const address = sgwallet?.wallet?.address;
  const nameInfo = useProfileInfo({ address });
  const username = nameInfo.walletName
    ? nameInfo.walletName + ".stars"
    : undefined;

  const links = [
    { href: "/works", label: "Works" },
    { href: "/test", label: "Test" },
    { href: "/about", label: "About" },
    { href: "/docs", label: "Docs" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="navbar bg-neutral">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <FontAwesomeIcon icon={faBars} width={16} />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {links.map((link, i) => (
              <li key={i}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <a className="font-title text-xl" href={"/"}>
          PublicWorks.Art
        </a>
        <div className="hidden lg:flex">
          <ul className="menu menu-vertical text-secondary  lg:menu-horizontal flex-col lg:flex-row px-1">
            {links.map((link, i) => (
              <li key={i}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  );
};
