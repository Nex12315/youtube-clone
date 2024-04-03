// 1. GCS file interactins
// 2. Local file interactions

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "nex-yt-raw-videos";
const processedVideoBucketName = "nex-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates the local directories for raw and processed videos.
 */
export function setupDirectories() {}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-1:360") // 360p
      .on("end", () => {
        console.log("Video processing finished succesfully.");
        resolve();
      })
      .on("error", (err) => {
        console.log(`An error occured: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({ destination: `${localRawVideoPath}/${fileName}` });

  console.log(
    `gs://${rawVideoBucketName}/${fileName} has been downloaded to ${localRawVideoPath}/${fileName}.`
  );
}

/**
 * @param fileName - The name of the file to upload from the
 * {@link localProcessedVideoPath} folder into {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });

  console.log(
    `${localProcessedVideoPath}/${fileName} has been uploaded to gs://${processedVideoBucketName}/${fileName}.`
  );

  await bucket.file(fileName).makePublic();
}
