import React, { useMemo, useState } from "react";
import posts from "../assets/data/posts.json";
import { postSlug } from "../utils/postSlug";
import SessionNav from "../components/sessionNav";
import Code from "../components/code";
import { Link } from "react-router";
import { isRecentPost } from "../utils/isRecentPost";
import Type from "../components/type";
import { useTypingPersistentTitle } from "../hooks/usePersistText";

function getAllTags(myPosts: typeof posts) {
  const allTags = myPosts.flatMap((post) => post.tags ?? []);
  return Array.from(new Set(allTags));
}

const PostsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => getAllTags(posts), []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // "novo" pseudo tag for recent posts
      const postIsRecent = isRecentPost(post.date);
      const postTags = [...(post.tags ?? [])];
      if (postIsRecent && !postTags.includes("novo")) {
        postTags.push("novo");
      }

      const tagMatch =
        !selectedTag ||
        postTags.includes(selectedTag);

      const s = search.toLowerCase().trim();
      const searchMatch =
        !s ||
        post.title.toLowerCase().includes(s) ||
        (post.description || "").toLowerCase().includes(s) ||
        postTags.some((tag) => tag.toLowerCase().includes(s));

      return tagMatch && searchMatch;
    });
  }, [search, selectedTag]);

  const [title] = useTypingPersistentTitle("Posts")


  return (
    <main className="w-full mt-6 gap-4 flex flex-col">
      <Code script="./Posts" />
      <h1 className="font-bold text-white text-2xl sm:text-3xl mb-4 pl-0">
        {title}
      </h1>
      <div className="flex gap-2">
      <Type speed={10} text="Uma lista com todos os posts..." className="text-stone-400 text-sm -mt-4 mb-5" />
      <Type speed={10} cursor={false} delay={2500} text="Só isso mesmo" className="text-stone-400 text-sm -mt-4 mb-5" />
      </div>
      {/* Simple search bar */}
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          placeholder="Pesquisar posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 w-full rounded border border-stone-800 bg-stone-900 text-white focus:outline-none focus:border-primary"
        />
        {/* Tags list */}
        <div className="flex flex-wrap gap-2 mt-1">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-1 rounded text-xs border transition-colors ${selectedTag === null
              ? "bg-primarydim text-white border-primary border-dashed"
              : "bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800"
              }`}
          >
            Todas
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 py-1 rounded text-xs border transition-colors ${selectedTag === tag
                ? "bg-primarydim text-white border-primary border-dashed"
                : "bg-stone-900 text-stone-500 border-stone-800 hover:bg-stone-800"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center text-stone-400 text-sm py-10">
            Nenhum post encontrado.
          </div>
        ) : (
          filteredPosts
            .slice() // copy to avoid mutating filteredPosts in place
            .reverse()
            .map((post) => {
              const postTags = [...(post.tags ?? [])];

              return (
                <Link
                  key={post.title}
                  to={`/posts/${postSlug(post.title)}`}
                  className="relative block border-dashed border border-stone-800 bg-stone-950 rounded-md px-4 py-3 hover:border-primary transition-colors"
                >
                  <span className="text-xs text-stone-500 tracking-widest block mb-1">{post.date}</span>
                  <h2 className="text-lg font-bold text-white mb-1">
                    {post.title}
                    <span className="inline-block sm:absolute static ml-0 xs:ml-2 sm:ml-4 top-2 right-3 border-primary border border-dashed px-2 rounded text-xs">Novo</span>
                  </h2>
                  <p className="text-stone-400 text-sm mb-2">{post.description}</p>
                  <div className="flex flex-row gap-2">
                    {postTags.map((tag) =>
                      <span
                        key={tag}
                        className="bg-stone-900 text-stone-500 rounded px-2 py-1 text-xs border border-stone-800"
                      >
                        {tag}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })
        )}
      </div>
      <div className="flex justify-center mt-8">
        <SessionNav url="/" link="Voltar ao início" />
      </div>
    </main>
  );
};

export default PostsPage;
