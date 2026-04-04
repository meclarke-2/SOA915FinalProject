# Project Specification: Vendor & Product Microservices

## 1. Project Overview

- **Project Name**: Vendor & Product Microservices
- **Project Type**: RESTful Microservices with Docker
- **Core Functionality**: Two independent microservices — Vendor Service and Product Service — each with its own MongoDB database, exposing RESTful APIs. Product Service validates vendor existence via Vendor Service.

## 2. Architecture

| Service     | Port | Database              | Description                |
|-------------|------|-----------------------|----------------------------|
| vendor-svc  | 3001 | MongoDB (vendor-db)   | Vendor CRUD                |
| product-svc | 3002 | MongoDB (product-db)  | Product CRUD, vendor check  |

## 3. Functionality

### Vendor Service

**Data Model**: name, email (unique), phone, address, description, rating (0-5)

**Endpoints**:
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| GET    | /health            | Health check        |
| POST   | /api/vendors       | Create vendor       |
| GET    | /api/vendors       | List all vendors    |
| GET    | /api/vendors/:id   | Get vendor by ID    |
| PUT    | /api/vendors/:id   | Update vendor       |
| DELETE | /api/vendors/:id   | Delete vendor       |

### Product Service

**Data Model**: name, description, price (>=0), category, vendorId, stock (>=0), imageUrl

**Endpoints**:
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /health                           | Health check             |
| POST   | /api/products                     | Create product           |
| GET    | /api/products                     | List all products        |
| GET    | /api/products/:id                  | Get product by ID        |
| PUT    | /api/products/:id                 | Update product           |
| DELETE | /api/products/:id                | Delete product           |
| GET    | /api/products/vendor/:vendorId   | Get by vendor            |
| GET    | /api/products/category/:category | Filter by category       |

## 4. Docker

- Each service: single-stage Alpine Dockerfile, non-root user
- Docker Compose: vendor-db, product-db, vendor-svc, product-svc on shared network

## 5. Acceptance Criteria

- [x] Both services start with `docker compose up`
- [x] All CRUD endpoints functional for Vendor service
- [x] All CRUD endpoints functional for Product service
- [x] Product service validates vendor existence
- [x] Each service uses isolated MongoDB database
