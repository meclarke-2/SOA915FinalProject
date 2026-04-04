# Part 2: Kubernetes Deployment

## Overview
This directory contains Kubernetes YAML files for deploying the Vendor & Product microservices to a local Kubernetes cluster.

## Files

| File | Description |
|------|-------------|
| `namespace.yaml` | Creates the `microservices` namespace |
| `mongodb.yaml` | MongoDB deployments for vendor and product databases |
| `vendor-svc.yaml` | Vendor service Deployment, Service, and ConfigMap |
| `product-svc.yaml` | Product service Deployment, Service, and ConfigMap |
| `services.yaml` | LoadBalancer services for external access |
| `vendor-svc-hpa.yaml` | Horizontal Pod Autoscaler for vendor service |
| `product-svc-hpa.yaml` | Horizontal Pod Autoscaler for product service |
| `deploy.sh` | Automated deployment script |

## Prerequisites

- Kubernetes cluster (Minikube, Kind, or Docker Desktop K8s)
- kubectl configured
- Docker images built and loaded into cluster
- Metrics server installed (`kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`)

## Quick Start

### 1. Build Docker Images

```bash
docker build -t vendor-svc:latest ./vendor-svc
docker build -t product-svc:latest ./product-svc
```

### 2. Load Images into Minikube (if using Minikube)

```bash
minikube image load vendor-svc:latest
minikube image load product-svc:latest
```

### 3. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

## Features

- **Namespace isolation** - All resources in `microservices` namespace
- **ConfigMaps** - Environment variables without hardcoding
- **Health probes** - Liveness and readiness checks
- **Resource limits** - CPU and memory constraints
- **Horizontal Pod Autoscaler (HPA)** - Auto-scales based on CPU/memory usage
- **Load balancing** - External access via LoadBalancer
- **Persistent volumes** - MongoDB data persistence

## HPA Configuration

Both services have HPA enabled:

| Setting | Value |
|---------|-------|
| Min Replicas | 2 |
| Max Replicas | 10 |
| CPU Target | 70% |
| Memory Target | 80% |

## Verify Deployment

```bash
# Check all resources
kubectl get all -n microservices

# Check HPA status
kubectl get hpa -n microservices
```

## Access Services

```bash
# Vendor service
kubectl port-forward -n microservices svc/vendor-svc-lb 3001:80

# Product service  
kubectl port-forward -n microservices svc/product-svc-lb 3002:80
```

## Clean Up

```bash
kubectl delete -f namespace.yaml
```
