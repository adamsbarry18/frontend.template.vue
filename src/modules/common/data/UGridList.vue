<template>
  <base-list class="u-grid-list" :list-service="listService">
    <template #items="{ items }">
      <u-grid class="u-grid-list-container">
        <div v-for="(item, key) in items" :key="key">
          <slot name="item" :item="item" />
        </div>
      </u-grid>
    </template>
    <template #empty-label>
      <slot name="empty-label" />
    </template>
    <template #header>
      <slot name="header" />
    </template>
  </base-list>
</template>

<script setup lang="ts">
  import UGrid from '../layout/UGrid.vue';
  import BaseList from './BaseList.vue';
  import { PropType } from 'vue';
  import type ListService from './services/listService';

  defineProps({
    listService: {
      type: Object as PropType<ListService>,
      default: null,
    },
  });
</script>

<style lang="scss" scoped></style>
