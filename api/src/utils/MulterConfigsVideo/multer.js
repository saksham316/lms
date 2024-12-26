// import multer from "multer";

// const mimeTypes = ["pdf"];
//This is the main multer logic refer to official doc and code snips @ stackoverflow and on google.
// import chalk from "chalk";
import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const storage = multer.memoryStorage();
export const upload = multer({ storage });
