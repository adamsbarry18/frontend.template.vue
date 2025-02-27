<template>
  <div class="demo">
    <h1>u-button Examples</h1>

    <div class="u-button-group">
      <h3>Different Types</h3>
      <u-button type="default" @click="handleClick">{{
        $t('commons.yes')
      }}</u-button>
      <u-button type="primary" @click="handleClick">Primary</u-button>
      <u-button type="secondary" @click="handleClick">Secondary</u-button>
      <u-button type="tertiary" @click="handleClick">Tertiary</u-button>
      <u-button type="warning" @click="handleClick">Warning</u-button>
      <u-button type="delete" @click="handleClick">delete</u-button>
    </div>

    <div class="u-button-group">
      <h3>Icones et États</h3>
      <u-button icon="icon-add" type="primary" @click="handleClick"
        >Ajouter</u-button
      >
      <u-button icon="icon-delete" type="delete" @click="handleClick"
        >Supprimer</u-button
      >
      <u-button icon="icon-edit" type="secondary" @click="handleClick"
        >Modifier</u-button
      >
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import UButton from './commons/basic/UButton.vue';
  const value1 = ref(true);
  const isActive = ref(false);
  const seletedDate = ref(null);
  const value = ref('je suis clicked');
  const handleClick = () => {
    alert(value.value);
  };
  import { ElMessage, ElMessageBox } from 'element-plus';

  const open = () => {
    ElMessageBox.confirm(
      'proxy will permanently delete the file. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'success',
      }
    );
  };
</script>

<style scoped>
  .demo {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .u-button-group {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  h1 {
    margin-bottom: 2rem;
  }

  h3 {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
