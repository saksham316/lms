
import { promises as fs } from "fs";
import { Storage } from "@google-cloud/storage";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const PORT = 8000;
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Specify the path to your service account key file
const __dirname = dirname(fileURLToPath(import.meta.url));
const keyFilename = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY
const storageClient = new Storage({ keyFilename });

export const chunkLinkProvider = async (
  req,
  res,
  chunkNum,
  totalNoOfChunks,
  originalname
) => {
  try {
    //here comes the path of chunks
    const chunk = req?.files[1]?.buffer;
    const chunkNumber = Number(chunkNum);
    const totalChunks = Number(totalNoOfChunks);
    const fileName = originalname;
    let mediaDetails = {};

    const chunkDir = `${__dirname}/chunks`;

    try {
      await fs.access(chunkDir); // Check if the directory exists
    } catch (err) {
      await fs.mkdir(chunkDir); // Create the directory if it doesn't exist
    }

    const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

    await fs.writeFile(chunkFilePath, chunk);
    console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

    if (chunkNumber === totalChunks - 1) {
      mediaDetails = await mergeChunks(fileName, totalChunks, originalname);
      console.log("----------------=========>>>It ended=============>>>>>>");
      console.log("File merged successfully inside chunks Video Url generator");
      const result = { outcome: 2, publicUrlForVideo: mediaDetails?.publicUrlForVideo }
      return result 
    } else {
      const result = { outcome: 1 }
      return result 
    }
  } catch (error) {
    console.error("Error saving/uploading chunk:", error);
    return res.status(500).json({ error: "Error saving/uploading chunk" });
  }
};
const mergeChunks = async (fileName, totalChunks, originalname) => {
  try {
    const bucketName = "gravita-oasis-lms";
    const chunkDir = `${__dirname}/chunks`;
    const mergedFilePath = fileName;
    const bucket = storageClient.bucket(bucketName);

    //To create the bucket if not present
    const [bucketExists] = await bucket.exists();
    if (!bucketExists) {
      await bucket.create();
    }
    //Ends here


    const file = bucket.file(mergedFilePath);
    const writeStream = file.createWriteStream();

    for (let i = 0; i < totalChunks; i++) {
      const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
      const chunkBuffer = await fs.readFile(chunkFilePath);
      writeStream.write(chunkBuffer);
      await fs.unlink(chunkFilePath);
    }
    writeStream.end();
    const publicUrlForVideo = `https://storage.googleapis.com/${bucketName}/${originalname}`;
    console.log("Chunks merged successfully");

    return { publicUrlForVideo };
  } catch (error) {
    console.error("Error merging chunks:", error);
    // throw error;
  }
};