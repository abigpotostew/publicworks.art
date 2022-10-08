import { Container, Nav, Navbar } from "react-bootstrap";

import styles from "../../styles/Home.module.scss";
import Link from "next/link";
import { useCosmosWallet } from "./provider/CosmosWalletProvider";
import config from "../wasm/config";

export const NavBar = () => {
  const wallet = useCosmosWallet();

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
            {config.testnet && <Nav.Link href="/create">Create</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {wallet.isConnected && <Navbar.Text>Signed in</Navbar.Text>}
          {wallet.isConnected && (
            <Navbar.Text>
              <span>
                <Nav.Link
                  onClick={() => {
                    wallet.logoutMutation?.mutate();
                  }}
                >
                  Sign out
                </Nav.Link>
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
                  Sign In
                </Nav.Link>
              </span>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
