import MainLayout from "../../../src/layout/MainLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Container, Placeholder } from "react-bootstrap";
import SpinnerLoading from "src/components/loading/Loader";
import { TokenStatuses } from "src/store/types";
import Table from "react-bootstrap/Table";
import { useTokenStatus } from "../../../src/hooks/work/useTokenStatus";
import {
  PaginationPw,
  useChangePage,
} from "../../../src/components/Pagination/Pagination";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useGetWorkById } from "../../../src/hooks/work/useGetWorkById";
import { normalizeMetadataUri } from "../../../src/wasm/metadata";
import { relativeTimeFromDates } from "../../../src/util/date-fmt/format";
import { RowWideContainer } from "../../../src/components/layout/RowWideContainer";
import chainInfo from "../../../src/stargaze/chainInfo";
import config from "../../../src/wasm/config";

const mapStatus = (
  status: number
): { status: ReactElement; description: ReactElement } => {
  switch (status) {
    case TokenStatuses.QUEUEING:
      return { status: <SpinnerLoading />, description: <>Queued</> };
    case TokenStatuses.COMPLETE:
      return {
        status: (
          <FontAwesomeIcon
            className={"text-success"}
            icon={faCheck}
            width={14}
          />
        ),
        description: <>Complete</>,
      };
    case TokenStatuses.FINALIZING:
      return {
        status: <SpinnerLoading />,
        description: <>Finalizing</>,
      };
    default:
      return {
        status: (
          <FontAwesomeIcon
            className={"text-danger"}
            icon={faXmark}
            width={14}
          />
        ),
        description: <>Error - contact support</>,
      };
  }
};

const WorkStatusPage = () => {
  const router = useRouter();
  const { workId: workIdIn } = router.query;
  const workId = workIdIn?.toString() || "";
  const workQuery = useGetWorkById(workId);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const tokens = useTokenStatus({ workId: parseInt(workId), take, skip });

  const setPage = useCallback(
    (page: number) => {
      setSkip((page - 1) * take);
    },
    [take]
  );
  const countTokens = tokens.data?.count ?? 0;
  const countPages = Math.ceil(countTokens / take);
  const { changePage, page, isReady } = useChangePage(
    `/create/${workId}/status`,
    countPages,
    setPage
  );

  useEffect(() => {
    const newSkip = (page - 1) * take;
    setSkip(newSkip);
  }, [take, skip, page]);

  // isReady = true;
  const workIsLoading = workQuery.isLoading;
  const tokensIsLoading = !isReady || tokens.isLoading;

  const relativeTime = (date: string) => {
    const dateObj = new Date(date);
    return relativeTimeFromDates(dateObj);
  };

  const liveUrl = (hash: string) => {
    const codeCid = workQuery.data?.codeCid;
    if (!codeCid) {
      return "";
    }
    const url =
      normalizeMetadataUri("ipfs://" + codeCid) +
      "?hash=" +
      hash +
      `&publicworks=true`;
    return url;
  };

  const headers = ["Token", "Status", "Description", "Updated", "Links"];

  const TableHeader = () => {
    return (
      <thead>
        <tr>
          {headers.map((header, i) => {
            return <th key={i}>{header}</th>;
          })}
        </tr>
      </thead>
    );
  };

  return (
    <>
      <Head>
        <title key={"title"}>{`Status ${workId} - publicworks.art`}</title>
      </Head>

      <Container fluid={false}>
        <RowWideContainer>
          {workIsLoading ? (
            <Placeholder animation="glow">
              <h4 className="card-title placeholder-glow">
                <span className="placeholder col-6"></span>
              </h4>
            </Placeholder>
          ) : null}
          {!workIsLoading && !workQuery.data ? <h5>Work not found</h5> : null}
          {!!workQuery.data && (
            <>
              <h4>{workQuery.data?.name}</h4>
              {!tokensIsLoading && (
                <>
                  <Table striped bordered hover>
                    <TableHeader />
                    <tbody>
                      {tokens.data?.tokens.map((token) => {
                        return (
                          <tr key={token.token_id}>
                            <td>
                              <Link
                                href={`/work/${workQuery.data.slug}/${token.token_id}`}
                              >
                                {token.token_id}
                              </Link>
                            </td>
                            <td>{mapStatus(token.status).status}</td>
                            <td>{mapStatus(token.status).description}</td>
                            <td>{relativeTime(token.updatedDate)}</td>
                            <td>
                              <Link
                                href={
                                  token.imageUrl
                                    ? `${normalizeMetadataUri(token.imageUrl)}`
                                    : "#"
                                }
                              >
                                Image
                              </Link>
                              {" • "}
                              <Link
                                href={
                                  token.metadataUri
                                    ? `${normalizeMetadataUri(
                                        token.metadataUri
                                      )}`
                                    : "#"
                                }
                              >
                                Metadata
                              </Link>
                              {" • "}
                              <Link href={liveUrl(token.hash)}>Live</Link>
                              {" • "}
                              <Link
                                href={chainInfo().explorerUrlToTx.replace(
                                  "{txHash}",
                                  token.tx_hash
                                )}
                              >
                                Mint Tx
                              </Link>
                              {" • "}
                              <Link
                                href={`${config.launchpadUrl}/m/${workQuery.data?.sg721}/${token.token_id}`}
                              >
                                Stargaze
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <PaginationPw
                    page={page}
                    countPages={countPages}
                    changePage={changePage}
                    pageSize={take}
                  />
                </>
              )}
            </>
          )}

          {(workIsLoading || tokensIsLoading) && (
            <Placeholder animation="glow">
              <Table striped bordered hover>
                <TableHeader />
                <tbody>
                  {new Array(take).fill(0).map((token, i) => {
                    return (
                      <tr key={i}>
                        {headers.map((header, i) => {
                          return (
                            <td key={i}>
                              <Placeholder animation="glow">
                                <Placeholder
                                  className={"d-inline-block Width-full"}
                                />
                              </Placeholder>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Placeholder>
          )}
        </RowWideContainer>
      </Container>
    </>
  );
};

WorkStatusPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default WorkStatusPage;
