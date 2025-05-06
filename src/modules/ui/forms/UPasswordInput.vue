<template>
  <div class="password-input-wrapper">
    <span v-if="label || $slots.label" class="password-label-wrapper">
      <span v-if="label">{{ label }}</span>
      <slot name="label" />
    </span>
    <div
      class="u-password-input"
      :class="{
        '-disabled': disabled,
        '-error': error,
      }"
    >
      <input
        v-model="localValue"
        :class="{
          '-show': isVisible,
          '-disabled': disabled,
        }"
        class="main-input"
        :type="isVisible ? 'text' : 'password'"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="handleBlur"
      />
      <div class="show-btn" @click="toggleVisibility">
        <icon-base
          class="icon-view"
          :icon="isVisible ? 'icon-view' : 'icon-hide'"
          :color="isVisible ? 'var(--color-neutral-800)' : 'var(--color-neutral-300)'"
          size="20"
        />
      </div>
    </div>
    <el-progress
      v-if="showProgress"
      class="password-progress"
      :show-text="false"
      :color="progressColors"
      :percentage="percentage"
    />
    <transition name="error-text">
      <span v-if="hasError" class="error-msg">{{ errorMessage }}</span>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onMounted, PropType } from 'vue';
  import { debounce } from '@/libs/utils/Debounce';
  import { ElProgress } from 'element-plus';
  import { IconBase } from '@/modules/ui';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'new-password',
    },
    rules: {
      type: Array as PropType<((value: string) => number)[]>,
      default: () => [],
    },
    error: {
      type: [Boolean, String],
      default: false,
    },
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
    (e: 'blur', value: string): void;
  }>();

  const DEBOUNCE_TIME = 250;

  const isVisible = ref(false);
  const localValue = ref(props.modelValue);
  const percentage = ref(0);
  const hasError = computed(() => !!props.error);
  const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''));
  const showProgress = computed(() => !props.disabled && props.progress);

  const progressColors = ref([
    { color: '#E53D3D', percentage: 33 },
    { color: '#FF600A', percentage: 66 },
    { color: '#1DA57C', percentage: 100 },
  ]);

  const validateInputDebouncer = debounce(() => {
    validatePassword(localValue.value);
  }, DEBOUNCE_TIME);

  const validatePassword = (value: string) => {
    let score = 0;
    for (const rule of props.rules) {
      score += rule(value);
    }
    percentage.value = Math.min(score, 100);
  };

  const toggleVisibility = () => {
    if (!props.disabled) {
      isVisible.value = !isVisible.value;
    }
  };

  const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    localValue.value = value;
    emit('update:modelValue', value);
    emit('change', value);
    validateInputDebouncer();
  };

  const handleBlur = (event: Event) => {
    emit('blur', (event.target as HTMLInputElement).value);
  };

  watch(
    () => props.modelValue,
    (value) => {
      localValue.value = value;
      validatePassword(value);
    }
  );

  onMounted(() => {
    if (props.rules.length && localValue.value) {
      validatePassword(localValue.value);
    }
  });
</script>
<style lang="scss">
  .password-input-wrapper {
    position: relative;
    width: 100%;
    .password-label-wrapper {
      display: block;
      position: relative;
      margin-bottom: 5px;
      font-weight: 600;
    }

    .u-password-input {
      display: flex;
      position: relative;
      align-items: center;
      z-index: 1;
      border: 1px solid var(--color-input-border);
      border-radius: 4px;
      background-color: var(--color-background-white);
      height: 40px;
      transition: border-color 0.2s;
      &.-error {
        border: solid 1px var(--color-status-error);
      }
      &:hover {
        border-color: var(--color-input-border-hover);
      }
      &:focus-within {
        outline: 3px solid var(--color-input-outline-focus);
        caret-color: var(--color-neutral-800);
      }
      .main-input {
        outline: none;
        border: none;
        background-color: unset;
        padding-left: 16px;
        width: 100%;
        line-height: normal;
        font-size: var(--paragraph-02);
        &::placeholder {
          opacity: 0.5 !important;
        }
        &.-disabled {
          color: var(--color-neutral-400);
        }
      }
      .show-btn {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
        margin-right: 8px;
        cursor: pointer;
        padding: 6px;
        height: 100%;
      }
    }
    .password-progress {
      bottom: -2px;
      .el-progress-bar {
        .el-progress-bar__outer {
          border-radius: 0 0 300px 300px;
          background-color: unset;
        }
      }
    }
    .error-msg {
      color: var(--color-status-error);
      font-size: var(--paragraph-03);
    }

    .error-text-enter-active {
      animation: error-txt 0.2s ease-in-out;
    }
  }
</style>
