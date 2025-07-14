# LearnSphere

A Polyglot Microservice E-Learning Platform

LearnSpehere is a feature-rich, full-stack e-learning platform designed to showcase a moden, scalable, and resilient system architecture. It is build from the ground up using polyglot programming, cloud-native principles, Infrastructure as Code, and integrated AI features.

This projects serves as a comprehensive portfolio piece demonstrating expertise across backend development, DevOps, frontend, and cloud engineering.

## Key Features

- **Decoupled Auth & User Management**: Secure, JWT-based authenticatin handled by a dedicated service, seperated from user profile management.
- **Couse & Enrollment System**: Robust APIs for creating coursed, managing lessons, and enrolling students.
- **Asynchronous Video Processing Pipeline**: A complete, event-driven pipeline for uploading, transcoding videos into HLS adaptive bitrate streams. and preparing them for delivery.
- **AI-Powered Q&A Assistant**: An intelligent assistant (built with LangChain) that students can ask question about course content.
- **AI-Generated Content**: Automated generation of video titles and descriptions from video transcripts using LLM.
- **Event-Driven Notifications**: Resilient, asynchronous user notifications using a message broker (RabbitMQ).
- **Cloud-Native & Automated**: Fully containerized and orchestrated with Kubernetes, with IaC (Terraform) and deployed via an automated CI/CD pipeline (GitHub Actions).

## Tech Stack

| **Category**                | Technology                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| **Backend Services**        | Node.js, TypeScript, Go, Python , Express.js                                                 |
| **Databases & Caching**     | PostgreSQL (Relational Data), Redis (Caching, Token Blacklist), RabbitMQ (Message Queue)     |
| **AI & Machine Learning**   | Python, LangChain, OpenAI/LLMs, Pinecone/Chroma (Vector DB), FFmpeg (Video/Audio)            |
| **DevOps & Infrastructure** | Git, Docker, Kubernetes (Kind for local, EKS for prod), Helm, Terraform, GitHub Actions, AWS |
| **Frontend (Planned)**      | React, TypeScript, tRPC, React Query, Tailwind CSS, video.js                                 |

## Project Structure (Monorepo)

```
learnsphere/
├── .github/workflows/         # CI/CD Pipelines (GitHub Actions)
├── kubernetes/                # Global K8s resources (e.g., ingress-nginx, cert-manager)
├── services/
│   ├── api-gateway/           # Go (Not Decided Yet)
│   ├── auth-service/          # Node.js + TypeScript
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── helm-chart/
│   ├── course-service/        # Node.js + TypeScript
│   ├── enrollment-service/    # Node.js + TypeScript
│   ├── notification-service/  # Node.js + TypeScript
│   ├── user-service/          # Node.js + TypeScript
│   ├── video-processing-service/ # Node.js + TypeScript
│   └── ai-qna-service/        # Python + LangChain
├── terraform/                 # AWS Infrastructure as Code
│   ├── modules/
│   └── environments/
│       └── production/
└── README.md
```

## Development Roadmap

1. **Phase1: The Foundation**: Set up the local development using WSL2, Docker and a multi-node kind kuberenetes cluster.
2. **Phase 2: The Authentication & User Core**: Build the decoupled `auth-service` and `user-service` integrated with Postgres, Redis, and RabbitMQ.
3. **Phase 3: The Business Logic**: Develop the `course-service` and `enrollment-service` to handle the core e-learning functionality.
4. **Phase 4: The Media Pipeline**: Implement the `video-processing-service` for asynchronouse HLS transcoding.
5. **Phase 4: The AI superpower**: Buidl tje `ai-qna-service` for semantic search and AI-driven content generation.
6. **Phase 6: The Grand Finale**: Provide production infrastructure on AWS with terraform and build a full CI/CD pipeline with GitHub Actions.
7. **Phase 7: The Frontend**: Develop the user-facing React application.
