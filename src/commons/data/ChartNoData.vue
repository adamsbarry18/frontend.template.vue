<template>
  <div class="chart-no-data">
    <span>{{ $t('commons.treeview.no-data') }}</span>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="scss">
  .chart-no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    span {
      font-size: var(--paragraph-03);
      color: var(--color-neutral-500);
    }
  }
</style>
