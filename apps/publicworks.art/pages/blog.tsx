import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { blogs } from "src/blog/blogs";
import Link from "next/link";

//prefetch blogs

const BlogPage = () => {
  return (
    <Container>
      <RowThinContainer>
        <h1>Blog</h1>
      </RowThinContainer>
      <RowThinContainer>
        {blogs.map((blog) => {
          return (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}>
              <div key={blog.slug}>{blog.title}</div>
            </Link>
          );
        })}
      </RowThinContainer>
    </Container>
  );
};

BlogPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Documentation"}>{page}</MainLayout>;
};

export default BlogPage;
