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
  const urlSource = query.url && (await fetch(query.url));
  // MDX text - can be from a local file, database, anywhere
  //   const source = `---
  // title: Test
  // ---

  // Some **mdx** text, with a component <Test name={frontmatter.title}/>
  //   `;
  const source = urlSource
    ? await urlSource.text()
    : `Add a course url by adding "?url=YOUR_COURSE_URL" to the end of the address bar.

  Ex: https://alphascript.netlify.app?course?url=https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/README.md
  `;

  const mdxSource = await serialize(source, { parseFrontmatter: true });
  return { props: { mdxSource } };
}
