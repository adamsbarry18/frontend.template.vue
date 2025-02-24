<template>
  <div class="u-dashboard-header-card -card-like">
    <div class="first-row">
      <icon-base :icon="icon" :size="24" color="var(--color-neutral-800)" />
      <h3>{{ title }}</h3>
      <span class="last-computation-info">
        <p v-if="lastProcessTime">
          {{ $t('commons.last-process') }} {{ $d(lastProcessTime, 'middle') }}
        </p>
      </span>
      <slot name="dimension" />
    </div>
    <p class="header-card-description">
      <slot name="description" />
    </p>
  </div>
</template>
<script setup lang="ts">
  import IconBase from '@/commons/icons/IconBase.vue';

  defineProps({
    title: {
      type: String,
      required: true,
    },
    lastProcessTime: {
      default: null,
    },
    icon: {
      type: String,
      required: true,
    },
  });
</script>

<style lang="scss">
  .u-dashboard-header-card {
    padding: 24px 24px 32px 24px;

    .first-row {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      .u-icon {
        margin-right: 8px;
      }
      .last-computation-info {
        display: flex;
        align-items: center;
        margin-left: 8px;
        border-left: 1px var(--color-neutral-300) solid;
        padding-left: 8px;
        color: var(--color-neutral-500);
      }
    }
    .header-card-description {
      line-height: 160%;
    }
  }
</style>
