import { logos } from "./logos";

// This will come from a JSON file in the future
const BASE_TYPING_DELAY = 3000;

export const mockCareer = {
  name: "Gabriel Nadaleti",
  title: "Senior Web Developer",
  description: `
    Meu nome é Gabriel, sou desenvolvedor a 8 anos e amo o mundo da programação. Sou uma pessoa comprometida e adoro ser desafiado
  `,
  descriptionDelay: BASE_TYPING_DELAY * 1,
  jobs: [
    {
      asciiImage: logos.hubxp,
      color: 'text-green-500',
      title: "Squad Leader | Desenvolvedor Senior",
      company: "Hubxp",
      period: "2022 - Atual",
      description: "Desenvolvimento de interfaces ricas com React.js, TypeScript e TailwindCSS, integração com APIs REST e GraphQL, e participação em decisões de arquitetura de frontend.",
      delay: BASE_TYPING_DELAY * 1,
    },
    {
      asciiImage: logos.eduzz,
      color: 'text-yellow-500',
      title: "Fullstack Developer",
      company: "Eduzz LTDA.",
      period: "2020 - 2022",
      description: `
Atuei como desenvolvedor pleno na equipe responsável pela plataforma Nutror, produto da Eduzz, participando ativamente do desenvolvimento de novas funcionalidades, decisões técnicas e análise contínua do produto para identificar melhorias.

Trabalhei para tornar o sistema altamente escalável, implementando filas com SQS e RabbitMQ, caching com Redis e utilizando bancos de dados MongoDB, SQL Server e PostgreSQL. Desenvolvi APIs seguras com PHP/Laravel e NestJS usando arquitetura de microserviços e integrações, além de preparar serviços com Kubernetes e Jenkins.

Na camada de front-end, desenvolvi interfaces performáticas com React e Tailwind a nível Pixel Perfect, totalmente responsivos.

Atuando com metodologia ágil SCRUM e sou também responsável pela manutenção, garantindo a estabilidade e evolução contínua da plataforma.`,
      delay: BASE_TYPING_DELAY * 2,
    },
    {
      asciiImage: logos.mktnow,
      color: 'text-red-500',
      title: "Fullstack Developer",
      company: "Mktnow",
      period: "2020 - 2022",
      description: `
Trabalhei desenvolvendo e dando manutenção para sites deempresas locais onde realizava o desenvolvimento de landing pages, emails marketing, sites intitucionais e e-commerces utilizando plataformas SASS como VTEX, Loja Integrada, etc.

Durante esse periodo desenvolvi muito minhas habilidades de HTML, CSS e Javascript poís sempre haviam alguns desafios durante o desenvolvimento que me fizeram crescer muito como profissional.`,
      delay: BASE_TYPING_DELAY * 3,
    },
  ],
  scholarship: [
    {
      degree: "Tecnólogo em Analise de Sistemas",
      institution: "Fatec Dom Amauri Castanho",
      period: "2019 - 2021",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, lorem vel accumsan suscipit, orci dolor gravida elit, nec gravida orci lacus eget eros. Aliquam et faucibus erat. Sed luctus auctor augue, sed ullamcorper diam iaculis viverra. Vestibulum a libero enim. Donec tristique nisi id luctus suscipit. Morbi in tortor tincidunt tellus porta placerat sed vitae lorem. Vestibulum accumsan, nisi vitae sagittis convallis, sem urna pharetra ante, sed venenatis nunc erat a arcu. Proin feugiat mi massa, vitae sodales tortor lacinia sed.",
      delay: BASE_TYPING_DELAY * 3,
    },
    {
      degree: "Ensino Técnico Integrado ao Ensino Médio",
      institution: "Etec Martinho Di Ciero",
      period: "2015 - 2018",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, lorem vel accumsan suscipit, orci dolor gravida elit, nec gravida orci lacus eget eros. Aliquam et faucibus erat. Sed luctus auctor augue, sed ullamcorper diam iaculis viverra. Vestibulum a libero enim. Donec tristique nisi id luctus suscipit. Morbi in tortor tincidunt tellus porta placerat sed vitae lorem. Vestibulum accumsan, nisi vitae sagittis convallis, sem urna pharetra ante, sed venenatis nunc erat a arcu. Proin feugiat mi massa, vitae sodales tortor lacinia sed.",
      delay: BASE_TYPING_DELAY * 3,
    }
  ],
  skills: [
    "TypeScript", "React", "Node.js", "Express", "TailwindCSS", "Git", "REST APIs", "PostgreSQL", "MongoDB", "CI/CD", "Liderança", "Comunicação Assertiva"
  ],
  skillsDelay: BASE_TYPING_DELAY * 4,
  languages: [
    { lang: "Português", level: "Nativo 🇧🇷", delay: BASE_TYPING_DELAY * 5 },
    { lang: "Inglês", level: "Avançado 🇺🇸", delay: BASE_TYPING_DELAY * 5 + 500 },
    { lang: "Francês", level: "Aprendendo 🇫🇷", delay: BASE_TYPING_DELAY * 5 + 1000 },
  ],
  other: [
    { text: "Design responsivo", delay: BASE_TYPING_DELAY * 6 },
    { text: "Acessibilidade web", delay: BASE_TYPING_DELAY * 6 + 400 },
    { text: "Deploy em Vercel/Netlify", delay: BASE_TYPING_DELAY * 6 + 800 },
    { text: "Docker básico", delay: BASE_TYPING_DELAY * 6 + 1200 }
  ]
};
