<script setup>
import { reactive, ref, watch } from "vue";

const props = defineProps({
  product: { type: Object, default: null },
  submit: { type: Function, required: true },
});
const emit = defineEmits(["done", "cancel"]);

const empty = () => ({ id: 0, nom: "", prix: null, prixAchat: null });
const form = reactive(empty());
const errors = ref({});
const message = ref("");
const saving = ref(false);

watch(
  () => props.product,
  (p) => {
    Object.assign(form, p ? { ...p } : empty());
    errors.value = {};
    message.value = "";
  },
  { immediate: true },
);

function validate() {
  const e = {};
  if (!form.nom || !form.nom.trim()) e.nom = "Le nom est obligatoire";
  else if (form.nom.length > 25) e.nom = "Le nom doit contenir entre 1 et 25 caractères";
  if (!form.prix || form.prix < 1) e.prix = "Le prix doit être supérieur ou égal à 1";
  if (form.prixAchat === null || form.prixAchat < 0) e.prixAchat = "Le prix d'achat ne peut pas être négatif";
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function onSubmit() {
  message.value = "";
  if (!validate()) return;
  saving.value = true;
  try {
    await props.submit({ ...form, nom: form.nom.trim() });
    Object.assign(form, empty());
    emit("done");
  } catch (e) {
    errors.value = e.fieldErrors || {};
    message.value = e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="card form" novalidate @submit.prevent="onSubmit">
    <h2>{{ form.id ? "Modifier le produit" : "Nouveau produit" }}</h2>

    <label>
      Nom
      <input v-model="form.nom" name="nom" maxlength="25" :aria-invalid="!!errors.nom" />
      <small v-if="errors.nom" class="field-error">{{ errors.nom }}</small>
    </label>

    <div class="row">
      <label>
        Prix de vente
        <input v-model.number="form.prix" name="prix" type="number" min="1" :aria-invalid="!!errors.prix" />
        <small v-if="errors.prix" class="field-error">{{ errors.prix }}</small>
      </label>
      <label>
        Prix d'achat
        <input v-model.number="form.prixAchat" name="prixAchat" type="number" min="0" :aria-invalid="!!errors.prixAchat" />
        <small v-if="errors.prixAchat" class="field-error">{{ errors.prixAchat }}</small>
      </label>
    </div>

    <p v-if="message" class="alert" role="alert">{{ message }}</p>

    <div class="actions">
      <button type="submit" class="primary" :disabled="saving">{{ form.id ? "Enregistrer" : "Ajouter" }}</button>
      <button v-if="form.id" type="button" @click="emit('cancel')">Annuler</button>
    </div>
  </form>
</template>
