# LearnSphere - User Service

This service is responsible for all user profile management within the LearnSphere platform. It handles the creation, updating, retrieval, and searching of user profiles. It is designed to be the single source of truth for all non-authentication-related user data.

This service listens for events from the `auth-service` (e.g., `user.registered`) to automatically create a base profile when a new user signs up.

## Features

- **Profile Management**: Full CRUD (Create, Read, Update) operations for user profiles.
- **Event-Driven Architecture**: Listens to RabbitMQ events to stay in sync with the `auth-service`.
- **Public vs. Private Profiles**: Logic to return different profile details based on the requester's authentication status and role.
- **Bulk User Retrieval**: An endpoint to efficiently fetch multiple user profiles at once.
- **Search Functionality**: Paginated search for user profiles by name.
- **Admin Capabilities**: Protected endpoints for administrators to manage any user's profile.
- **API Documentation**: Interactive API documentation available via Swagger/OpenAPI.
- **Comprehensive Testing**: Includes unit and integration tests.
- **Code Quality**: Enforced by ESLint for error checking and Prettier for consistent formatting.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started/) and Docker Compose

---

## Getting Started

### 1. Clone the Repository

This service is part of the main `learnsphere` monorepo. Clone the root project repository and navigate into this service's directory:

```bash
cd services/user-service
```

### 2. Set Up Environment Variables

Create a `.env` file by copying the sample file:

```bash
cp .env.sample .env
```

Open the .env file and ensure the variables are correct for your local setup. Crucially, JWT_SECRET and COOKIE_PARSER_SECRET must be identical to the ones used in the auth-service for token validation to work.

### 3. Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 4. Start Dependent Services

This service requires a PostgreSQL database and RabbitMQ. A `docker-compose.yaml` file is provided.

```bash
docker compose up -d
```

This will start the required containers in the background.

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

The service will be available at `http://localhost:8001`

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

Once the server is running, interactive API documentation is avaiable at: `http://localhost:8001/api-docs`
