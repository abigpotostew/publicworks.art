import { Container } from "react-bootstrap";
import { FC } from "react";
import Head from "next/head";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface ILayout {
  description?: string;
  metaTitle?: string;
  image?: string;
  children: any;
}
const MainLayout: FC<ILayout> = ({
                                        description = 'Hello gen art!',
                                        metaTitle = 'Public Works',
                                        image = '',
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

        <Container>{children}</Container>
      <Footer/>
    </div>
  );
};

export default MainLayout;