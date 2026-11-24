<script setup>
import { ref } from "vue";

defineProps({ products: { type: Array, required: true } });
const emit = defineEmits(["edit", "remove"]);

const pendingDelete = ref(null);
const money = (value) => value.toLocaleString("fr-FR");
</script>

<template>
  <div class="card">
    <p v-if="products.length === 0" class="empty">Aucun produit ne correspond à la recherche.</p>
    <table v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>Nom</th>
          <th class="num">Prix</th>
          <th class="num">Prix d'achat</th>
          <th class="num">Marge</th>
          <th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td data-label="#">{{ p.id }}</td>
          <td data-label="Nom">{{ p.nom }}</td>
          <td data-label="Prix" class="num">{{ money(p.prix) }}</td>
          <td data-label="Prix d'achat" class="num">{{ money(p.prixAchat) }}</td>
          <td data-label="Marge" class="num" :class="{ negative: p.prix < p.prixAchat }">{{ money(p.prix - p.prixAchat) }}</td>
          <td>
            <div class="row-actions">
            <template v-if="pendingDelete === p.id">
              <button class="danger" @click="emit('remove', p.id); pendingDelete = null">Confirmer</button>
              <button @click="pendingDelete = null">Annuler</button>
            </template>
            <template v-else>
              <button @click="emit('edit', p)">Modifier</button>
              <button class="danger" @click="pendingDelete = p.id">Supprimer</button>
            </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
