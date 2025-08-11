# LearnSphere - Payment Service

This service is a dedicated component of the LearnSphere platform responsible for handling all payment processing and financial transactions. It integrates with the Razorpay payment gateway to securely manage course purchases.

The service is designed to be highly reliable and decoupled, operating on events from other services to maintain its own data replicas and publishing events upon successful transactions.

## Features

- **Payment Gateway Integration**: Securely creates payment orders with Razorpay.
- **Webhook Verification**: Provides a secure webhook endpoint to receive and verify real-time payment status updates from Razorpay using HMAC-SHA256 signature validation.
- **Event-Driven Architecture**:
  - **Listens** for events from `course-service` and `user-service` to maintain a local, synchronized copy of course prices and user details. This eliminates the need for synchronous API calls during checkout, increasing reliability.
  - **Publishes** a `payment.successful` event to RabbitMQ after a payment is successfully verified, allowing other services (like `enrollment-service`) to react.
- **Transactional Database**: Records every payment attempt, tracking its status from `pending` to `completed` or `failed`.
- **API Documentation**: A complete and interactive API documentation is available via Swagger/OpenAPI.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/products/docker-desktop/)
- A **Razorpay Account** to get API keys.

---

## Getting Started

### 1. Set Up Razorpay Credentials

1.  Sign up for a [Razorpay account](https://razorpay.com/).
2.  Navigate to the **Settings -> API Keys** section and generate a new Key ID and Key Secret.
3.  Navigate to the **Settings -> Webhooks** section. Create a new webhook with the following details:
    - **Webhook URL**: You will need a publicly accessible URL. For local development, use a tool like [ngrok](https://ngrok.com/) (`ngrok http 8005`) and use the generated HTTPS URL (e.g., `https://xxxx-xxxx.ngrok.io/api/payments/webhook`).
    - **Secret**: Create a strong, secret string.
    - **Alert Email**: Your email address.
    - **Active Events**: Select `payment.captured` and `payment.failed`.

### 2. Environment Variables

Create a `.env` file in the root of this service by copying `.env.example`. Fill in the variables, especially:

- `DATABASE_URL` and `RABBITMQ_URL`.
- `JWT_SECRET` (must be identical to the one in `auth-service`).
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` from the previous step.

### 3. Install Dependencies & Run Migrations

```bash
# Install dependencies
pnpm install

# Start the PostgreSQL and RabbitMQ containers
docker-compose up -d

# Apply database migrations
pnpm db
```

### 4. Running the service

```bash
# Start the development server
pnpm dev
```

The API will be available at `http://localhost:8005`

## API Documentation

Once the server is running, interactive API documentation is available at: `http://localhost:8005/api-docs`
