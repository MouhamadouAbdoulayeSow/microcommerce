# Microcommerce – Spring Boot API and Vue.js front-end

**Domains:** Software

Full-stack product catalogue: a Spring Boot REST API and a Vue.js 3 front-end that consumes it.

## Features

### API, Spring Boot
- CRUD endpoints on `/Produits`, plus a query endpoint that filters products above a price.
- Bean Validation on input; errors are returned as JSON with one message per field and a 400 status.
- 404 with a JSON message when a product is missing, on read, update and delete.
- Spring Data JPA with an in-memory H2 database initialised from `schema.sql` and `data.sql`.
- CORS configured for the front-end origin through `CORS_ALLOWED_ORIGINS`.
- OpenAPI documentation with springdoc and Swagger UI.
- Controller tests with `@WebMvcTest`, MockMvc and Mockito.

### Front-end, Vue.js 3
- Product list with search by name, server-side filter by minimum price and margin per product.
- Create and edit form with client-side validation and display of the API's field errors.
- Delete with in-page confirmation.
- Composition API, a `useProducts` composable and a small API client built on `fetch`.
- Responsive layout: the table turns into cards on mobile.
- Unit tests with Vitest and Vue Test Utils.

## Stack
Java 17 · Spring Boot · Spring Data JPA · H2 · Bean Validation · springdoc-openapi · Maven · JUnit 5 · Mockito ·
Vue.js 3 · Vite · JavaScript · HTML5 · CSS3 · Vitest

## Run locally

API, on port 9090:
```bash
./mvnw spring-boot:run
# Swagger UI: http://localhost:9090/swagger-ui.html
```

Front-end, on port 5173, in another terminal:
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```
In development, Vite proxies `/api` to the API, so no extra setup is needed.
To point the front-end at another API, set `VITE_API_URL` in `frontend/.env.local` and add the front-end origin to `CORS_ALLOWED_ORIGINS` on the API.

## Tests
```bash
./mvnw test              # API: 7 tests
cd frontend && npm test  # front-end: 8 tests
```

## Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/Produits` | List all products |
| GET | `/Produits/{id}` | Get one product, 404 if missing |
| GET | `/Produits/cher/{prixLimit}` | Products with a price above `prixLimit` |
| POST | `/Produits` | Create a product, 201 with `Location` |
| PUT | `/Produits` | Update a product, 404 if missing |
| DELETE | `/Produits/{id}` | Delete a product, 204, or 404 if missing |
