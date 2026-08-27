import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

// Search in public/photos instead of src/assets/photos
const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const OUTPUT_FILE = path.join(process.cwd(), "src", "components", "content", "photos", "data", "photos.json");
// Cache remains in /scripts
const CACHE_DIR = path.join(process.cwd(), "scripts", ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "_loadedPhotos.json");

// Helper to recursively find all image files in a directory, but ignore /posts subfolder
function getAllPhotos(dir, relative = "") {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const relPath = path.join(relative, file);
    const stat = fs.statSync(filePath);
    // Ignore /posts directory at any depth from PHOTOS_DIR
    if (stat && stat.isDirectory()) {
      if (file.toLowerCase().includes("posts")) {
        // Skip /posts folder
        return;
      }
      results = results.concat(getAllPhotos(filePath, relPath));
    } else if (stat && stat.isFile()) {
      // Only allow some common image extensions
      if (/\.(jpe?g|png|gif|webp|bmp|jpeg)$/i.test(file)) {
        results.push(relPath.replace(/\\/g, "/")); // always forward slashes
      }
    }
  });
  return results;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// Helper to prompt for tags, split by comma, trim, filter empty
async function askTags() {
  const tagsInput = await ask("Tags (separadas por vírgula): ");
  return tagsInput
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Generate next id for photo based on index in sorted photos array (1-based incremental)
function getPhotoId(idx) {
  return idx + 1;
}

async function main() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error("Photos directory not found:", PHOTOS_DIR);
    rl.close();
    process.exit(1);
  }

  // Make sure output dir exists
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Make sure cache dir exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Load cache
  let loadedPhotos = [];
  if (fs.existsSync(CACHE_FILE)) {
    try {
      loadedPhotos = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
      if (!Array.isArray(loadedPhotos)) loadedPhotos = [];
    } catch {
      loadedPhotos = [];
    }
  }

  // Gather all photo relative paths, sort for deterministic id assignment, ignoring /posts
  const photos = getAllPhotos(PHOTOS_DIR);
  photos.sort();

  if (photos.length === 0) {
    console.log("Nenhuma foto encontrada em", PHOTOS_DIR);
    rl.close();
    process.exit(0);
  }

  let addCount = 0;
  // Set for O(1) lookups on loaded/cached photos
  const loadedSet = new Set(loadedPhotos);

  // Try to load existing photos.json
  let currentPhotos = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      currentPhotos = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
      if (!Array.isArray(currentPhotos)) {
        console.warn("photos.json não contém um array. O arquivo será reparado.");
        currentPhotos = [];
      }
    } catch {
      console.warn("photos.json inválido ou não pôde ser lido. Será recriado.");
      currentPhotos = [];
    }
  }

  for (let i = 0; i < photos.length; ++i) {
    const photo = photos[i];
    const id = getPhotoId(i + loadedPhotos.length - 1);
    // The photoPath should be like "/public/photos/..."
    const photoPath = `/public/photos/${photo}`;
    const filename = photo.split("/").pop() || path.basename(photo);

    let record = null;

    if (!loadedSet.has(photo)) {
      // Not in cache, need to ask for data
      console.log(`\nArquivo encontrado: ${photo}`);
      const title = await ask("Título da imagem: ");
      const description = await ask("Descrição curta: ");
      const tags = await askTags();
      record = {
        id,
        title,
        description,
        tags,
        path: photoPath,
        filename, // includes extension
      };
      loadedPhotos.push(photo);
      addCount++;

      // Append only the new record to the array in photos.json
      currentPhotos.push(record);

      // Save updated photos.json immediately after each addition
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(currentPhotos, null, 2), "utf8");
    } else {
      // Already in cache, just reuse the path and filename, prompt for everything again (since no previousRecords)
      // Optionally, you can skip and not include old cached photos in output, but let's prompt again to ensure data integrity
      console.log(`\nArquivo já está no cache: ${photo}`);
      continue;
    }
  }

  // Save cache of loaded photos
  fs.writeFileSync(CACHE_FILE, JSON.stringify(loadedPhotos, null, 2), "utf8");
  console.log(`\nDados das fotos salvos em: ${OUTPUT_FILE}`);
  if (addCount === 0) {
    console.log(`Nenhuma nova foto para adicionar. Todas já estavam no cache.`);
  }
  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
