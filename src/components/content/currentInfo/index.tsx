import React from "react";
import Code from "../../code";
import Info from "./data.json";
import Type from "../../type";

const Item = ({title, sub, index}: {title: string, sub: string, index: number}) => (
    <li>
        <span className="flex-col flex gap-6 font-medium text-stone-500">{title}</span>{" "}
        <Type showCursor={index === 0} className="text-white" text={sub} delay={4000 + (index * 2000)}/>
    </li>
)

const CurrentInfo: React.FC = () => {
  console.log(Info);
  return (
    <section className="my-8">
      <Code script="./now"/>
      <ul className="w-full flex-col mt-4 animate-bordertype py-4 pb-8  flex text-stone-400 text-sm space-y-1">
        <p className="text-primary mb-4">//<span> atualmente</span></p>
        <div className="flex flex-col gap-8 md:gap-0 md:flex-row w-full justify-between">
          <Item title={"Ouvindo"} sub={Info.now.listening} index={0}/>
          <Item title={"Lendo"} sub={Info.now.reading} index={1}/>
          <Item title={"Hiperfoco"} sub={Info.now.Hiperfocus} index={2}/>
        </div>
      </ul>
    </section>
  );
};

export default CurrentInfo;
