import React from "react";
import Code from "../../code";
import Info from "./data.json";

const Item = ({title, sub}: {title: string, sub: string}) => (
    <li>
        <span className="flex-col flex gap-6 font-medium text-stone-500">{title}</span>{" "}
        <span className="text-white">{sub}</span>
    </li>
)

const CurrentInfo: React.FC = () => {
  console.log(Info);
  return (
    <section className="my-8">
      <Code script="./now"/>
      <ul className="w-full flex-col mt-4 border-dashed border-primarydim animate-bordertype border-2 p-4 pb-8 px-4 flex text-stone-400 text-sm space-y-1">
        <p className="text-primary mb-4">//<span> atualmente</span></p>
        <div className="flex flex-col gap-8 md:gap-0 md:flex-row w-full justify-between">
          <Item title={"Ouvindo"} sub={Info.now.listening}/>
          <Item title={"Lendo"} sub={Info.now.reading}/>
          <Item title={"Hiperfoco"} sub={Info.now.Hiperfocus}/>
        </div>
      </ul>
    </section>
  );
};

export default CurrentInfo;
