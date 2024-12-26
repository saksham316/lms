import { Storage } from "@google-cloud/storage";
import { Buffer } from "buffer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyFilename = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY
// console.log("THis is key name", keyFilename)
const storageClient = new Storage({
          keyFilename,
});
export const makePublic = async (req,res) => {
          try {
                    const bucketName = 'gravita-oasis-lms';
                    // Get a list of all files in the bucket
                    // console.log("Reached here")
                    const [files] = await storageClient.bucket(bucketName).getFiles();
                    // Make each file public
                    await Promise.all(files.map(async file => {
                              await file.makePublic();
                              // console.log(`File ${file.name} is now public.`);
                    }));

                    console.log('All files in the bucket are now public.');
                    res.status(200).json({
                              success: true,
                              message: "All the files available in the bucket are now public!"
                    });
          } catch (error) {
                    res.status(400).json({
                              success: false,
                              message: error ?? error?.message
                    });
          }
}


