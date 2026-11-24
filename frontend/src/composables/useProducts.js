import { computed, ref } from "vue";
import { productApi } from "../api/products";

// State and actions for the product catalogue.
export function useProducts(api = productApi) {
  const products = ref([]);
  const loading = ref(false);
  const error = ref("");
  const search = ref("");
  const minPrice = ref(null);

  const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();
    return term ? products.value.filter((p) => p.nom.toLowerCase().includes(term)) : products.value;
  });

  const stats = computed(() => {
    const list = filtered.value;
    const margin = list.reduce((sum, p) => sum + (p.prix - p.prixAchat), 0);
    return { count: list.length, margin };
  });

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      products.value = minPrice.value ? await api.listAbove(minPrice.value) : await api.list();
    } catch (e) {
      error.value = `Impossible de charger les produits : ${e.message}`;
    } finally {
      loading.value = false;
    }
  }

  async function save(product) {
    if (product.id) await api.update(product);
    else await api.create(product);
    await load();
  }

  async function remove(id) {
    await api.remove(id);
    await load();
  }

  return { products, filtered, stats, loading, error, search, minPrice, load, save, remove };
}
