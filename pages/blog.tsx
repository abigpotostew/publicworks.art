import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { getEnabledBlogs } from "src/blog/blogs";
import { BlogCard } from "../src/components/blog/BlogCard";

//prefetch blogs

const BlogPage = () => {
  return (
    <Container>
      <RowThinContainer>
        <h1>Blog</h1>
      </RowThinContainer>
      <RowThinContainer className={"mt-3"}>
        {getEnabledBlogs().map((blog) => {
          return <BlogCard key={blog.slug} blog={blog} />;
        })}
      </RowThinContainer>
    </Container>
  );
};

BlogPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Documentation"}>{page}</MainLayout>;
};

export default BlogPage;
