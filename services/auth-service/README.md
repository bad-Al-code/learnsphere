# LearnSphere - Auth Service

This service is responsible for all authentication and user account management within the LearnSphere platform. It handles user registration, login, session management via secure cookies, password resets, email verification, and provides a comprehensive audit trail for security events.

## Features

- **User Authentication**: Secure signup and login with password hashing (bcrypt).
- **Session Management**: Use JWT (Json Web Tokens) stored in `httpOnly`, secure cookies.
- **Token Refresh**: Implement a refresh token mechanism for persistent sessions.
- **Account Management**: Full flows for email verification, password reset, and resending verification links.
- **Security**: Includes rate limiting on sensitive endpoints and a detailed audit log for all critical actions.
- **Role-Based Access Control (RBAC)**: Middleware to protect routes based on users roles (student, instructor, admin).
- **API Documentation**: Interactive API documentation available by Swagger/OpenAPI.
- **Comprehensive Testing**: Includes unit, integration, and E2E tests.
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

Clone the main LearnSphere project repository. This service is located in `services/auth-service`.

### 2. Set Up Environment Variables

Navigate to the `services/auth-service` directory.

Create a `.env` file by copying the sample file:

```bash
cp .env.sample .env
```

Review the `.env` file and generate new secret keys (`openssl rand -base64 32`) to create secure random strings for the `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `COOKIE_PARSER_SECRET` variables.

### 3. Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 4. Start Dependent Services

This service requires a PostgreSQL database, Redis, and RabbitMQ. A `docker-compose.yaml` file is provided.

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

The service will be available at `http://localhost:8000`

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

Once the server is running, interactive API documentation is avaiable at: `http://localhost:8000/api-docs`
