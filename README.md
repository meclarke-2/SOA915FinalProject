# Vendor & Product Microservices

A distributed microservices application with Vendor and Product services, Docker containerization, Kubernetes deployment, and CI/CD pipeline.

## Architecture

```
┌──────────────┐      ┌──────────────┐
│ vendor-svc   │      │product-svc   │
│   (3001)     │      │   (3002)     │
└──────┬───────┘      └──────┬───────┘
       │                    │
       ▼                    ▼
┌──────────────┐      ┌──────────────┐
│  vendor-db   │      │ product-db   │
│  (MongoDB)   │      │  (MongoDB)   │
└──────────────┘      └──────────────┘
```

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 20+
- Kubernetes (optional, for K8s deployment)

### Run with Docker Compose

```bash
docker compose up --build
```

### Test the APIs

```bash
# Health checks
curl http://localhost:3001/health
curl http://localhost:3002/health

# Create vendor
curl -X POST http://localhost:3001/api/vendors \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","email":"acme@test.com"}'

# Create product (requires vendor ID)
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","price":29.99,"category":"Electronics","vendorId":"<vendor-id>"}'
```

## Project Structure

```
├── vendor-svc/          # Vendor microservice
│   ├── server.js       # Express API
│   ├── Dockerfile      # Container image
│   └── tests/          # Unit tests
├── product-svc/        # Product microservice
│   ├── server.js       # Express API
│   ├── Dockerfile      # Container image
│   └── tests/          # Unit & integration tests
├── k8s/                # Kubernetes configurations
│   ├── namespace.yaml
│   ├── mongodb.yaml
│   ├── vendor-svc.yaml
│   ├── product-svc.yaml
│   └── *.yaml          # HPA, services, monitoring
├── tests/              # E2E tests
├── docker-compose.yml  # Local development
├── loki-config.yml    # Logging config
└── SPEC.md           # Project specification
```

## API Endpoints

### Vendor Service (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/vendors | List all vendors |
| POST | /api/vendors | Create vendor |
| GET | /api/vendors/:id | Get vendor by ID |
| PUT | /api/vendors/:id | Update vendor |
| DELETE | /api/vendors/:id | Delete vendor |

### Product Service (Port 3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/products | List all products |
| POST | /api/products | Create product |
| GET | /api/products/:id | Get product by ID |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/products/vendor/:vendorId | Get by vendor |
| GET | /api/products/category/:category | Filter by category |

## Kubernetes Deployment

### Prerequisites
- Minikube, Kind, or Docker Desktop with Kubernetes enabled

### Deploy

```bash
# Apply all K8s configurations
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/vendor-svc.yaml
kubectl apply -f k8s/product-svc.yaml

# Or use the deployment script
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

### Features
- Namespace isolation
- ConfigMaps for environment variables
- Health probes (liveness/readiness)
- Horizontal Pod Autoscaler (HPA)
- Persistent volumes for MongoDB

## Monitoring

### Loki (Logging)
- Port: 3100
- Config: `loki-config.yml`

### Prometheus (Metrics)
- Config: `k8s/prometheus.yaml`

### Grafana (Dashboards)
- Port: 3003
- Default credentials: admin/admin

## CI/CD

GitHub Actions workflow runs on every push to main:
- Lints code
- Builds Docker images

View pipeline: `.github/workflows/ci.yml`

## Testing

### Run Tests

```bash
# Vendor service tests
cd vendor-svc
npm install
npm test

# Product service tests
cd product-svc
npm install
npm test
```

### Test Types
- Unit tests: `vendor-svc/tests/`, `product-svc/tests/`
- Integration tests: `product-svc/tests/integration.test.js`
- E2E tests: `tests/e2e.test.js`

## Contributors

| Part | Contributor |
|------|--------------|
| Part 1 - Microservices | meclarke-2 |
| Part 2 - Kubernetes | anreid3 |
| Part 3 - Testing/CI/CD | anreid3 |

## License

MIT
