const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const MONGO_URI =
  "mongodb+srv://onemindmarketinfo_db_user:jetaqNSnrTVNgcZT@cluster0.ho8wcd5.mongodb.net/OneMindSearchEngine";

const BACKUP_DIR = path.join(__dirname, "mongodb_backup");
const IMAGE_DIR = path.join(BACKUP_DIR, "images");

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const filepath = path.join(IMAGE_DIR, filename);

    const writer = fs.createWriteStream(filepath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (err) {
    console.log(`Failed image: ${url}`);
  }
}

async function main() {
  await ensureDir(BACKUP_DIR);
  await ensureDir(IMAGE_DIR);

  console.log("Connecting MongoDB...");

  await mongoose.connect(MONGO_URI);

  console.log("Connected");

  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();

  console.log(`Found ${collections.length} collections`);

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;

    console.log(`\nExporting: ${collectionName}`);

    const collection = db.collection(collectionName);

    const docs = await collection.find({}).toArray();

    const filePath = path.join(
      BACKUP_DIR,
      `${collectionName}.json`
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(docs, null, 2)
    );

    console.log(`Saved ${docs.length} docs`);

    // Try downloading image URLs automatically
    let imageCount = 0;

    for (const doc of docs) {
      const values = JSON.stringify(doc);

      const urls =
        values.match(
          /(https?:\/\/.*?\.(jpg|jpeg|png|gif|webp))/gi
        ) || [];

      for (const url of urls) {
        try {
          const ext = path.extname(url).split("?")[0] || ".jpg";

          const filename = `${collectionName}_${imageCount}${ext}`;

          await downloadImage(url, filename);

          imageCount++;
        } catch (e) {}
      }
    }

    console.log(`Downloaded ${imageCount} images`);
  }

  console.log("\nBackup completed");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});