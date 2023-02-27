import { Container } from "react-bootstrap";
import styles from "../../styles/Home.module.scss";
import { RowWideContainer } from "./layout/RowWideContainer";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer>
      <Container>
        <RowWideContainer className={`${styles.footer}`}>
          <div className={"d-flex justify-content-center gap-3"}>
            <span className={styles.align_center}>© 2023 publicworks.art</span>
            <span>
              <Link
                href={"/status"}
                className={"text-secondary text-decoration-none"}
              >
                Status
              </Link>
            </span>
          </div>
        </RowWideContainer>
      </Container>
    </footer>
  );
};
