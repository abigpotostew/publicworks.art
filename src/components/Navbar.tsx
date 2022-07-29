import { Container, Navbar } from "react-bootstrap";

import styles from '../../styles/Home.module.css'
import Link from "next/link";

export const NavBar = ()=>{
  return (
    <Navbar bg="dark" variant="dark" expand="sm" >
      <Container>
        <Link href={'/'}><Navbar.Brand className={styles.navTitle}>PublicWorks.Art</Navbar.Brand></Link>
      </Container>
    </Navbar>
  )
}