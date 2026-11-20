# Microcommerce – Product REST API

**Domains:** Software

Spring Boot REST service that manages a product catalogue. Built while learning microservices with Spring Boot.

## Features
- CRUD endpoints on `/Produits`, plus a query endpoint that filters products by price.
- Bean Validation on input and a custom 404 exception when a product is missing.
- Spring Data JPA with an in-memory H2 database initialised from `schema.sql` and `data.sql`.
- OpenAPI documentation with springdoc and Swagger UI.

## Stack
Java · Spring Boot · Spring Data JPA · H2 · Bean Validation · springdoc-openapi · Maven

## Run locally
```bash
./mvnw spring-boot:run
# Swagger UI: http://localhost:8080/swagger-ui.html
```
