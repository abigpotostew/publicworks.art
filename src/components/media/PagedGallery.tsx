import Container from "react-bootstrap/Container";
import { Col, Form, Pagination, Row } from "react-bootstrap";
import { FC, useMemo, useState } from "react";
import { Gallery } from "./Gallery";

interface Props {
  totalNumTokens: number;
  sg721: string;
  slug: string;
}

export const PagedGallery: FC<Props> = ({
  slug,
  totalNumTokens,
  sg721,
}: Props) => {
  const [page, setPage] = useState<number>(1);

  const limit = 9;

  const pages = useMemo(() => {
    const pages = [];
    const end = Math.ceil(totalNumTokens / limit);
    for (let i = 0; i < end; i++) {
      pages.push(i + 1);
    }
    return pages;
  }, [totalNumTokens]);

  const lastPage = useMemo(
    () => (pages.length > 0 ? pages[pages.length - 1] : 1),
    [pages]
  );

  const pagesToRender = useMemo(() => {
    const pagesToRender = [];
    const start = Math.max(1, page - 3);
    const end = Math.min(lastPage, page + 3);
    for (let i = start; i <= end; i++) {
      pagesToRender.push(i);
    }
    const ellipsisStart = start > 1 && pagesToRender.length;
    const ellipsisEnd = end < lastPage;

    return { ellipsisStart, ellipsisEnd, pagesToRender };
  }, [page, lastPage]);

  const tokenIds = useMemo(() => {
    const tokenIds = [];
    const from = (page - 1) * limit + 1;
    const to = Math.min(from + limit - 1, totalNumTokens);
    for (let i = from; i <= to; i++) {
      tokenIds.push(i.toString());
    }
    return tokenIds;
  }, [lastPage, page]);

  const changePage = (page: number) => {
    setPage(Math.max(pages[0], Math.min(page, pages[pages.length - 1])));
    // update whatever
    // window.scrollTo(0, 0);
  };

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="sortBy"></Form.Group>
      </Form>
      <Row>
        <Gallery slug={slug} sg721={sg721} tokenIds={tokenIds} />
      </Row>
      <Row>
        <Col />
        <Col>
          <div
            className={"text-center"}
            style={{ margin: "0 auto", width: "50%" }}
          >
            <Pagination>
              <Pagination.First
                disabled={page === 1}
                onClick={() => changePage(1)}
              />
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
              />
              {pagesToRender.ellipsisStart && <Pagination.Ellipsis />}
              {pagesToRender.pagesToRender.map((pageN: number) => (
                <Pagination.Item
                  key={pageN}
                  active={pageN === page}
                  onClick={() => changePage(pageN)}
                >
                  {pageN}
                </Pagination.Item>
              ))}
              {pagesToRender.ellipsisEnd && <Pagination.Ellipsis />}
              <Pagination.Next
                disabled={page === lastPage}
                onClick={() => changePage(page + 1)}
              />
              <Pagination.Last
                disabled={page === lastPage}
                onClick={() => changePage(pages[pages.length - 1])}
              />
            </Pagination>
          </div>
        </Col>
        <Col />
      </Row>
    </Container>
  );
};
