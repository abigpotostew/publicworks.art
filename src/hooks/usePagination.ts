import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

export interface PagesToRender {
  pagesToRender: number[];
  ellipsisStart: boolean;
  ellipsisEnd: boolean;
}
export const usePagination = ({
  pageCount,
  pageSize,
  pageUrl,
}: {
  pageCount?: number;
  pageSize?: number;
  pageUrl: string;
}) => {
  const router = useRouter();
  const pageIn =
    typeof router.query?.page === "string" &&
    Number.isFinite(parseInt(router.query.page))
      ? parseInt(router.query.page)
      : 1;
  const [page, setPage] = useState<number>(pageIn);
  pageCount = pageCount || 100;
  const pageSizeN = pageSize || 10;
  const totalPages = pageCount * pageSizeN;

  const pages = useMemo(() => {
    const pages = [];
    const end = Math.ceil(totalPages / pageSizeN);
    for (let i = 0; i < end; i++) {
      pages.push(i + 1);
    }
    return pages;
  }, [totalPages]);

  const lastPage = pages.length > 0 ? pages[pages.length - 1] : 1;

  const pagesToRender: PagesToRender = useMemo(() => {
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

  const changePage = (page: number) => {
    const newPage = Math.max(pages[0], Math.min(page, pages[pages.length - 1]));
    router.push(
      {
        pathname: `${pageUrl}`,
        query: { page: newPage.toString() },
        // search: { page: page.toString() },
      },
      {
        pathname: `${pageUrl}`,
        query: { page: newPage.toString() },
      },
      { scroll: false }
    );
    setPage(newPage);
  };

  const nextPage = useCallback(() => {
    changePage(page + 1);
  }, [page]);

  const prevPage = useCallback(() => {
    changePage(page - 1);
  }, [page]);

  return {
    totalPages,
    currentPage: page,
    pages,
    changePage,
    nextPage,
    prevPage,
    lastPage,
    pagesToRender,
  };
};
