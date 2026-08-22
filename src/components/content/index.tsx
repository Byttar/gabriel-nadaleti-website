import React from "react";
import CurrentInfo from "./currentInfo";
import Posts from "./posts";
import Photos from "./photos";
import Songs from "./songs";
import Code from "../code";

const Content: React.FC = () => {
  return (
    <main className=" w-full mt-15 gap-8 flex flex-col">
      <p className="text-stone-500 text-sm">
        <Code script="whoami" />
      </p>
      <h1 className="text-5xl font-bold">Gabriel Nadaleti</h1>
      <p className="text-stone-400 text-sm max-w-170">
        Desenvolvedor, produtor musical, fotógrafo ocasional, apreciador das pequenas coisas. Este é meu cantinho da internet onde escrevo sobre coisas que estou construindo, criando, ouvindo e pensando.
      </p>
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-16">
        <CurrentInfo/>
        <Posts/>
        <Photos/>
        <Songs/>
      </div>
    </main>
  );
};

export default Content;
