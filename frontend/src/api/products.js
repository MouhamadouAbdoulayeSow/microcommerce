// Thin client for the Spring Boot product API.
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.message || `Erreur ${response.status}`, response.status, body.errors);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const productApi = {
  list: () => request("/Produits"),
  listAbove: (prixLimit) => request(`/Produits/cher/${prixLimit}`),
  create: (product) => request("/Produits", { method: "POST", body: JSON.stringify(product) }),
  update: (product) => request("/Produits", { method: "PUT", body: JSON.stringify(product) }),
  remove: (id) => request(`/Produits/${id}`, { method: "DELETE" }),
};
