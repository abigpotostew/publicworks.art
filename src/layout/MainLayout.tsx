import { FC } from "react";
import Head from "next/head";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import styles from "../../styles/Home.module.scss";
import { useQueryContract } from "../hooks/useQueryContract";
import { CosmosWalletProviderContext } from "../components/provider/CosmosWalletProvider";
import { Container } from "react-bootstrap";
import { useUserSession } from "src/hooks/useUserSession";
import { StargazeProvider, useWallet } from "@stargazezone/client";
import stargazeClient from "src/stargaze/stargaze";

interface ILayout {
  description?: string;
  metaTitle?: string;
  image?: string;
  children: any;
}

const MainLayout: FC<ILayout> = ({
  description = "A new generative art platform built for the Cosmos on a carbon neutral tech stack.",
  metaTitle = "",
  image = "https://publicworks.art/img/metatag/metatag-image1.png",
  children,
}) => {
  const wallet = useQueryContract();
  // const user = useUserSession(wallet.queryConnectedClient);
  const {
    queryClient: queryContractClient,
    queryConnectedClient,
    connectKeplrMutation,
    logoutMutation,
  } = wallet;

  return (
    <div>
      <Head>
        <title key={"title"}>
          {!metaTitle ? "publicworks.art" : `${metaTitle} - publicworks.art`}
        </title>
        <link rel="icon" href="/favicon.png" />
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {metaTitle && <meta property="twitter:title" content={metaTitle} />}
        {description && (
          <>
            <meta property="og:description" content={description} />
            <meta name="description" content={description} />
          </>
        )}
        {image && <meta property="twitter:image" content={image} />}
        {description && (
          <meta property="twitter:description" content={description} />
        )}
        {image && <meta property="og:image" content={image} />}
        {image && (
          <meta property="twitter:card" content="summary_large_image" />
        )}
        <meta name="twitter:dnt" content="on" />
      </Head>

      <CosmosWalletProviderContext.Provider
        value={
          {
            client: queryContractClient,
            connectWallet(): Promise<void> {
              return connectKeplrMutation.mutateAsync(false);
            },
            isConnected: !!queryConnectedClient,
            loginMutation: connectKeplrMutation,
            logoutMutation: logoutMutation,
            onlineClient: queryConnectedClient,
          }
          // new CosmosWalletProviderDataClient(
          //   queryContractClient,
          //   queryConnectedClient,
          //   connectKeplrMutation
          // )
        }
      >
        <NavBar />
        {/*<header>*/}
        {/*</header>*/}

        <div className={styles.container}>
          <main className={styles.main}>{children}</main>
          <Footer />
        </div>
      </CosmosWalletProviderContext.Provider>
    </div>
  );
};

export default MainLayout;
