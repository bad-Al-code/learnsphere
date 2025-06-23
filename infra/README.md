# LearnSphere Infrastructur Setup

This document outlines the steps to set up the local development environment using Kind and Kuberenetes.

## 1. Create the Kind Cluster

From the project, run:

```bash
kind create cluster --name learnsphere-dev --config ./infra/k8s/kind-cluster-config.yaml
```

## 2. Install NGINX Ingress Controller

This controller is required to manage external access to the servces in the cluster.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.3/deploy/static/provider/cloud/deploy.yaml
```

Wait for the controller pod to be in a 'Running' state before proceeding:

```bash
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

## 3. Create Application Secrets

Before deploying the applications, you must create the necessary Kubernetes secrets manually for the local environment.

**Generate strong random values for your secrets:**

```bash
openssl rand -base64 32
```

**Create the auth-secret**

```bash
kubectl create secret generic auth-secrets \
  --namespace learnsphere-apps \
  --from-literal=JWT_SECRET='PASTE_YOUR_GENERATED_VALUE_HERE' \
  --from-literal=JWT_REFRESH_SECRET='PASTE_YOUR_GENERATED_VALUE_HERE' \
  --from-literal=COOKIE_PARSER_SECRET='PASTE_YOUR_GENERATED_VALUE_HERE'
```
