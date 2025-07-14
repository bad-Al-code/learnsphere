# LearnSphere - Course Service

This service is the core domain service for the LearnSphere platform, responsible for all logic related to creating, managing, and retrieving courses, modules, and lessons.

It acts as an orchestrator, handling requests from clients, managing its own data, and communicating with other services like the `user-service` (to fetch instructor profiles) and the `media-service` (to facilitate video uploads). It also listens for events from the `media-service` to update lesson content upon successful video processing.

## Features

- **Hierarchical Content Structure**: Manages a three-level hierarchy of Courses -> Modules -> Lessons.
- **Full CRUD Operations**: Provides complete Create, Read, Update, and Delete operations for all three entities.
- **Role-Based Authorization**: Endpoints are protected, ensuring only an `instructor` or `admin` can create or modify course content.
- **Drag-and-Drop Reordering**: Endpoints to handle reordering of modules within a course and lessons within a module.
- **Publishing Workflow**: Courses can exist in a `draft` or `published` state, allowing instructors to build their content privately before making it public.
- **Inter-Service Communication**: Makes synchronous API calls to other services to enrich its data (e.g., getting instructor profiles).
- **Event-Driven Updates**: Listens to RabbitMQ for events (e.g., `video.processed`) to asynchronously update its data.
- **Performance Caching**: Implements a Redis caching layer for expensive queries like fetching full course details and paginated lists.
- **API Documentation**: A complete and interactive API documentation is available via Swagger/OpenAPI.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started/) and Docker Compose

---

## Getting Started

### 1. Clone the Repository

Clone the main LearnSphere project repository. This service is located in `services/course-service`.

### 2. Set Up Environment Variables

Navigate to the `services/course-service` directory.

Create a `.env` file by copying the sample file:

```bash
cp .env.example .env
```

Open the `.env` file. You must:

- Provide the correct URLs for the `USER_SERVICE_URL` and `MEDIA_SERVICE_URL`.
- Ensure that `JWT_SECRET` and `COOKIE_PARSER_SECRET` are identical to the ones used in the `auth-service`.

### 3. Start Dependent Services

This service requires a PostgreSQL database, Redis, and RabbitMQ. A `docker-compose.yaml` file is provided.

```bash
docker compose up -d
```

This will start the required containers in the background.

_Note: Ensure the auth-service and user-service are also running for full functionality._

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run Database Migrations

Before starting the application for the first time, you need to apply the database schema.

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

The service will be available at `http://localhost:8003`

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

- **Run End-to-End (E2E) tests**:

1. Start the server: `pnpm dev`
2. In a seperate terminal, run: `pnpm test -- tests/e2e/

### 3. Database Scripts

- **Generate a new migration file after schema changes**:

```bash
pnpm db:generate
```

- **Apply pending migration to the database**:

```bash
pnpm db:migrate
```

- **Open Drizzle studio to view/edit your database**:

```bash
pnpm db:studio
```

## 4. Code Quality Scripts

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

Once the server is running, interactive API documentation is avaiable at: `http://localhost:8003/api-docs`
