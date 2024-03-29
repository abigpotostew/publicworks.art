import React, { ReactElement } from "react";
import MainLayout from "../../src/layout/MainLayout";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Markdown } from "../../src/components/markdown/Markdown";
import { RowThinContainer } from "../../src/components/layout/RowThinContainer";
import { Container } from "react-bootstrap";
import { format } from "date-fns";
import { StarsAddressName } from "../../src/components/name/StarsAddressName";
import { getEnabledBlogs } from "../../src/blog/blogs";

export async function getStaticPaths() {
  console.log("getStaticPaths, blog");
  const out: { params: { blogSlug: string } }[] = getEnabledBlogs().map((b) => {
    return { params: { blogSlug: b.slug } };
  });

  console.log("getStaticPaths, blog, done");
  return {
    paths: out,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.blogSlug;
  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }
  const blog = getEnabledBlogs().find((b) => b.slug === slug);
  if (!blog) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      blog,
    },
    // revalidate: 10, // In seconds
    // fallback: "blocking",
  };
};

const BlogPage = ({ blog }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const timestamp = format(new Date(blog.createdAt), "MMMM dd, yyyy");

  return (
    <Container>
      <RowThinContainer>
        <h1>{blog.title}</h1>
        <div className={"d-flex justify-content-between align-items-baseline"}>
          <span>
            Interview by{" "}
            <StarsAddressName
              className={"d-inline-flex"}
              address={blog.authorAddress}
            />
          </span>
          <p>{timestamp}</p>
        </div>
      </RowThinContainer>
      <RowThinContainer className={"mt-2"}>
        <Markdown markdown={blog.content} />
      </RowThinContainer>
    </Container>
  );
};

BlogPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout metaTitle={"Blog - " + page.props.blog.title} noImage={true}>
      {page}
    </MainLayout>
  );
};

export default BlogPage;
