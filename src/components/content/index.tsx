import React from "react";
import CurrentInfo from "./currentInfo";
import Posts from "./posts";
import Photos from "./photos";
import Songs from "./songs";
import Code from "../code";
import Type from "../type";

const Content: React.FC = () => {
  return (
    <main className=" w-full mt-6 gap-8 flex flex-col">
      <p className="text-stone-500 text-sm">
        <Code script="whoami" />
      </p>
      <Type delay={0} showCursor={false} className="text-5xl font-bold" text="Gabriel Nadaleti" />
      <Type delay={0} className="text-stone-400 text-sm max-w-170" text="Desenvolvedor, produtor musical, fotógrafo ocasional, apreciador das pequenas coisas. Este é meu cantinho da internet onde escrevo sobre coisas que estou construindo, criando, ouvindo e pensando." speed={10}/>
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
