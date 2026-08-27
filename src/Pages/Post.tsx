import React, { useEffect } from "react";
import { useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import Code from "../components/code";
import SessionNav from "../components/sessionNav";
import posts from "../components/content/posts/data/posts.json";
import { postSlug } from "../utils/postSlug";

const markdownFiles = import.meta.glob<string>("../assets/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function getPostContent(content: string): string {
  if (content.endsWith(".md")) {
    const fileName = content.split("/").pop();
    const entry = Object.entries(markdownFiles).find(([path]) =>
      path.endsWith(`/${fileName}`)
    );
    return entry?.[1] ?? "";
  }

  return content;
}

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((entry) => postSlug(entry.title) === slug);

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" })
  });

  if (!post) {
    return (
      <main className="w-full mt-6 gap-4 flex flex-col">
        <Code script="./Post" />
        <p className="text-stone-500">Post não encontrado.</p>
        <SessionNav url="/" link="Voltar ao início" />
      </main>
    );
  }

  const markdown = getPostContent(post.content);

  return (
    <main className="w-full mt-6 gap-4 flex flex-col">
      <Code script="./Post" />
      <article>
        <span className="text-xs text-stone-500 tracking-widest">{post.date}</span>
        <h1 className="font-bold text-white text-2xl sm:text-3xl mb-2 mt-2">
          {post.title}
        </h1>
        <p className="text-stone-400 text-sm mb-4">{post.description}</p>
        <div className="flex flex-row gap-2 mb-6">
          {(post.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="bg-stone-900 text-stone-500 rounded px-2 py-1 text-xs border border-stone-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="[&>p>img]:w-[400px] text-stone-300 text-sm max-w-2xl [&_p]:mb-4 [&_h1]:text-white [&_h1]:font-bold [&_h1]:text-xl [&_h1]:mb-3 [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-lg [&_h2]:mb-2 [&_a]:text-primary [&_a]:underline [&_code]:bg-stone-900 [&_code]:px-1 [&_code]:rounded">
          <ReactMarkdown components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}>{markdown}</ReactMarkdown>
        </div>
      </article>
      <div className="flex justify-center mt-8">
        <SessionNav url="/" link="Voltar ao início" />
      </div>
    </main>
  );
};

export default PostPage;
