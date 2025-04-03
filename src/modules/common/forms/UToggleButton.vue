<template>
  <div class="u-toggle-button-container">
    <button
      v-for="option in options"
      :key="option.value"
      class="u-toggle-button"
      :class="{ '-active': modelValue === option.value }"
      @click="handleToggle(option.value)"
      :disabled="disabled"
    >
      <icon-base
        v-if="option.icon"
        :icon="option.icon"
        :size="22"
        :rich="true"
        :color="
          modelValue === option.value
            ? 'var(--color-white)'
            : 'var(--color-neutral-700)'
        "
      />
      <span v-if="option.label">{{ option.label }}</span>
      <span
        v-if="option.number !== undefined"
        class="badge"
        :class="{ '-positive': option.number > 0 }"
      >
        {{ option.number }}
      </span>
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, onMounted } from 'vue';
  import { IconBase } from '@/modules/common';

  interface ToggleButtonOption {
    value: string | number;
    label?: string;
    icon?: string;
    number?: number;
  }

  const props = defineProps({
    modelValue: {
      default: '',
    },
    options: {
      type: Array as PropType<ToggleButtonOption[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['update:modelValue', 'change']);
  const handleToggle = (value: string | number) => {
    if (value !== props.modelValue) {
      emit('update:modelValue', value);
      emit('change', value);
    }
  };
  onMounted(() => {
    if (!props.modelValue && props.options.length > 0) {
      emit('update:modelValue', props.options[0].value);
    }
  });
</script>

<style lang="scss">
  .u-toggle-button-container {
    display: flex;
    align-items: center;

    .u-toggle-button {
      min-width: 35px;
      min-height: 35px;
      background: var(--color-white);
      border: 1px solid var(--color-input-border);
      padding: 5px 16px;
      box-sizing: border-box;

      &:hover {
        cursor: pointer;
      }

      &.-active {
        border: 1px solid var(--color-neutral-900) !important;
        background-color: var(--color-neutral-900);
        cursor: default;

        span {
          color: var(--color-white);
        }

        .badge {
          background-color: var(--color-white);
          color: var(--color-neutral-900);
        }
      }

      &:first-child {
        border-radius: 3px 0 0 3px;
        border-right: 1px solid transparent;
      }

      &:last-child {
        border-radius: 0 3px 3px 0;
        border-left: 1px solid transparent;
      }

      .badge {
        padding: 4px 6px;
        margin-left: 5px;
        background-color: var(--color-white);
        border: 1px solid var(--color-neutral-800);
        vertical-align: initial;
        color: var(--color-neutral-700);

        &.-positive {
          background-color: var(--color-warning-700);
          border: 1px solid transparent;
          color: var(--color-white);
        }
      }
    }
  }
</style>
