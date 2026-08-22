import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const PHOTOS_DIR = path.join(process.cwd(), "src", "assets", "photos");
const OUTPUT_FILE = path.join(process.cwd(), "src", "components", "content", "photos", "data", "photos.json");
const CACHE_DIR = path.join(process.cwd(), "scripts", ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "_loadedPhotos.json");

// Helper to recursively find all image files in a directory
function getAllPhotos(dir, relative = "") {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const relPath = path.join(relative, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
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

  // Load existing photos json if exists to preserve prior data
  let previousRecords = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      previousRecords = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
      if (!Array.isArray(previousRecords)) previousRecords = [];
    } catch {
      previousRecords = [];
    }
  }

  // Gather all photo relative paths, sort for deterministic id assignment
  const photos = getAllPhotos(PHOTOS_DIR);
  photos.sort();

  if (photos.length === 0) {
    console.log("Nenhuma foto encontrada em", PHOTOS_DIR);
    rl.close();
    process.exit(0);
  }

  // Map for previousRecords by photo path (to preserve prior data like title/desc);
  // Key by path ("/src/assets/photos/"+rel)
  const prevRecordMap = new Map();
  for (const rec of previousRecords) {
    // fallback for older data may have different path formats
    prevRecordMap.set(rec.path, rec);
  }

  let addCount = 0;
  // Set for O(1) lookups on loaded/cached photos
  const loadedSet = new Set(loadedPhotos);

  // Will assemble this array with correct incremental id assignment
  const newRecords = [];

  for (let i = 0; i < photos.length; ++i) {
    const photo = photos[i];
    const id = getPhotoId(i);
    const photoPath = `/src/assets/photos/${photo}`;
    const filename = photo.split("/").pop() || path.basename(photo);

    let record = null;
    // Try to preserve previous metadata if available (title, description), but always update id
    if (prevRecordMap.has(photoPath)) {
      // Clone previous but update id
      record = { ...prevRecordMap.get(photoPath), id };
    }

    if (!loadedSet.has(photo)) {
      // Not in cache, need to ask for data
      console.log(`\nArquivo encontrado: ${photo}`);
      const title = await ask("Título da imagem: ");
      const description = await ask("Descrição curta: ");
      record = {
        id,
        title,
        description,
        path: photoPath,
        filename, // includes extension
      };
      loadedPhotos.push(photo);
      addCount++;
    } else if (!record) {
      // Loaded/cached but not present in previousRecords (possible if deleted the output and reran with cache preserved),
      // so ask for info
      console.log(`\nArquivo encontrado (no old data): ${photo}`);
      const title = await ask("Título da imagem: ");
      const description = await ask("Descrição curta: ");
      record = {
        id,
        title,
        description,
        path: photoPath,
        filename,
      };
    } else {
      // Present in records/cached: ensure id is updated
      record.id = id;
    }

    newRecords.push(record);
  }

  // Save to json and cache
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(newRecords, null, 2), "utf8");
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
