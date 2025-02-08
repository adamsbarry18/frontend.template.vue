<script setup lang="ts">
import AButton from "./modules/basic/AButton.vue";

const handleClick = () => {
  console.log("a-button clicked!");
};
</script>

<template>
  <div class="a-button-demo">
    <h1>a-button Examples</h1>

    <div class="a-button-group">
      <h3>Different Types</h3>
      <a-button type="default" @click="handleClick">Default</a-button>
      <a-button type="primary" @click="handleClick">Primary</a-button>
      <a-button type="secondary" @click="handleClick">Secondary</a-button>
      <a-button type="tertiary" @click="handleClick">Tertiary</a-button>
      <a-button type="warning" @click="handleClick">Warning</a-button>
      <a-button type="delete" @click="handleClick">delete</a-button>
    </div>

    <div class="a-button-group">
      <h3>Icones et États</h3>
      <a-button icon="IconAdd" type="primary" @click="handleClick"
        >Ajouter</a-button
      >
      <a-button icon="IconDelete" type="delete" @click="handleClick"
        >Supprimer</a-button
      >
      <a-button icon="icon-edit" type="secondary" @click="handleClick"
        >Modifier</a-button
      >
    </div>
  </div>
</template>

<style scoped>
.a-button-demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.a-button-group {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

h1 {
  color: var(--color-neutral-800);
  margin-bottom: 2rem;
}

h3 {
  width: 100%;
  color: var(--color-neutral-600);
  margin-bottom: 1rem;
}
</style>
