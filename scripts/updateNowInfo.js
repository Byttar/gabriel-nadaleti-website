import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const data = {
    owner: "Gabriel Nadaleti",
    copyright: "© Gabriel Nadaleti",
    subtitle:
      "Desenvolvedor, produtor musical, fotógrafo ocasional, apreciador das pequenas coisas. Este é meu cantinho da internet onde escrevo sobre coisas que estou construindo, criando, ouvindo e pensando.",
    now: {
      listening: "Amie Blue - Trees For the Woods",
      reading: "O mundo de sofia",
      Hiperfocus: "Jogos Retro",
    },
  };

  const listening = await ask(
    `O que você está ouvindo agora? [${data.now.listening}] `
  );

  const reading = await ask(
    `O que você está lendo agora? [${data.now.reading}] `
  );

  const hiperfocus = await ask(
    `Em que está hiperfocado agora? [${data.now.Hiperfocus}] `
  );

  data.now.listening = listening || data.now.listening;
  data.now.reading = reading || data.now.reading;
  data.now.Hiperfocus = hiperfocus || data.now.Hiperfocus;

  const changeSubtitle = await ask("Deseja mudar o subtitle? (s/n) [n] ");

  if (["s", "sim", "y", "yes"].includes(changeSubtitle.toLowerCase())) {
    const newSubtitle = await ask("Qual o novo subtitle? ");

    if (newSubtitle) {
      data.subtitle = newSubtitle;
    }
  }

  // New path and filename for data.json
  const outputDir = path.join(process.cwd(), "src", "assets", "data");
  const outputFile = path.join(outputDir, "currentInfo.json");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    outputFile,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log("\nArquivo currentInfo.json atualizado com sucesso!");

  rl.close();
}

main().catch((error) => {
  console.error(error);
  rl.close();
  process.exit(1);
});
