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

export const NavBar: FC = () => {
  const sgwallet = useWallet();
  const { user } = useUserContext();
  const address = sgwallet?.wallet?.address;
  const username = user.data?.name;

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container fluid>
        <Link href={"/"} passHref>
          <Navbar.Brand className={styles.navTitle}>
            PublicWorks.Art
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link href="/works">Works</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/docs">Docs</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          {sgwallet.wallet && (
            <Navbar.Text>
              <Link passHref={true} href={"/create"}>
                <Button style={{ marginRight: "1rem" }} variant="primary">
                  Create
                </Button>
              </Link>
            </Navbar.Text>
          )}

          {sgwallet.wallet && (
            <Navbar.Text>
              <span>
                <span>
                  <ButtonGroup aria-label="Basic example">
                    <Link passHref={true} href={"/profile"} legacyBehavior>
                      <Button variant="info">
                        {username ? username : undefined}
                        {!username &&
                          address &&
                          `${address.slice(0, 9)}...${address.slice(-5)}`}
                      </Button>
                    </Link>
                    <Button
                      variant="info"
                      onClick={() => {
                        sgwallet.logout();
                      }}
                    >
                      <Nav.Link>
                        <FontAwesomeIcon
                          icon={"arrow-right-from-bracket"}
                          width={18}
                        />
                      </Nav.Link>
                    </Button>
                  </ButtonGroup>
                </span>
              </span>
            </Navbar.Text>
          )}
          {!sgwallet.wallet && (
            <Navbar.Text>
              <span>
                <Nav.Link
                  onClick={async () => {
                    sgwallet.login();
                  }}
                >
                  <ButtonPW>Sign In</ButtonPW>
                </Nav.Link>
              </span>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
