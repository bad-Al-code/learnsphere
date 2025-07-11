# LearnSphere - Notification Service

This service is a dedicated background worker responsible for handling all outgoing notifiations for the LearnSphere platform. Its primary role is to listen for events from other microsrvices via a message broker (RabbitMQ) and send transactional emails to users.

This service has no public-facing API. Its sole purpose is to consume events and interact with an email delivery services.

## Features

- **Event-Driven Architecture**: Listens to RabbitMQ for events like `user.verification.required` and `user.password_reset.required`.
- **Transactional Emails**: Sends critical emails for user account actions.
- **Modern HTML Templates**: Uses clean, professional, and responsive HTML templates for all outgoing emails.
- **Decoupled & Resilient**: Built with Dependency Injection and a client-based architecture, making it modular and testable. Fails gracefully without crashing the listener process.
- **Comprehensive Unit Tests**: A full suite of unit tests using Vitest to ensure reliability.
- **Code Quality**: Enforced by ESLint and Prettier.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started/) and Docker Compose

---

## Getting Started

### 1. Set Up Environment Variables

Navigate to the `services/notification-service` directory.

Create a `.env` file from the sample:

```bash
cp .env.example .env
```

Open the `.env` file and fill in all the `EMAIL_*` variables with the SMTP credentials from your chosen provider.

### 2. Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 3. Start Dependent Services

This service requires a RabbitMQ instance to listen for events. A `docker-compose.yaml` file is provided.

```bash
docker compose up -d
```

---

## Available Scripts

### 1. Running the Application

To start the service in development mode with live reloading (via nodemon):

```bash
pnpm dev
```

The service will start and immediately brgin polling RabbitMQ for messages. There is no API to visit.

### 2. Running Tests

- **Run all unit tests**:

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

### 3. Code Quality Scripts

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
