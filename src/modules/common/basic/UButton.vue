<template>
  <button
    ref="button"
    :disabled="disabled"
    :class="[
      type ? `-${type}` : '',
      size ? `-${size}` : '',
      disabled && '-disabled',
      round && '-round',
      preview && '-preview',
    ]"
    class="u-button"
    :title="collapsable ? '' : title"
    @click.stop="handleClick"
  >
    <icon-base
      v-if="icon"
      :icon="icon"
      class="button-icon"
      :color="computedIconColor"
      :size="iconSize"
    />
    <slot />
    <div v-if="collapsable" class="label-btn">
      <span class="label-txt">{{ label || title }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import IconBase from '../icons/IconBase.vue';
  import { waitForMilliseconds } from '@/libs/utils/Time';

  const props = defineProps({
    type: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
    },
    round: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    iconColor: {
      type: String,
      default: '',
    },
    iconSize: {
      type: Number,
      default: 30,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    collapsable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    label: {
      type: String,
    },
    previewDelay: {
      type: Number,
      default: 0,
    },
  });

  const emit = defineEmits(['click']);

  const preview = ref(true);

  const computedIconColor = computed(() => {
    return props.iconColor || 'var(--text-color)';
  });

  const handleClick = (evt: Event) => {
    emit('click', evt);
  };

  const showPreview = async () => {
    preview.value = true;
    await waitForMilliseconds(2500 + props.previewDelay);
    preview.value = false;
  };

  onMounted(() => {
    showPreview();
  });
</script>

<style lang="scss">
  .u-button {
    --text-color: var(--color-neutral-700);
    color: var(--text-color);
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease-in-out;
    border: 0;
    border-radius: 3px;
    cursor: pointer;
    padding: 0px 20px;
    min-width: 75px;
    min-height: 42px;
    font-size: var(--paragraph-02);
    font-weight: 600;

    &:hover {
      & > .label-btn {
        transform: scaleX(1);
      }
    }

    &.-preview {
      &.-warning-hover {
        background-color: var(--color-status-error);
      }
      & > .label-btn {
        transform: scaleX(1);
      }
      &.-default:not(.-disabled) {
        & > .label-btn {
          background-color: inherit;
          color: var(--color-neutral-100);
        }
      }
    }

    .label-btn {
      display: inline-flex;
      position: absolute;
      top: 0;
      right: 0;
      align-items: center;
      transform: scaleX(0);
      transform-origin: right top;
      transition: transform 0.2s ease-in-out;
      z-index: -3;
      margin-right: 20px;
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
      background-color: inherit;
      padding-right: 20px;
      padding-left: 20px;
      width: auto;
      height: 42px;

      .label-txt {
        z-index: -2;
        white-space: nowrap;
        color: var(--text-color);
      }
    }

    &.-round {
      border-radius: 50%;
      padding: 0;
      width: 40px;
      min-width: inherit;
      height: 40px;

      .el-loading-mask {
        border-radius: 50%;
        background-color: hsla(216, 38%, 95%, 0.5);
      }
    }

    &.-small {
      min-width: 65px;
      max-height: 30px;
      font-size: var(--caption);
    }

    &.-full {
      width: 100%;
    }

    &.-disabled {
      cursor: not-allowed;
      pointer-events: auto;
      &.-default,
      &.-primary,
      &.-secondary,
      &.-tertiary,
      &.-dashboard,
      &.-delete {
        --text-color: var(--color-button-disabled-content);
        background-color: var(--color-button-disabled-background);
        filter: none;
        &:hover {
          background-color: var(--color-button-disabled-background);
        }
      }
    }

    &.-default {
      color: var(--color-grey-900);
      background-color: var(--color-grey-100);
      border: 1px solid var(--color-grey-300);
      &:hover {
        background-color: var(--color-grey-200);
      }
      &:focus {
        background-color: var(--color-grey-200);
        outline: 3px solid var(--color-grey-300);
      }
    }

    &.-primary {
      --text-color: var(--color-white);
      background-color: var(--color-primary-500);
      &:not(.-disabled) > .label-btn {
        background-color: var(--color-primary-400);
        color: var(--color-white);
      }
      &:hover {
        background-color: var(--color-primary-400);
      }
      &:focus {
        background-color: var(--color-primary-400);
        outline: 3px solid var(--color-primary-100);
      }
    }

    &.-secondary {
      --text-color: var(--color-neutral-700);
      border: 1px solid var(--color-secondary-button-border);
      background-color: var(--color-white);
      font-weight: 500;
      &:not(.-disabled) > .label-btn {
        border: 1px solid var(--color-secondary-button-border);
        background-color: var(--color-white);
      }
      &:hover {
        background-color: var(--color-neutral-100);
        border-color: var(--color-secondary-button-border-hover);
      }
      &:focus {
        background-color: var(--color-white);
        outline: 3px solid var(--color-secondary-button-border-hover);
      }
    }

    &.-tertiary {
      --text-color: var(--color-white);
      background-color: var(--color-neutral-800);
      &:hover {
        background-color: var(--color-neutral-700);
      }
      &:focus {
        background-color: var(--color-neutral-700);
        outline: 3px solid var(--color-neutral-300);
      }
    }
    &.-warning {
      --text-color: var(--color-white);
      background-color: var(--color-yellow-600);
      &:hover {
        background-color: var(--color-yellow-300);
      }
    }
    &.-delete {
      --text-color: var(--color-white);
      background-color: var(--color-status-error);
      &:hover {
        background-color: var(--color-red-400);
      }
    }

    &.-warning-hover {
      &:hover {
        background-color: var(--color-status-error);
        --text-color: var(--color-white);
      }
      &.-disabled:hover {
        background: var(--color-button-disabled-background);
        color: var(--color-button-disabled-content);
        .label-btn {
          color: var(--color-button-disabled-button);
        }
      }
    }

    &.-text {
      color: var(--color-neutral-500);
    }
  }
</style>
