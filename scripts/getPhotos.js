import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");

const CACHE_FILE = path.join(
  process.cwd(),
  "scripts",
  ".cache",
  "_loadedPhotos.json"
);

// Updated location for photos.json: /src/assets/data/photos.json
const PHOTOS_FILE = path.join(
  process.cwd(),
  "src",
  "assets",
  "data",
  "photos.json"
);

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

function parseTags(input) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function getPhotoPath(filename) {
  return `/photos/${normalizePath(filename)}`;
}

function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    console.log("_loadedPhotos.json does not exist. Creating it.");
    return [];
  }

  const data = fs.readFileSync(CACHE_FILE, "utf8");

  if (!data.trim()) {
    return [];
  }

  const parsed = JSON.parse(data);

  if (!Array.isArray(parsed)) {
    throw new Error("_loadedPhotos.json must contain an array.");
  }

  return parsed;
}

function loadPhotos() {
  if (!fs.existsSync(PHOTOS_FILE)) {
    return [];
  }

  const data = fs.readFileSync(PHOTOS_FILE, "utf8");

  if (!data.trim()) {
    return [];
  }

  const parsed = JSON.parse(data);

  if (!Array.isArray(parsed)) {
    throw new Error("photos.json must contain an array.");
  }

  return parsed;
}

function getPhotoFiles(directory, relativeDirectory = "") {
  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.join(relativeDirectory, entry.name);

    // Ignore /public/photos/posts completely.
    if (
      entry.isDirectory() &&
      relativePath.split(path.sep)[0] === "posts"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...getPhotoFiles(fullPath, relativePath));
      continue;
    }

    if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

function getNextId(photos) {
  if (photos.length === 0) {
    return 1;
  }

  const ids = photos
    .map((photo) => Number(photo.id))
    .filter((id) => Number.isInteger(id));

  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

async function createPhoto(filename, id, group = "") {
  const title = await ask("Title: ");
  const description = await ask("Description: ");
  const tagsInput = await ask("Tags (separated by comma): ");

  const photo = {
    id,
    filename,
    title,
    description,
    tags: parseTags(tagsInput),
    path: getPhotoPath(filename),
  };

  // Only add the group key when a group was provided.
  if (group) {
    photo.group = group;
  }

  return photo;
}

async function main() {
  console.log("Scanning photos...");

  if (!fs.existsSync(PHOTOS_DIR)) {
    throw new Error(
      `Photos directory does not exist:\n${PHOTOS_DIR}`
    );
  }

  const loadedPhotos = loadCache();
  const photos = loadPhotos();

  const files = getPhotoFiles(PHOTOS_DIR);

  const normalizedFiles = files.map(normalizePath);

  const loadedSet = new Set(
    loadedPhotos.map(normalizePath)
  );

  const missingFiles = normalizedFiles.filter(
    (file) => !loadedSet.has(file)
  );

  console.log(`Found ${normalizedFiles.length} file(s).`);
  console.log(`Found ${loadedPhotos.length} file(s) in cache.`);
  console.log(`Found ${missingFiles.length} new file(s).`);

  if (missingFiles.length === 0) {
    console.log("No new photos found.");
    return;
  }

  let nextId = getNextId(photos);
  let changedPhotos = false;

  for (const filename of missingFiles) {
    console.log(`\nA new file has been found: ${filename}`);

    // Group is always the first question.
    const group = await ask("Group (optional): ");

    const photoPath = getPhotoPath(filename);

    // Find an existing photo that represents the requested group.
    const existingGroup = group
      ? photos.find((photo) => photo.group === group)
      : null;

    if (existingGroup) {
      if (!Array.isArray(existingGroup.groupedPhotos)) {
        existingGroup.groupedPhotos = [];
      }

      const groupedPhoto = {
        path: photoPath,
        filename,
      };

      // Prevent the same file from being added twice.
      const alreadyExists = existingGroup.groupedPhotos.some(
        (photo) => photo.filename === filename
      );

      if (!alreadyExists) {
        existingGroup.groupedPhotos.push(groupedPhoto);
      }

      console.log(
        `Added ${filename} to group "${group}".`
      );

      changedPhotos = true;
    } else {
      // No group was provided, or the requested group does not exist.
      const photo = await createPhoto(
        filename,
        nextId,
        group
      );

      photos.push(photo);

      nextId++;
      changedPhotos = true;
    }

    // Mark the file as processed in the cache.
    loadedSet.add(filename);
    loadedPhotos.push(filename);
  }

  // Make sure the cache directory exists.
  fs.mkdirSync(path.dirname(CACHE_FILE), {
    recursive: true,
  });

  // Save loaded files cache.
  fs.writeFileSync(
    CACHE_FILE,
    JSON.stringify(loadedPhotos, null, 2) + "\n",
    "utf8"
  );

  // Save actual photo data.
  if (changedPhotos) {
    fs.mkdirSync(path.dirname(PHOTOS_FILE), {
      recursive: true,
    });

    fs.writeFileSync(
      PHOTOS_FILE,
      JSON.stringify(photos, null, 2) + "\n",
      "utf8"
    );
  }

  console.log(
    `\nProcessed ${missingFiles.length} new file(s).`
  );

  console.log(`Updated cache: ${CACHE_FILE}`);
  console.log(`Updated photos: ${PHOTOS_FILE}`);
}

main()
  .catch((error) => {
    console.error("\nError:");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
