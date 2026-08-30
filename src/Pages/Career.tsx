import React, { useMemo } from "react";
import Code from "../components/code";
import SessionNav from "../components/sessionNav";
import Type from "../components/type";

// This will come from a JSON file in the future
const BASE_TYPING_DELAY = 3000;
const mockCareer = {
  name: "Gabriel Nadaleti",
  title: "Web Developer",
  description: `
    Sou um desenvolvedor web apaixonado por tecnologia, com experiência em criação de aplicações modernas, responsivas e performáticas. Gosto de aprender coisas novas e enfrentar desafios técnicos de frontend e backend.
  `,
  descriptionDelay: BASE_TYPING_DELAY * 0,
  jobs: [
    {
      title: "Frontend Engineer",
      company: "Tech Co.",
      period: "2022 - Atual",
      description: "Desenvolvimento de interfaces ricas com React.js, TypeScript e TailwindCSS, integração com APIs REST e GraphQL, e participação em decisões de arquitetura de frontend.",
      delay: BASE_TYPING_DELAY * 1,
    },
    {
      title: "Fullstack Developer",
      company: "Web Solutions Ltd.",
      period: "2020 - 2022",
      description: "Trabalho com aplicações Node.js, Express, bancos de dados SQL e NoSQL, desenvolvimento de REST APIs e manutenção de infraestrutura básica em cloud.",
      delay: BASE_TYPING_DELAY * 2,
    },
  ],
  scholarship: [
    {
      degree: "Bacharelado em Ciência da Computação",
      institution: "Universidade Federal de Exemplo",
      period: "2016 - 2020",
      description: "Graduação com foco em engenharia de software, algoritmos, estruturas de dados, redes e desenvolvimento web.",
      delay: BASE_TYPING_DELAY * 3,
    }
    // Adicione mais cursos se quiser
  ],
  skills: [
    "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Node.js", "Express", "TailwindCSS", "Git", "REST APIs", "GraphQL", "PostgreSQL", "MongoDB", "Unit Testing", "CI/CD"
  ],
  skillsDelay: BASE_TYPING_DELAY * 4,
  languages: [
    { lang: "Português", level: "Nativo", delay: BASE_TYPING_DELAY * 5 },
    { lang: "Inglês", level: "Avançado", delay: BASE_TYPING_DELAY * 5 + 500 },
    { lang: "Espanhol", level: "Básico", delay: BASE_TYPING_DELAY * 5 + 1000 },
  ],
  other: [
    { text: "Design responsivo", delay: BASE_TYPING_DELAY * 6 },
    { text: "Acessibilidade web", delay: BASE_TYPING_DELAY * 6 + 400 },
    { text: "Deploy em Vercel/Netlify", delay: BASE_TYPING_DELAY * 6 + 800 },
    { text: "Docker básico", delay: BASE_TYPING_DELAY * 6 + 1200 }
  ]
};

const CareerPage: React.FC = () => {
  const {
    name,
    title,
    description,
    descriptionDelay = 0,
    jobs,
    scholarship = [],
    skills,
    skillsDelay = 0,
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
    <main className="w-full max-w-3xl mx-auto mt-8 flex flex-col gap-8">
      <Code script="./Career" />
      <h1 className="font-bold text-white text-2xl sm:text-3xl mb-2">
        <Type className="font-semibold" text={name} />
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

      <section>
        <h2 className="text-lg text-white font-semibold mb-2">
          Experiência Profissional
        </h2>
        <div className="flex flex-col gap-4">
          {jobs.map((job, idx) => (
            // Novo design para experiência profissional: destaque lateral, cor e visual diferenciado
            <div
              key={idx}
              className="relative overflow-hidden group rounded-md border-dashed border-primary border p-4 shadow transition-shadow "
            >
              {/* Barra lateral de destaque animada */}
              <div className="absolute left-0 top-0 h-full w-1 transition-all"></div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                <span className="font-bold text-primary-dark text-base sm:text-lg">
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
                className="text-stone-300 text-sm italic"
                speed={15}
                delay={job.delay}
                text={job.description}
              />
            </div>
          ))}
        </div>
      </section>

      {scholarship.length > 0 && (
        <section>
          <h2 className="text-lg text-white font-semibold mb-2">
            Formação Acadêmica
          </h2>
          <div className="flex flex-col gap-4">
            {scholarship.map((school, idx) => (
              // Change here: different design!
              <div key={idx}>
                <div className="flex flex-col sm:flex-row sm:items-center mb-1 gap-1">
                  <span className="font-bold text-primary-dark">
                    {school.degree}
                  </span>
                  <span className="text-stone-500 mx-2 hidden sm:inline">
                    •
                  </span>
                  <span className="font-semibold text-stone-200">
                    {school.institution}
                  </span>
                  <span className="text-primary ml-auto text-xs bg-primary/10 rounded px-2 py-0.5 font-mono">
                    {school.period}
                  </span>
                </div>
                <div className="text-stone-300 text-sm italic mt-1">
                  <Type
                    className="text-stone-300 text-sm italic"
                    speed={15}
                    delay={school.delay}
                    text={school.description}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg text-white font-semibold mb-2">
          Principais Habilidades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2">
          {skillsColumns.map((col, idxCol) => (
            <ul className="list-disc pl-5 text-stone-300 text-sm" key={idxCol}>
              {col.map((skill, idxSkill) => (
                <li key={skill}>
                  <Type
                    className="text-stone-300 text-sm"
                    speed={15}
                    delay={skillsDelay + idxCol * 200 + idxSkill * 50}
                    text={skill}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg text-white font-semibold mb-2">Idiomas</h2>
        <ul className="flex flex-col gap-1 text-stone-300 text-sm">
          {languages.map((l, idx) => (
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
        <h2 className="text-lg text-white font-semibold mb-2">Outros Conhecimentos</h2>
        <ul className="flex flex-wrap gap-2 mt-1">
          {other.map((item, idx) => (
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
