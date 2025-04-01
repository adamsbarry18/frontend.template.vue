<template>
  <div
    class="u-form-input"
    :class="{
      '-closable': closable,
      '-row': direction === 'row',
      '-disabled': disabled,
    }"
  >
    <span class="label-wrapper">
      <div element-loading-spinner="el-icon-loading" />
      <span v-if="label" class="simple-label">{{ label }}</span>
      <slot name="label" />
      <IconBase
        v-if="closable"
        icon="icon-cross"
        class="close-button -button-like"
        color="var(--color-background-white)"
        size="14"
        @click="handleClose"
      />
    </span>
    <slot v-if="$slots.input" name="input" />
    <u-number-input
      v-else-if="type === 'number'"
      v-model:number="input"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :prefix="prefix"
      @input="onChange"
      @blur="onBlur"
    />
    <u-date-picker
      v-else-if="type === 'date'"
      v-model="input"
      :class="{ '-error': withError }"
      :disabled="disabled"
      :disabled-date="disabledDate"
      :clearable="clearable"
      @change="onChange"
      @blur="onBlur"
    />
    <u-select-group
      v-else-if="type === 'enum'"
      v-model="input"
      :class="{ '-error': withError }"
      :placeholder="placeholder"
      :options="enumOptions"
      :disabled="disabled"
      :filterable="filterable"
      :group-by="groupBy"
      @change="onChange"
      @blur="onBlur"
    />
    <u-radio
      v-else-if="type === 'radio'"
      v-model="input"
      :options="radioOptions"
      :disabled="disabled"
      @change="onChange"
      @blur="onBlur"
    />
    <u-password-input
      v-else-if="type === 'password'"
      v-model="input"
      :class="{ '-error': withError }"
      :disabled="disabled"
      :rules="rules"
      :progress="progress"
      :autocomplete="autocomplete"
      @change="onChange"
      @blur="onBlur"
    />
    <textarea
      v-else-if="type === 'textarea'"
      v-model="input"
      class="textareu-type-input"
      :class="{ '-error': withError }"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onChange"
      @blur="onBlur"
    />
    <input
      v-else
      v-model="input"
      class="default-type-input"
      :class="{ '-error': withError, '-disabled': disabled }"
      :name="inputName"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="max"
      @input="onChange"
      @blur="onBlur"
    />
    <transition name="error-text">
      <span v-if="withError" class="error-msg">{{ errorMessage }}</span>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, PropType } from 'vue';
  import IconBase from '@/modules/common/icons/IconBase.vue';
  import UDatePicker from '@/modules/common/forms/UDatePicker.vue';
  import USelectGroup from '@/modules/common/forms/USelectGroup.vue';
  import URadio from '@/modules/common/forms/URadio.vue';
  import UNumberInput from '@/modules/common/forms/UNumberInput.vue';
  import UPasswordInput from '@/modules/common/forms/UPasswordInput.vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number, Date, Array, Boolean] as PropType<any>,
      default: '',
    },
    placeholder: { type: String, default: '' },
    direction: {
      type: String,
      default: 'column',
      validator: (v: string) => ['column', 'row'].includes(v),
    },
    label: { type: String },
    prefix: { type: String },
    progress: { type: Boolean, default: false },
    autocomplete: { type: String },
    inputName: { type: String },
    closable: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    filterable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disabledDate: { type: Function as PropType<() => void> },
    loading: { type: Boolean, default: false },
    validator: {
      type: Function as PropType<(value: any) => string | null>,
      default: null,
    },
    error: {
      type: [Boolean, String] as PropType<boolean | string>,
      default: false,
    },
    instantCheckError: { type: Boolean, default: false },
    type: {
      type: String,
      default: 'string',
      validator: (v: string) =>
        [
          'string',
          'textarea',
          'number',
          'date',
          'enum',
          'radio',
          'password',
        ].includes(v),
    },
    radioOptions: { type: Array as PropType<any[]>, default: () => [] },
    enumOptions: { type: Array as PropType<any[]>, default: () => [] },
    groupBy: { type: String, default: '' },
    tagType: { type: String, default: '' },
    maxTotalValues: { type: Number },
    step: { type: Number },
    min: { type: Number },
    max: { type: Number },
    rules: {
      type: Array as PropType<Array<(value: string) => number>>,
      default: () => [],
    },
    onInputChange: { type: Function as PropType<() => void>, required: false },
  });

  const emit = defineEmits(['update:modelValue', 'change', 'blur', 'close']);

  const input = ref<any>(null);
  const hasBlurred = ref(false);

  const errorMessage = computed(() => {
    if (!props.instantCheckError && !hasBlurred.value) return null;
    if (props.error) return props.error;
    if (props.validator) return props.validator(input.value);
    return null;
  });

  const withError = computed(
    () => !!errorMessage.value && (errorMessage.value as string).length > 0
  );

  watch(
    () => props.modelValue,
    (val) => {
      if (props.type === 'date' && val) {
        input.value = new Date((val as Date).getTime());
      } else {
        input.value = val;
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    if (props.type === 'date') {
      input.value = props.modelValue
        ? new Date((props.modelValue as Date).getTime())
        : null;
    } else if (props.type === 'number') {
      input.value = props.modelValue !== undefined ? props.modelValue : null;
    } else {
      input.value = props.modelValue ?? null;
    }
  });

  const onChange = () => {
    emit('update:modelValue', input.value);
    emit('change', input.value);
  };

  const onBlur = () => {
    hasBlurred.value = true;
    emit('blur', input.value);
  };

  const handleClose = () => {
    emit('close');
  };
</script>

<style lang="scss">
  .u-form-input {
    box-sizing: border-box;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 5px;

    &:not(:hover) {
      .close-button {
        display: none;
      }
    }

    &:hover {
      &.-closable {
        border: solid 1px var(--color-input-border);
      }
    }

    &.-row {
      flex-direction: row;
      align-items: center;
      .label-wrapper {
        margin-right: 8px;
        min-width: 60px;
      }
    }

    .label-wrapper {
      display: block;
      position: relative;
      margin-bottom: 4px;
      font-weight: 600;

      .simple-label {
        font-weight: 600;
      }

      .el-loading-mask {
        .el-loading-spinner {
          position: absolute;
          top: 22px;
          left: 44px;
          margin-top: -21px;
          width: 100%;
          text-align: unset;
        }
      }

      .close-button {
        position: absolute;
        top: 2px;
        right: 2px;
        margin-left: auto;
        border-radius: 2px;
        background: var(--color-neutral-700);
        padding: 2px;
      }
    }

    .u-input-number {
      width: 100%;
    }

    .default-type-input {
      transition: border-color 0.2s;
      border: solid 1px var(--color-input-border);
      border-radius: 4px;
      background-color: var(--color-background-white);
      padding: 5px 16px;
      width: 100%;
      min-height: 35px;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-02);

      &::placeholder {
        color: var(--color-placeholder);
      }

      &:hover {
        border-color: var(--color-input-border-hover);
      }

      &:focus {
        outline: 3px solid var(--color-input-outline-focus);
        caret-color: var(--color-neutral-800);
      }

      &.-error {
        border: solid 1px var(--color-status-error);
      }

      &.-disabled {
        box-shadow: none;
        background: var(--color-input-disabled-background);
        color: var(--color-input-disabled-content);
        border-color: var(--color-input-disabled-border);
        filter: none;
        cursor: not-allowed;
      }
    }

    .textareu-type-input {
      border: solid 1px var(--color-input-border);
      border-radius: 3px;
      padding: 5px 16px;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-02);
      font-weight: 400;
      width: 100%;
      resize: vertical;
      min-height: 60px;

      &::placeholder {
        color: var(--color-placeholder);
      }

      &:hover {
        border-color: var(--color-input-border-hover);
      }

      &:focus {
        outline: 3px solid var(--color-input-outline-focus);
        caret-color: var(--color-neutral-800);
      }

      &.-error {
        border: solid 1px var (--color-status-error);
      }
    }

    .u-date-picker {
      width: 100%;
      height: 40px;

      &.-error input {
        border: solid 1px var(--color-status-error);
      }
    }

    .password-input-wrapper {
      &.-error .u-password-input {
        border: solid 1px var(--color-status-error);
      }
    }

    .u-select-group {
      &.-error .el-input__inner {
        border: solid 1px var(--color-status-error);
      }

      .el-input__suffix-inner {
        pointer-events: none;
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

  @keyframes error-txt {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(2px);
    }
    75% {
      transform: translateX(-4px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>
