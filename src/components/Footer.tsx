import { Container } from "react-bootstrap";
import styles from "../../styles/Home.module.css";
import { RowWideContainer } from "./layout/RowWideContainer";

export const Footer = () => {
  return (
    <footer>
      <Container>
        <RowWideContainer className={`${styles.footer}`}>
          <span className={styles.align_center}>© 2022 publicworks.art</span>
        </RowWideContainer>
      </Container>
    </footer>
  );
};
