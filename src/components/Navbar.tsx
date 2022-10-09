import { Button, ButtonGroup, Container, Nav, Navbar } from "react-bootstrap";

import styles from "../../styles/Home.module.scss";
import Link from "next/link";
import { useCosmosWallet } from "./provider/CosmosWalletProvider";
import config from "../wasm/config";
import { ButtonPW } from "./button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const NavBar = () => {
  const wallet = useCosmosWallet();
  const address = wallet.onlineClient?.accounts
    ? wallet.onlineClient?.accounts[0].address
    : undefined;
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
            <Nav.Link href="/roadmap">Roadmap</Nav.Link>
            {<Nav.Link href="/create">Create</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {/*{wallet.isConnected && <Navbar.Text>Signed in</Navbar.Text>}*/}
          {wallet.isConnected && (
            <Navbar.Text>
              <span>
                <span>
                  <ButtonGroup aria-label="Basic example">
                    <Link passHref={true} href={"/profile"}>
                      <Button variant="secondary">
                        {address &&
                          `${address.slice(0, 9)}...${address.slice(-5)}`}
                      </Button>
                    </Link>
                    <Button variant="secondary">
                      <Nav.Link
                        onClick={() => {
                          wallet.logoutMutation?.mutate();
                        }}
                      >
                        <FontAwesomeIcon
                          icon={"arrow-right-from-bracket"}
                          width={24}
                        />
                      </Nav.Link>
                    </Button>
                  </ButtonGroup>
                </span>
              </span>
            </Navbar.Text>
          )}
          {!wallet.isConnected && (
            <Navbar.Text>
              <span>
                <Nav.Link
                  onClick={async () => {
                    await wallet.loginMutation?.mutate();
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
