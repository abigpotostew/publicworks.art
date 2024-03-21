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
import { ButtonGroup, Container, Dropdown, Placeholder } from "react-bootstrap";
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
import { ButtonPW } from "../../../src/components/button/Button";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { useLastMintedToken } from "../../../src/hooks/useLastMintedToken";

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
  const { workId: workIdIn, page: pageIn } = router.query;
  const workId = workIdIn?.toString() || "";
  const workQuery = useGetWorkById(workId);
  const [take, setTake] = useState(2);
  const [skip, setSkip] = useState(0);
  const countQuery = useLastMintedToken(workQuery.data?.slug, 10000);
  const pageNumeric = pageIn ? parseInt(pageIn.toString()) : 1;
  const currentCursor = pageIn ? pageNumeric : undefined;

  const tokens = useTokenStatus({
    workId: parseInt(workId),
    take,
    cursor: currentCursor?.toString(),
  });

  //for use with infinite scroll
  const [dataIndex, setDataIndex] = useState(0);

  const setPage = useCallback(
    async (page: number | ((prev: number) => number)) => {
      let pageOut: number | undefined = undefined;
      if (typeof page === "function") {
        pageOut = page(pageNumeric);
      } else {
        pageOut = page;
      }
      await router.push(`/create/${workId}/status?page=${pageOut}`, undefined, {
        shallow: true,
      });
    },
    [router, workId, pageNumeric]
  );

  const nextPage = useCallback(async () => {
    await tokens.fetchNextPage();
    setDataIndex((prev) => prev + 1);
    setPage((prev) => prev + 1);
  }, [tokens.fetchNextPage]);
  const prevPage = useCallback(async () => {
    setPage((prev) => prev - 1);
    setDataIndex((prev) => prev - 1);
  }, [tokens.fetchPreviousPage]);
  const pageData = tokens.data?.pages?.length
    ? tokens.data?.pages[dataIndex]
    : undefined;

  const hasMore = !!pageData?.nextCursor;
  const hasPrevious = dataIndex > 0;

  const hasItems = !!pageData?.items.length;
  const pageItems = pageData?.items ?? [];
  // const { changePage, dataIndex, isReady } = useChangePage(
  //   `/create/${workId}/status`,
  //   countPages,
  //   setPage
  // );

  // useEffect(() => {
  //   const newSkip = (dataIndex - 1) * take;
  //   setSkip(newSkip);
  // }, [take, skip, dataIndex]);

  // isReady = true;
  const isReady = router.isReady;
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
                      {pageItems.map((token) => {
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
                  {/*<PaginationPw*/}
                  {/*  dataIndex={dataIndex}*/}
                  {/*  countPages={countPages}*/}
                  {/*  changePage={changePage}*/}
                  {/*  pageSize={take}*/}
                  {/*/>*/}

                  <div className={"tw-flex tw-flex-row tw-gap-1"}>
                    <ButtonPW
                      variant={"outline-secondary"}
                      onClick={() => prevPage()}
                      disabled={
                        !hasPrevious ||
                        tokens.isLoading ||
                        tokens.isFetchingNextPage ||
                        tokens.isFetchingPreviousPage
                      }
                    >
                      {"Previous"}
                    </ButtonPW>
                    <ButtonPW
                      variant={"outline-secondary"}
                      onClick={() => nextPage()}
                      disabled={
                        !hasMore ||
                        tokens.isLoading ||
                        tokens.isFetchingNextPage ||
                        tokens.isFetchingPreviousPage
                      }
                    >
                      {"Next"}
                    </ButtonPW>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="dropdown-basic"
                      >
                        {take}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          eventKey={"10"}
                          onClick={() => setTake(10)}
                        >
                          10
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={"25"}
                          onClick={() => setTake(25)}
                        >
                          25
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={"100"}
                          onClick={() => setTake(100)}
                        >
                          100
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
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
