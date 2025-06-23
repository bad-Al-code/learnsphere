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
