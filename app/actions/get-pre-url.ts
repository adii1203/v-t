"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// generate pre-signed URL for uploading a file

export const getPresignedUrl = async (key: string) => {
  const command = new PutObjectCommand({
    Bucket: "temp-video-upload.aditya",
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 360 });

  return url;
};
