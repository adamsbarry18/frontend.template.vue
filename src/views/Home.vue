<template>
  <div class="list">
    <h1>Test components</h1>
    <div class="-card-like" style="width: 100%">
      <h4>Funnel cool</h4>
      <p class="-description">Description</p>
      <u-category-funnel :categories="categories" :colors="colors" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import UButton from '@/commons/basic/UButton.vue';
  import UCategoryFunnel from '@/commons/data/UCategoryFunnel.vue';

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

  const handleSelectionChange = () => {
    console.log('selection-change: ');
  };

  const alert = (row) => {
    window.alert(JSON.stringify(row));
  };
  const value = ref('je suis clicked');
  const handleClick = () => {
    alert(value.value);
  };
</script>

<style lang="scss">
  .list {
    padding: 20px;
  }
</style>
