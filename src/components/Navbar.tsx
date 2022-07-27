import { Container, Navbar } from "react-bootstrap";

import styles from '../../styles/Home.module.css'

export const NavBar = ()=>{
  return (
    <Navbar bg="dark" variant="dark" expand="sm" >
      <Container>
        <Navbar.Brand className={styles.navTitle} href="#home">PublicWorks.Art</Navbar.Brand>
      </Container>
    </Navbar>
  )
}