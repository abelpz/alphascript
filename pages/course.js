import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import Test from "../components/test.js";

const components = { Test };

export default function Course({ mdxSource }) {
  const { frontmatter } = mdxSource;
  return (
    <div className="wrapper">
      <h1>{mdxSource.frontmatter.title}</h1>
      <MDXRemote {...mdxSource} components={components} lazy />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const urlSource = await fetch(query.url);
  // MDX text - can be from a local file, database, anywhere
  //   const source = `---
  // title: Test
  // ---

  // Some **mdx** text, with a component <Test name={frontmatter.title}/>
  //   `;
  const source = await urlSource.text();

  const mdxSource = await serialize(source, { parseFrontmatter: true });
  return { props: { mdxSource } };
}
