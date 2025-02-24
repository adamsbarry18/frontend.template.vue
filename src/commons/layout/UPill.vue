<template>
  <div
    class="u-pill"
    :title="title"
    :class="{ '-disabled': disabled, '-closable': isClosable }"
  >
    <div
      class="pill-content"
      :class="{ '-button-like': clickable }"
      @click="onClick"
    >
      <icon-base v-if="icon" :icon="icon" :size="24" :color="iconColor" />
      <span class="-text-ellipsis">
        <slot />
      </span>
    </div>
    <u-button
      v-if="isClosable"
      type="secondary"
      icon="icon-close"
      icon-color="var(--color-neutral-500)"
      :icon-size="14"
      @click="onClose"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import UButton from '@/commons/basic/UButton.vue';
  import IconBase from '@/commons/icones/IconBase.vue';

  // Définir les props avec des types TypeScript
  const props = defineProps({
    isClosable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  });

  // Définir les événements émis
  const emit = defineEmits<{
    (e: 'click', event: Event): void;
    (e: 'close'): void;
  }>();

  // Propriétés calculées
  const iconColor = computed(() =>
    props.disabled ? 'var(--color-neutral-300)' : 'var(--color-neutral-800)'
  );

  // Fonctions
  function onClick(event: Event) {
    if (props.clickable) {
      emit('click', event);
    }
  }

  function onClose() {
    emit('close');
  }
</script>

<style lang="scss" scoped>
  .u-pill {
    display: flex;

    &.-disabled {
      .pill-content {
        background-color: var(--color-button-disabled-background);
        span {
          color: var(--color-button-disabled-content);
        }
        svg g {
          color: var(--color-button-disabled-content);
        }
      }
    }

    &.-closable {
      .pill-content {
        border-radius: 4px 0 0 4px;

        & > span {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      & > .u-button {
        left: -1px;
        padding: 0;
        width: 36px;
        min-width: 36px;
      }
    }

    .pill-content {
      display: flex;
      align-items: center;
      border-radius: 4px;
      background-color: var(--color-white);
      padding: 8px 16px;
      color: var(--color-neutral-800);
      border: 1px solid var(--color-input-border);

      span {
        display: block;
        max-width: 320px;
        font-size: var(--paragraph-03);
      }

      & > .u-icon {
        margin-right: 8px;
      }
    }
  }
</style>
