FROM quay.io/apibara/sink-postgres:latest

WORKDIR /app

COPY src/ .