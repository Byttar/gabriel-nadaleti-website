import fs from "node:fs";
import readline from "node:readline";
import path from "node:path";

// Helper to ask questions via CLI
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function sanitizeFileName(name) {
  // Replace any characters that are not allowed in file names
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60); // limit length
}

async function main() {
  // Prompt for post details
  const title = await ask("Título do post: ");
  if (!title) {
    console.log("Título obrigatório.");
    rl.close();
    process.exit(1);
  }
  const description = await ask("Descrição do post: ");
  if (!description) {
    console.log("Descrição obrigatória.");
    rl.close();
    process.exit(1);
  }

  // REMOVED IMAGE PROMPT

  // New PROMPT: tags separated by comma
  const tagsInput = await ask("Tags (separadas por vírgula): ");
  // Process and normalize tags (ignore empty strings, trim whitespace)
  const tags = tagsInput
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  // Date - Now in PT/BR
  const now = new Date();
  const formattedDate = now.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Sanitize title for filename and create .md file path
  const sanitizedTitle = sanitizeFileName(title);
  const postsMdDir = path.join(process.cwd(), "src", "assets", "posts");
  if (!fs.existsSync(postsMdDir)) {
    fs.mkdirSync(postsMdDir, { recursive: true });
  }
  const mdFileName = `${sanitizedTitle}.md`;
  const mdFilePath = path.join(postsMdDir, mdFileName);

  // Create empty .md file if it doesn't exist
  if (!fs.existsSync(mdFilePath)) {
    fs.writeFileSync(mdFilePath, "");
  }

  // Structure of post, now referencing the .md file (image removed)
  const post = {
    title,
    description,
    content: `/src/assets/posts/${mdFileName}`,
    date: formattedDate,
    tags
  };

  // Dir to save (create if doesn't exist)
  const postsDir = path.join(process.cwd(), "src", "components", "content", "posts", "data");
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // File to save posts
  const postsFile = path.join(postsDir, "posts.json");

  // Read existing posts if the file exists and is valid, otherwise start as empty array
  let posts = [];
  if (fs.existsSync(postsFile)) {
    try {
      const data = fs.readFileSync(postsFile, "utf8");
      posts = JSON.parse(data);
      if (!Array.isArray(posts)) {
        console.warn("posts.json não contém um array. O arquivo será sobrescrito.");
        posts = [];
      }
    } catch (e) {
      console.warn("posts.json inválido ou não pôde ser lido. Será recriado.");
      posts = [];
    }
  }

  // Add the new post
  posts.push(post);

  // Save the updated posts array
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf8");

  console.log(`\nPost adicionado com sucesso: ${postsFile}`);
  console.log(`Arquivo Markdown criado para conteúdo do post: ${mdFilePath}`);

  rl.close();
}

main().catch((error) => {
  console.error(error);
  rl.close();
  process.exit(1);
});
