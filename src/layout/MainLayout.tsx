import { Container } from "react-bootstrap";
import { FC } from "react";
import Head from "next/head";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import styles from "../../styles/Home.module.css"
interface ILayout {
  description?: string;
  metaTitle?: string;
  image?: string;
  children: any;
}
const MainLayout: FC<ILayout> = ({
                                        description = 'A new generative art platform built for the Cosmos on a carbon neutral tech stack.',
                                        metaTitle = 'publicworks.art',
                                        image = 'https://publicworks.art/img/metatag/metatag-image1.png',
                                        children,
                                      }) => {

  return (
    <div>
      <Head>
        <title>{metaTitle}</title>
        <link rel="icon" href="/favicon.png"/>
        {metaTitle && <meta property="og:title" content={metaTitle}/>}
        {metaTitle && <meta property="twitter:title" content={metaTitle}/>}
        {description && (
          <>
            <meta property="og:description" content={description}/>
            <meta name="description" content={description}/>
          </>
        )}
        {image && <meta property="twitter:image" content={image}/>}
        {description && <meta property="twitter:description" content={description}/>}
        {image && <meta property="og:image" content={image}/>}
        {image && <meta property="twitter:card" content="summary_large_image"/>}
      </Head>
      <NavBar />
      {/*<header>*/}
      {/*</header>*/}

      <div className={styles.container}>
        <main className={styles.main}>
        {children}
        </main>
      <Footer/>
      </div>
    </div>
  );
};

export default MainLayout;