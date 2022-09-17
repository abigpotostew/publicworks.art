import { Container, Nav, Navbar } from "react-bootstrap";

import styles from "../../styles/Home.module.css";
import Link from "next/link";

export const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
