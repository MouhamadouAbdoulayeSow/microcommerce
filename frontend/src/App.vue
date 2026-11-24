<script setup>
import { onMounted, ref } from "vue";
import ProductForm from "./components/ProductForm.vue";
import ProductTable from "./components/ProductTable.vue";
import { useProducts } from "./composables/useProducts";

const { filtered, stats, loading, error, search, minPrice, load, save, remove } = useProducts();
const editing = ref(null);
const notice = ref("");

async function onRemove(id) {
  try {
    await remove(id);
    notice.value = "Produit supprimé.";
  } catch (e) {
    error.value = e.message;
  }
}

function onSaved() {
  notice.value = editing.value ? "Produit modifié." : "Produit ajouté.";
  editing.value = null;
}

onMounted(load);
</script>

<template>
  <header class="topbar">
    <div class="container">
      <h1>Microcommerce</h1>
      <p>Catalogue produits · Vue.js 3 et API REST Spring Boot</p>
    </div>
  </header>

  <main class="container layout">
    <section>
      <div class="toolbar card">
        <label>
          Rechercher
          <input v-model="search" type="search" placeholder="Nom du produit" />
        </label>
        <label>
          Prix supérieur à
          <input v-model.number="minPrice" type="number" min="0" placeholder="0" @change="load" />
        </label>
        <div class="stats">
          <span><b>{{ stats.count }}</b> produits</span>
          <span><b>{{ stats.margin.toLocaleString("fr-FR") }}</b> de marge totale</span>
        </div>
      </div>

      <p v-if="notice" class="notice" role="status" @click="notice = ''">{{ notice }}</p>
      <p v-if="error" class="alert" role="alert">{{ error }}</p>
      <p v-if="loading" class="empty">Chargement…</p>
      <ProductTable v-else :products="filtered" @edit="editing = $event" @remove="onRemove" />
    </section>

    <aside>
      <ProductForm :product="editing" :submit="save" @done="onSaved" @cancel="editing = null" />
    </aside>
  </main>
</template>
