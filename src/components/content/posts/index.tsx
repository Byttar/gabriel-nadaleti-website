import React from "react";
import { Link } from "react-router";
import Code from "../../code";
import SessionNav from "../../sessionNav";
import { postSlug } from "../../../utils/postSlug";

import posts from "../../../assets/data/posts.json";
import { isRecentPost } from "../../../utils/isRecentPost";

type PostProps = {
  date: string;
  title: string;
  description: string;
  tags: string[];
  isFirst: boolean;
  isRecent: boolean;
};

const Post: React.FC<PostProps> = ({ date, title, description, tags, isFirst, isRecent }) => (
  <Link to={`/posts/${postSlug(title)}`} className="font-semibold">
    <div style={isFirst ? { borderTop: 0 } : {}} className="pt-4 hover:px-4 hover:bg-stone-900 cursor-pointer flex gap-2 flex-col md:flex-row items-start md:gap-16 justify-start border-t border-dashed border-stone-800 pb-5">
      <span className="text-xs text-stone-500 tracking-widest mb-1 sm:mb-0">{date}</span>
      <div className="-mt-1">
        <h2 className="font-bold text-white text-base sm:text-lg mb-0 pl-0">
          {title}
        </h2>
        <p className="text-stone-400 text-xs mt-1 mb-2">
          {description}
        </p>
        <div className="flex flex-row gap-2 mt-1">
          {tags.map(tag => (
            <span
              key={tag}
              className="select-none hover:bg-stone-800 transition-colors bg-stone-900 text-stone-500 rounded px-2 py-1 text-xs border border-stone-800"
            >
              {tag}
            </span>
          ))}
          {isRecent && (
            <span
              key="recent"
              className="select-none hover:bg-primarydim text-white rounded px-2 py-1 text-xs border-dashed border-primary border"
            >
              Novo
            </span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

const Posts: React.FC = () => {
  const hasPosts = posts && posts.length > 0;

  return (
    <section>
      <Code script="./Posts" />
      <div className="border-t border-stone-800 mt-2 pt-5 pb-2 gap-4 flex flex-col">
        {hasPosts ? (
          posts
            .slice() // prevent mutating original
            .reverse()
            .map((post: any, idx: number) => {
              const isRecent = post.date && isRecentPost(post.date);
              return (
                <Post
                  key={idx}
                  isFirst={idx === 0}
                  date={post.date}
                  title={post.title}
                  description={post.description}
                  tags={post.tags || []}
                  isRecent={isRecent}
                />
              );
            })
        ) : (
          <div className="flex flex-col items-center py-4 pt-6 text-stone-400">
            <span className="text-4xl mb-2"></span>
            <p className="text-center text-base">Nenhum post publicado ainda :( <br /></p>
          </div>
        )}
      </div>
      {hasPosts && posts.length > 3 && <SessionNav url={"/posts"} link="Ver tudo" />}
    </section>
  );
};

export default Posts;
