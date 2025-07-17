# LearnSphere - Enrollment Service

This service manages the relationship between users and courses.
It is responsible for enrolling students in courses, tracking their progress, and handling administrative actions related to enrollments like suspensions and reinstatements.

## Features

- **Course Enrollment**: Allows students to enroll in published courses.
- **Prerequisite Checks**: Enforces course prerequisites, ensuring a user has completed a required course before enrolling in the next one.
- **Progress Tracking**: Logs which lessons a student has completed and calculates an overall course completion percentage.
- **Administrative Controls**: Provides endpoints for instructors and admins to manually enroll users, suspend, or reinstate an enrollment.
- **Event-Driven**: Publishes events for key actions like `user.enrolled`, `student.progress.updated`, and `student.course.completed`.
- **Inter-Service Communication**: Communicates with the `course-service` to validate course details and with the `user-service` to enrich enrollment data.
- **Performance Caching**: Uses Redis to cache user enrollment lists.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started/) and Docker Compose

---

## Getting Started

### 1. Clone the Repository

Clone the main LearnSphere project repository. This service is located in `services/enrollment-service`.

### 2. Set Up Environment Variables

Navigate to the `services/enrollment-service` directory.

Create a `.env` file by copying the sample file:

```bash
cp .env.example .env
```

Open the `.env` file. You must:

- Provide the correct URLs for the `COURSE_SERVICE_URL` and `USER_SERVICE_URL`.
- Ensure that `JWT_SECRET` and `COOKIE_PARSER_SECRET` are identical to the ones used in the `auth-service`.

### 3. Start Dependent Services

This service requires a PostgreSQL database, Redis, and RabbitMQ. A `docker-compose.yaml` file is provided.

```bash
docker compose up -d
```

This will start the required containers in the background.

_Note: Ensure the course-service and user-service are also running for full functionality._

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

The service will be available at `http://localhost:8004`

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

Once the server is running, interactive API documentation is avaiable at: `http://localhost:8004/api-docs`
