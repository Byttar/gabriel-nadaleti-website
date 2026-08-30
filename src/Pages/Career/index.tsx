import React, { useMemo } from "react";
import Code from "../../components/code";
import SessionNav from "../../components/sessionNav";
import Type from "../../components/type";
import { mockCareer } from "./info";
import { assetUrl } from "../../utils/loadAsset";

const CareerPage: React.FC = () => {
  const {
    name,
    title,
    description,
    descriptionDelay = 0,
    jobs,
    scholarship = [],
    skills,
    languages,
    other
  } = mockCareer;

  // Used for skills grid
  const skillsColumns = useMemo(() => {
    const colCount = 2;
    const colArr: string[][] = Array(colCount).fill(0).map(() => []);
    skills.forEach((skill, idx) => colArr[idx % colCount].push(skill));
    return colArr;
  }, [skills]);

  return (
    <main className="w-full mx-auto mt-6 flex flex-col gap-8">
      <Code script="./Career" />
      <div className="flex gap-6 md:flex-row flex-col">
        <img src={assetUrl("eu.jpeg")} className="md:h-50 md:w-50 sm:h-80 sm:w-80 aspect-square" />
        <div>
          <h1 className="font-bold text-white text-2xl sm:text-3xl mb-2 flex flex-col justify-start">
            <Type cursor={false} className="font-semibold" text={name} />
            <Type className="text-primary" text={title} delay={1000} />
          </h1>
          <div className="text-stone-400 text-base leading-relaxed mb-6">
            <Type
              className="text-stone-400 text-base leading-relaxed"
              speed={15}
              delay={descriptionDelay}
              text={description.trim()}
            />
          </div>
        </div>
      </div>

      {scholarship.length > 0 && (
        <section>
          <h2 className="text-3xl text-white font-semibold mb-2">
            Formação Acadêmica
          </h2>
          <div className="flex flex-col gap-4">
            {scholarship.map((school, idx) => (
              // Change here: different design!
              <div key={idx} className="mb-10 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 border-dashed border-stone-600 mb-4 pb-1 border-b">
                  <div className="flex-col flex">
                    <span className="font-bold text-primary-dark">
                    {school.degree}
                    </span>
                    <span className="font-semibold text-stone-500 italic text-xs">
                      {school.institution}
                    </span>
                  </div>
                  <span className="text-primary ml-auto text-xs bg-primary/10 rounded px-2 py-0.5 font-mono">
                    {school.period}
                  </span>
                </div>
                <div className="text-stone-300 text-sm italic mt-1">
                  <Type
                    className="text-stone-300 text-sm italic"
                    speed={15}
                    delay={school.delay * idx + 7000}
                    text={school.description}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl text-white font-semibold mb-2">
          Principais Habilidades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2">
          {skillsColumns.map((col, idxCol) => (
            <ul className="list-disc pl-5 text-stone-300 text-sm" key={idxCol}>
              {col.map((skill) => (
                <li key={skill}>
                  <p
                    className="text-stone-300 text-sm"
                  >{skill}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>


      <section>
        <h2 className="text-2xl text-white font-semibold mb-4">
          Experiência Profissional
        </h2>
        <div className="flex flex-col gap-5">
          {jobs.map((job, idx) => (
            <div
              key={idx}
              className="border-b pb-10 relative overflow-hidden group border-dashed pt-4 shadow transition-shadow "
            >
              <div>
                <p className={`whitespace-pre leading-[1.01] text-[4px] xs:text-[5px] sm:text-[7px] ${job.color}`}>
                  {job.asciiImage}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                <span className="font-bold text-primary-dark text-base sm:text-2xl">
                  {job.title}
                </span>
                <span className="text-stone-500 mx-2 hidden sm:inline">•</span>
                <span className="font-semibold text-stone-200">
                  {job.company}
                </span>
                <span className="ml-auto flex items-center space-x-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">
                    {job.period}
                  </span>
                </span>
              </div>
              <Type
                className="text-stone-300 whitespace-pre-wrap text-sm italic"
                speed={15}
                persistentCursor
                delay={job.delay}
                text={job.description}
              />
            </div>
          ))}
        </div>
      </section>


      <section>
        <h2 className="text-2xl text-white font-semibold mb-2">Idiomas</h2>
        <ul className="flex flex-col gap-1 text-stone-300 text-sm">
          {languages.map((l) => (
            <li key={l.lang}>
              <span className="font-semibold">{l.lang}:</span>{" "}
              <Type
                className="inline text-stone-300 text-sm"
                speed={15}
                delay={l.delay}
                text={l.level}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl text-white font-semibold mb-2">Outros Conhecimentos</h2>
        <ul className="flex flex-wrap gap-2 mt-1">
          {other.map((item) => (
            <li
              key={typeof item === "string" ? item : item.text}
              className="bg-primary/80 px-2 py-0.5 rounded text-black text-xs font-semibold border border-primary"
            >
              <Type
                className="inline text-black text-xs font-semibold"
                speed={15}
                delay={item.delay}
                text={typeof item === "string" ? item : item.text}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <SessionNav url="/" link="Voltar ao início" />
      </div>
    </main>
  );
};

export default CareerPage;
