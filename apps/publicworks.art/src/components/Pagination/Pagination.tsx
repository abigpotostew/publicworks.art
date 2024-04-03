import { PagesToRender } from "../../hooks/usePagination";
import { Dropdown, Pagination } from "react-bootstrap";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export const PaginationPw = ({
  page,
  changePage,
  pageSize,
  countPages,
  countItems,
  setPageSize,
}: {
  page: number;
  changePage: (n: number) => void;
  countPages: number;
  pageSize: number;
  countItems?: number[];
  setPageSize?: (n: number) => void;
}) => {
  const lastPage = countPages;

  const pagesToRender = useMemo(() => {
    const pagesToRender: number[] = [];
    const start = Math.max(1, page - 3);
    const end = Math.min(lastPage, page + 3);
    for (let i = start; i <= end; i++) {
      pagesToRender.push(i);
    }
    const ellipsisStart = !!(start > 1 && pagesToRender.length);
    const ellipsisEnd = end < lastPage;

    return { ellipsisStart, ellipsisEnd, pagesToRender };
  }, [page, lastPage]);

  return (
    <div className={"flex flex-row gap-1"}>
      <Pagination>
        <Pagination.First disabled={page === 1} onClick={() => changePage(1)} />
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
          onClick={() => changePage(lastPage)}
        />
      </Pagination>
      <>
        {!!countItems && (
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {pageSize}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {countItems?.map((item) => (
                <Dropdown.Item
                  key={item}
                  eventKey={item.toString()}
                  onClick={() => setPageSize?.(item)}
                >{`${item}`}</Dropdown.Item>
              ))}
              {/*<Dropdown.Item eventKey={"10"} onClick={() => setPageSize?.(10)}>*/}
              {/*  10*/}
              {/*</Dropdown.Item>*/}
              {/*<Dropdown.Item eventKey={"25"} onClick={() => setPageSize?.(25)}>*/}
              {/*  25*/}
              {/*</Dropdown.Item>*/}
              {/*<Dropdown.Item eventKey={"100"} onClick={() => setPageSize?.(100)}>*/}
              {/*  100*/}
              {/*</Dropdown.Item>*/}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </>
    </div>
  );
};

export const useChangePage = (
  pagePath: string,
  countPages: number,
  setPageCb?: (page: number) => void
) => {
  const router = useRouter();
  // const pageIn = parseInt(router.query.page?.toString() || "1");

  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (router.isReady) {
      const pageIn = parseInt(router.query.page?.toString() || "1");
      setPage(pageIn);
    }
  }, [router.isReady, router.query.page]);
  const changePage = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(page, countPages));
      router.push(
        {
          pathname: pagePath,
          query: { page: newPage.toString() },
          // search: { page: page.toString() },
        },
        {
          pathname: pagePath,
          query: { page: newPage.toString() },
        },
        { scroll: false }
      );
      setPage(newPage);
      setPageCb?.(newPage);
    },
    [router, countPages, pagePath, setPageCb]
  );
  return { changePage, page, isReady: router.isReady };
};
