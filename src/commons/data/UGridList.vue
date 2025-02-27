<template>
  <base-list class="u-grid-list" :list-service="listService">
    <template #items="{ items }">
      <p>{{ items }}</p>
      <u-grid class="u-grid-list-container">
        <div v-for="(item, key) in items" :key="key">
          <slot name="item" :item="item" />
        </div>
      </u-grid>
    </template>
    <template v-slot:empty-label>
      <slot name="empty-label" />
    </template>
    <template v-slot:header>
      <slot name="header" />
    </template>
  </base-list>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import UGrid from '../layout/UGrid.vue';
  import BaseList from './BaseList.vue';
  import ListService from './services/listService';

  const props = defineProps({
    listService: {
      type: ListService,
      required: false,
      default: null,
    },
  });

  onMounted(() => {
    console.log('data: ', props.listService?.getData);
  });
</script>

<style lang="scss"></style>
