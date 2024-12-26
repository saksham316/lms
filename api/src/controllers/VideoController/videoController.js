// import { videoUploadLink } from "../../configs/cloudinaryForVideo.js";
import { v2 as Cloudinary } from "cloudinary";
import { getVideoDurationInSeconds } from "get-video-duration";
import {
  videoDestroyer,
  videoLinkProvider,
} from "../../configs/cloudinaryForVideo.js";
import { imageLinkProvider } from "../../configs/cloudinaryForImage.js";
import { videoModel } from "../../models/Video/videoModel.js";
import chalk, { Chalk } from "chalk";
const customChalk = new Chalk({ level: 0 });
import fs from "fs";
import { Storage } from "@google-cloud/storage";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import mime from "mime-types";
import CryptoJS from 'crypto-js';
import { urlProvider } from "../../configs/GoogleCloudConsoleProvider/cloudGeneratedUrl.js";
import { chunkLinkProvider } from "../../configs/GoogleCloudConsoleProvider/ChunksVideoUrl/chunksVideoUrlGenerator.js";


const bucketName = "gravita-oasis-lms";
// This route is used to add videos
//It works as follows:
// One middleware is there to parse the data and to check the mimeType and then if every check is passed then it will come here.
//Multer is used here and diskStorage too, which is saving the data locally and then the address of the same will be given to google cloud and it will ultimately make the

//New controller with google cloud

export const addVideo = async (req, res) => {
  try {
    
    // Parsing video data from the request body
    const videoData = JSON.parse(req?.body?.videoObj);
    const chunkNumber = JSON.parse(req?.body?.chunkNumber);
    const totalChunks = JSON.parse(req?.body?.totalChunks);
    let originalname = JSON.parse(req?.body?.originalName);
    const originalThumbnailName = `${Math.ceil(Math.random() * 1000000000)}${JSON.parse(req?.body?.originalThumbnailName)}`
    const thumbnailFlag = JSON.parse(req?.body?.thumbnailFlag);
    // console.log("this is the flag", thumbnailFlag)
    // Variable to store Cloudinary information for the video
    // let videoCloudinary;

    // Check if files are present in the request
    if (req?.files) {
      try {
        const filePath = `${req?.files[1].path}`;
        const mimeType = mime.lookup(filePath);
        if (mimeType == "video/x-msvideo") {
          console.log(
            "Unsupported file format. Please upload only .mp4 files."
          );
          return res.status(error?.http_code || 400).json({
            success: false,
            message: `Unsupported file format.Please upload only .mp4 files.`,
          });
          // return;
        }
        // console.log("This is before")
        const mediaDetails = await chunkLinkProvider(
          req,
          res,
          chunkNumber,
          totalChunks,
          originalname
        );
        // console.log("This is after")

        if (mediaDetails?.outcome === 1) {
          return res.status(200).json({
            success: true,
            message: `chunk uploaded succesfully`,
          });
        }

        // console.log("this is the req file", req?.files[1])

        // console.log("This is duratiion");
        videoData.videoGoogleCloudDetails = [
          {
            duration: videoData?.videoDuration,
          },
        ];
        videoData.videoLink = mediaDetails?.publicUrlForVideo;


        // console.log("File format is supported.");
      } catch (error) {
        // Handle the error related to Cloudinary
        console.log("Error occurred:", error);
        return res.status(error?.http_code || 400).json({
          success: false,
          message: error?.message || error,
        });
      }
    }

    //Thumbnail part
    if (chunkNumber === totalChunks - 1) {
      const thumbnail = await urlProvider(
        req?.files[0]?.buffer,
        originalThumbnailName
      );
      if (thumbnail?.error === 0) {
        return res.status(400).json({
          success: false,
          message: "Please try again!!",
        });
      }
      videoData.thumbnail = thumbnail?.publicUrl;

    }
    //Ends here
    const payload = new videoModel(videoData);
    await payload.save();
    // console.log("This is videoData", videoData);
    // console.log("This is payload", payload);
    // Return a success response
    const chunksFolderPath = path.join(__dirname, '../../configs/GoogleCloudConsoleProvider/ChunksVideoUrl/chunks');

    //to delete the chunk folder 
    fs.rm(chunksFolderPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error deleting Chunk Folder:", err);
      } else {
        console.log("Chunk Folder Deleted!");
      }
    });
    let decipheredData = CryptoJS.AES.encrypt(JSON.stringify(payload), process.env.CRYPTO_SECRET_KEY).toString();

    return res.status(201).json({
      success: true,
      data: decipheredData,
      message: customChalk.red("Video Uploaded Successfully"),
    });
  } catch (error) {
    // Handle any errors that occur during the video upload process
    console.log("Inside catch");
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};

// Controller to delete a video by ID
export const deleteVideo = async (req, res) => {
  try {
    // Extracting the video ID from the request parameters
    const { id } = req?.params;

    // Find and remove the video by ID from the database
    const data = await videoModel.findByIdAndDelete({ _id: id });

    // Delete the video from Cloudinary using its public_id
    // await videoDestroyer(data?.videoCloudinaryDetails[0]?.public_id);

    // Return a success response
    return res.status(202).json({
      success: true,
      data,
      message: customChalk.red("Video Deleted Successfully"),
    });
  } catch (error) {
    // Handle any errors that occur during the video deletion process
    console.log("Inside catch");
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};
