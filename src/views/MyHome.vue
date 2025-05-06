<template>
  <div class="list">
    <h1>Test components</h1>
    <div class="-card-like" style="width: 100%">
      <h4>Funnel cool</h4>
      <p class="-description">Description</p>
      <u-category-funnel :categories="categories" :colors="colors" />
    </div>
    <div>
      <u-button @click="showDialog">Open Dialog with Outside Close Icon</u-button>
      <u-dialog :visible="visible" closable close-icon-outside @close="closeDialog">
        <template #title>
          <h2>Dialog Title</h2>
        </template>
        <p>Dialog content goes here.</p>
        <template #footer>
          <u-button @click="closeDialog">Close</u-button>
        </template>
      </u-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import UButton from '@/modules/ui/basic/UButton.vue';
  import UCategoryFunnel from '@/modules/ui/data/UCategoryFunnel.vue';
  import UDialog from '@/modules/ui/others/UDialog.vue';

  const visible = ref(false);
  const showDialog = () => {
    visible.value = true;
  };
  const closeDialog = () => {
    visible.value = false;
  };

  const transactions = 125_000_000;
  const digitalized = 62_250_000;
  const w2s = 26_300_000;

  const categories = ref([
    {
      value: transactions,
      title: 'Transactions',
      subtitle: 'Subtitle',
    },
    {
      value: digitalized,
      title: 'Digitalized',
      subtitle: 'Subtitle',
    },
    {
      value: w2s,
      title: 'W2S',
      subtitle: 'Subtitle',
    },
  ]);
  const colors = ref(['blue', 'green', 'orange']);
</script>

<style lang="scss">
  .list {
    padding: 20px;
  }
</style>
