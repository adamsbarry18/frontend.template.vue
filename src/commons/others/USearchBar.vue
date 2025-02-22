<template>
  <div class="u-search-bar">
    <icon-base
      v-if="iconPosition === 'left'"
      icon="icon-search"
      class="icon left"
      :class="{ '-focused': isFocused }"
      :color="iconColor"
      size="32"
      @click="handleSearch"
    />

    <slot name="prefix" />
    <input
      ref="inputElement"
      class="main-input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :class="{ '-focused': isFocused }"
      v-bind="inputAttrs"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.enter="handleSearch"
    />
    <div
      v-if="showClearButton"
      class="delete-btn"
      :class="{ '-visible': modelValue !== '' }"
      role="button"
      tabindex="0"
      @click="clearInput"
      @keyup.enter="clearInput"
    >
      <icon-base
        v-if="!clearLabel"
        icon="icon-cross"
        class="icon-clear"
        color="var(--color-white)"
        size="15"
        aria-label="Clear search"
      />
      <span v-else class="clear-label">
        {{ clearLabel }}
      </span>
    </div>

    <slot name="suffix" />

    <icon-base
      v-if="iconPosition === 'right'"
      icon="icon-search"
      class="icon right"
      :class="{ '-focused': isFocused }"
      :color="iconColor"
      size="32"
      @click="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, useAttrs } from 'vue';
  import { debounce } from '@/libs/utils/Debounce';
  import IconBase from '@/commons/icones/IconBase.vue';

  const props = defineProps({
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    iconColor: {
      type: String,
      default: 'var(--color-neutral-700)',
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'right'].includes(value),
    },
    clear: {
      type: Boolean,
      default: true,
    },
    clearLabel: {
      type: String,
      default: '',
    },
    debounceDelay: {
      type: Number,
      default: 250,
    },
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search', value: string): void;
    (e: 'clear'): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
  }>();

  const inputElement = ref<HTMLInputElement | null>(null);
  const isFocused = ref(false);
  const attrs = useAttrs();

  const showClearButton = computed(
    () => props.clear && props.modelValue?.length
  );

  const inputAttrs = computed(() => ({
    ...attrs,
    class: undefined,
    style: undefined,
  }));

  const emitUpdate = debounce((value: string) => {
    emit('update:modelValue', value);
  }, props.debounceDelay);

  const handleInput = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    emitUpdate(value);
  };

  const handleSearch = () => {
    emit('search', props.modelValue ?? '');
  };

  const clearInput = () => {
    emit('update:modelValue', '');
    emit('clear');
    inputElement.value?.focus();
  };

  const handleFocus = () => {
    isFocused.value = true;
    emit('focus');
  };

  const handleBlur = () => {
    isFocused.value = false;
    emit('blur');
  };

  // Focus externe
  defineExpose({
    focus: () => inputElement.value?.focus(),
  });
</script>

<style scoped lang="scss">
  .u-search-bar {
    --transition-duration: 0.2s;
    --border-radius: 4px;
    --input-padding: 0 10px;

    display: flex;
    align-items: center;
    transition: border-color var(--transition-duration);
    border: 1px solid var(--color-input-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background-white);
    color: var(--color-neutral-800);

    &:hover {
      border-color: var(--color-input-border-hover);
    }

    &:focus-within {
      outline: 3px solid var(--color-input-outline-focus);
    }

    .main-input {
      flex: 1;
      outline: none;
      border: none;
      background: transparent;
      font-size: var(--paragraph-02);
      color: inherit;

      &::placeholder {
        opacity: 0.5;
      }
    }

    .delete-btn {
      opacity: 0;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      padding: 0 10px;
      transform: translateX(10px);

      &.-visible {
        opacity: 1;
        transform: translateX(0);
      }

      .icon-clear {
        border-radius: 50%;
        background: var(--color-neutral-700);
        padding: 1px;
      }
    }

    .icon {
      transition: opacity var(--transition-duration) ease-in-out;
      opacity: 0.5;
      cursor: pointer;
      padding: 6px;
      height: 100%;

      &.-focused {
        opacity: 1;
      }

      &.left {
        margin-left: 8px;
      }
    }
  }
  .u-search-bar.-blue {
    margin: 0 auto 15px auto;
    border: none;
    border-radius: 30px;
    width: 90%;
    background: var(--color-neutral-800);

    .main-input {
      padding: 6px 15px;
      color: var(--color-white);

      &::placeholder {
        color: var(--color-bluewhite);
      }
    }
  }
</style>
