# Video Transcoder

This project provides a system to upload and process videos using AWS services like S3, SQS, and ECS. Below is an overview of the system and how it works.

![diagram-export-19-10-2024-12_17_04-am](https://github.com/user-attachments/assets/a292e235-af9a-4b8e-ac83-4dca7bed2fcd)

## System Overview

The system consists of several key components that work together to allow clients to upload videos for processing. The uploaded videos are processed using AWS Elastic Container Service (ECS), and the resulting videos are stored in an S3 bucket.

### Components:

1. **Client**: 
   - Initiates the video upload process.
   - Uploads the video file to AWS S3 using a pre-signed URL.

2. **Database (DB) [convex](https://convex.dev)**:
   - Stores tasks created by the client for tracking the video processing workflow.
   - Maintains the status of each task and updates it when video processing is complete.
   - Stores the key (file path) of the processed video once it has been uploaded to S3.

3. **AWS S3**: 
   - Storage service where the original and processed video files are stored.
   - A pre-signed URL is generated for the client to upload their video directly to the S3 bucket.

4. **AWS SQS (Simple Queue Service)**:
   - Acts as a queue for video processing tasks.
   - When a video is uploaded, the system adds the video metadata to the queue, where it awaits processing.

5. **Consumer**:
   - Listens for new video processing tasks from the SQS queue.
   - Validates the video and its metadata, then triggers an AWS ECS container to handle the processing.

6. **AWS ECS (Elastic Container Service)**:
   - Runs the video processing in a containerized environment.
   - Downloads the video from S3, processes it using `fluent-ffmpeg`, and uploads the processed video back to S3.

### Workflow:

1. **Task Creation & Pre-Signed URL Generation**:
   - The client sends a request to create a task in the database.
   - The server generates a pre-signed URL for the client to upload the video to S3.

2. **Video Upload**:
   - The client uploads the video to S3 using the pre-signed URL.

3. **Add Video to Queue**:
   - Once the video is uploaded, the system adds the video metadata to the SQS queue for processing.

4. **Processing**:
   - The consumer picks the video from the SQS queue, validates it, and starts an ECS container with the video’s metadata.
   - The ECS container downloads the video from S3, processes it using `fluent-ffmpeg`, and uploads the processed video back to S3.

5. **Completion & Status Update**:
   - Once processing is complete, the task status is updated in the database, and the key (file path) of the processed video is saved for future retrieval.

