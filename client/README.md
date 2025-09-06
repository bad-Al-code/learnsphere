# LearnSphere - Client Application

Welcome to the official frontend for the LearnSphere e-learning platform. This application is built with the Next.js App Router and serves as the primary user interface for students and instructors, communicating directly with our backend microservices.

## Features

- **User Authentication:** Secure sign-up, login, and session management.
- **Course Discovery:** Publicly view and browse available courses.
- **Student Dashboard:** (Coming Soon) View enrolled courses and track progress.
- **Course Management:** (Coming Soon) Instructors can create and manage their courses.
- **Modern UI:** Built with Tailwind CSS and shadcn/ui for a beautiful and responsive experience.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15 (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (for client-side session state)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (for validation)
- **Package Manager:** [pnpm](https://pnpm.io/)

## Project Structure

The project follows a feature-oriented structure within the `src` directory.

```bash
/src
├── app/
│ ├── (auth)/
│ ├── api/
│ └── layout.tsx
├── components/
│ ├── layout/
│ └── ui/
├── lib/
│ ├── api.ts
│ └── utils.ts
└── stores/
└── session-store.ts
```

## Getting Started

Follow these instructions to get the client application running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/products/docker-desktop/) (for running backend microservices)

### 1. Installation

Navigate to the `client` directory and install the dependencies:

```bash
cd client
pnpm install
```

2. ### Environment Variables

This application requires environment variables to connect to the backend microservices.

- Create a new file named `.env.local` in the root of the client directory.
- Copy the contents from `.env.local.example` (see below) into your new file.
- Update the URLs if your services are running on different ports.

`.env.local.example`

```sh
AUTH_SERVICE_URL="http://auth-service:8000"
USER_SERVICE_URL="http://user-service:8001"
MEDIA_SERVICE_URL="http://media-service:8002"
COURSE_SERVICE_URL="http://course-service:8003"
ENROLLMENT_SERVICE_URL="http://enrollment-service:8004"
NOTIFICATION_SERVICE_URL="http://notification-service:8006"

# If running services locally without Docker, use localhost:
# AUTH_SERVICE_URL="http://localhost:8000"
# USER_SERVICE_URL="http://localhost:8001"
# ...and so on
```

3. ### Running the Backend Services

Before starting the client, ensure all backend microservices are running. The easiest way is to use the main Docker Compose file from the project root.

```bash
docker compose up -d
```

4. ### Running the Development Server

Once the backend is running, start the Next.js development server:

```bash
pnpm dev
```

Open `http://localhost:3000` with your browser to see the result.

## Architectural Decisions

- **Server-First Approach**: We primarily use React Server Components (RSC) for data fetching and rendering static content. This improves performance and reduces the amount of JavaScript sent to the client.
- **Server Actions for Mutations**: Instead of creating API handlers in Next.js, we use Server Actions for all form submissions and mutations (e.g., login, signup). This keeps server-side logic co-located with the components that use them and simplifies the architecture.
- **Direct Microservice Communication**: The Next.js server acts as a Backend-For-Frontend (BFF). The `src/lib/api.ts` client is the central point for this communication. It securely calls microservices from the server and is responsible for forwarding authentication cookies.
- **Minimal Client-Side State**: We use Zustand for minimal, essential global state. Its primary role is to hold the user's session data after the initial server render, making it available to all client components for dynamic UI updates (e.g., showing a "Logout" button).

## Available Scripts

In the project directory, you can run:

- `pnpm dev`: Runs the app in development mode.
- `pnpm build`: Builds the app for production.
- `pnpm start`: Starts a production server.
- `pnpm lint`: Runs ESLint to find and fix problems in the code.
