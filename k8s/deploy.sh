#!/bin/bash

echo "Deploying microservices to Kubernetes..."

kubectl apply -f namespace.yaml
echo "Namespace created"

kubectl apply -f mongodb.yaml
echo "MongoDB deployed"

kubectl apply -f vendor-svc.yaml
echo "Vendor service deployed"

kubectl apply -f product-svc.yaml
echo "Product service deployed"

kubectl apply -f services.yaml
echo "Load balancers deployed"

kubectl apply -f vendor-svc-hpa.yaml
echo "Vendor service HPA deployed"

kubectl apply -f product-svc-hpa.yaml
echo "Product service HPA deployed"

echo ""
echo "Checking deployment status..."
kubectl get all -n microservices
kubectl get hpa -n microservices

echo ""
echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=vendor-svc -n microservices --timeout=60s
kubectl wait --for=condition=ready pod -l app=product-svc -n microservices --timeout=60s

echo ""
echo "Deployment complete!"
echo ""
echo "Access services:"
echo "  kubectl port-forward -n microservices svc/vendor-svc-lb 3001:80"
echo "  kubectl port-forward -n microservices svc/product-svc-lb 3002:80"
echo ""
echo "Check HPA status:"
echo "  kubectl get hpa -n microservices"
echo "  kubectl describe hpa -n microservices"
