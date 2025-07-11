# LearnSphere - Media Service

This service is specialized component of the LearnSphere platform responsible for handling all media processing. It operates in two modes:

1. **API Server**: Expose a single HTTP endpoint to generate secure, presigned URLs for direct client-side uploads to an S3 bucket.
2. **Background Worker**: Polls an AWS SQS queue for notification about new file uploads. Based on metadata, it process these files (e.g., transcoding videos, resizing images) and published events upon completion.

## Features

- **Presigned URLs**: Securely allows clients to upload large files directly to S3 without routing them through the server.
- **Asynchronous Processing**: Uses an SQS queue to decouple file uploads from processing, ensuring the API remains fast and responsive.
- **Modular Processors**: A worker architecture that can handle differnet file types (avatars, videos ) with dedicated processors.
- **Video Transcoding**: Converts uploaded videos into multiple bitrate HLS (HTTP Live Streaming) format using `ffmpeg`.
- **Image Resizing**: Processes uploaded videos into multiple standard sizes using `sharp`.
- **Event-Driven**: Published events to RabbitMQ (e.g., `user.avatar.processed`) to notify other services when media is ready.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started/) and Docker Compose
- **FFmpeg**: Must be installed on the machine running the service. The provided `Dockerfile` handles this automatically for containerized deployment.
- **AWS Account & Credentials**: This service requires an AWS account with an S3 bucket for raw uploads, another for processed media, and an SQS queue.

---

## Getting Started

### 1. Set Up AWS Resources

Before running the service, you must manually create the following resources in your AWS account:

1.  **Two S3 Buckets**: One for raw uploads and one for processed media.
2.  **An SQS Queue**: This queue will receive S3 event notifications.
3.  **Configure S3 Event Notifications**: In the properties of your raw uploads S3 bucket, set up an event notification to send a message to your SQS queue for all `s3:ObjectCreated:*` events.
4.  **IAM Credentials**: Create an IAM user with programmatic access and permissions to read/write to the S3 buckets and read/delete messages from the SQS queue.

### 2. Set Up Environment Variables

Navigate to the `services/media-service` directory.

Create a `.env` file from the sample:

```bash
cp .env.example .env
```

Open the .env file and fill in all the AWS\_\* variables with the credentials and resource names you created in the previous step.

### 3. Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 4. Start Dependent Services

This service requires a RabbitMQ for publishing events and a PostgreSQL database for tracking media assets. A `docker-compose.yaml` file is provided.

```bash
docker compose up -d
```

### 5. Run Database Migrations

Before starting the application, you must apply the database schema for the media assets tables.

```bash
pnpm db
```

---

## Available Scripts

### 1. Running the Application

To start the service in development mode with live reloading (via nodemon):

```bash
pnpm dev
```

The API will be available at `http://localhost:8002`. The worker will start polling the SQS queue.

### 2. Running Tests

- **Run all tests (unit and integration)**:

```bash
pnpm test
```

- **Run tests with an interactive UI**:

```bash
pnpm test:ui
```

- **Run tests and generate a coverage report**:

```bash
pnpm test:coverage
```

### 3. Database Scripts

- **Generate a new migration after schema changes**:

```bash
pnpm db:generate
```

- **Apply pending migrations to the database**:

```bash
pnpm db:migrate
```

- **Open Drizzle Studio to view/edit your database**:

```bash
pnpm db:studio
```

### 4. Code Quality Scripts

- **Check for linting errors**:

```bash
pnpm lint
```

- **Automatically fix fixable linitng errors**:

```bash
pnpm lint:fix
```

- **Format all code with Prettier**:

```bash
pnpm format
```

---

## API Docuemntation

Once the server is running, interactive API documentation is avaiable at: `http://localhost:8002/api-docs`
