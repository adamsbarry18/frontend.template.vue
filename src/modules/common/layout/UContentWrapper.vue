<template>
  <div
    class="u-wrapper"
    :class="{ '-with-actions': $slots.actions, '-with-left': $slots.left }"
  >
    <u-loader v-if="loading" center size="150px" />
    <template v-else>
      <div v-if="$slots.left" class="u-left-panel">
        <div class="left-wrapper">
          <slot name="left-title" />
          <slot name="left-button" />
          <slot name="left" />
        </div>
      </div>
      <div class="u-main-panel">
        <slot />
        <u-action-button-bar
          v-if="$slots.actions && showButtons"
          :placement="actionsPlacement"
        >
          <slot name="actions" />
        </u-action-button-bar>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import ULoader from '@/modules/common/others/ULoader.vue';
  import UActionButtonBar from '@/modules/common/others/UActionButtonBar.vue';
  import { onMounted, ref, watch } from 'vue';

  const props = defineProps({
    actionsPlacement: {
      type: String,
      default: 'low',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingZone: {
      type: String,
      default: 'main',
    },
  });

  const showButtons = ref(false);

  watch(
    () => props.loading,
    (value) => {
      onLoadingChanged(value);
    }
  );

  onMounted(() => {
    showButtons.value = !props.loading;
  });

  const onLoadingChanged = (value: boolean) => {
    showButtons.value = !value;
  };
</script>

<style lang="scss" scoped>
  .-full-page {
    margin: 32px;
    border-radius: 4px;
    border: 1px solid var(--color-neutral-300);
    background: var(--color-background-white);
    overflow-y: hidden;
  }

  .u-wrapper {
    display: flex;
    height: 100%;
    overflow-y: hidden;

    .u-left-panel {
      z-index: 2;
      border-right: 1px solid var(--color-neutral-300);
      background-color: var(--color-background-white);
      width: 280px;
      height: 100%;

      .left-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }

    & > .u-main-panel {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: auto;
      scroll-behavior: smooth;

      & > .u-action-button-bar > .wrapper-buttons {
        & > * {
          display: flex;
          flex-direction: column;
        }
        .item {
          margin-bottom: 15px;
        }
      }
    }

    &.-with-actions {
      .u-main-panel {
        flex-direction: row;
        .u-action-button-bar {
          position: absolute;
        }
      }
    }
  }
</style>
