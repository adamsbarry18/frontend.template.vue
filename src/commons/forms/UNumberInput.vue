<template>
  <div
    class="u-number-input"
    :class="{
      '-focused': inputFocused,
      '-disabled': props.disabled,
      '-error': props.error,
    }"
  >
    <button
      v-if="props.step && props.showButtons"
      class="minus-button"
      :class="{
        '-focused': inputFocused,
        '-disabled': props.disabled || isMinDisabled,
      }"
      :disabled="props.disabled || isMinDisabled"
      @click.exact.stop="setValue((input ?? 0) - props.step)"
      @click.shift.stop="setValue((input ?? 0) - props.step * 10)"
    ></button>
    <div
      class="editable-option"
      :title="$t('commons.number-enum-input.edit')"
      :class="[inputFocused ? '-focused' : '', alignClass]"
      @click="focusInput"
    >
      <span v-if="props.prefix">{{ props.prefix }}</span>
      <input
        v-if="inputFocused"
        ref="inputRef"
        v-model="customInputValue"
        class="custom-input"
        :class="alignClass"
        type="number"
        :step="props.step"
        :min="props.min"
        :max="props.max"
        @input="onInputDebouncer()"
        @blur="unfocusInput"
        @keypress.enter="unfocusInput"
      />
      <span
        v-else
        class="input-value"
        :class="[hasLabel ? '-with-label' : '', alignClass]"
      >
        {{ input !== null ? props.formatter(input) : '-' }}
      </span>
      <span v-if="props.label">{{ props.label }}</span>
    </div>
    <span
      v-if="
        !props.disabled &&
        props.resetable &&
        props.resetValue !== null &&
        input !== props.resetValue
      "
      class="select-reset-btn"
      style="display: block"
      @click="onReset"
    >
      <u-tooltip placement="top">
        <icon-base
          icon="icon-reset"
          :size="20"
          color="var(--color-neutral-800)"
        />
        <template #content>
          <p>
            {{ $t('commons.form.input.reset') }}
            <strong>
              {{
                props.formatter
                  ? props.formatter(props.resetValue)
                  : props.resetValue
              }}
              <span v-if="props.label">{{ props.label }}</span>
            </strong>
          </p>
        </template>
      </u-tooltip>
    </span>
    <button
      v-if="props.step && props.showButtons"
      class="plus-button"
      :class="{
        '-focused': inputFocused,
        '-disabled': props.disabled || isMaxDisabled,
      }"
      :disabled="props.disabled || isMaxDisabled"
      @click.exact.stop="setValue((input ?? 0) + props.step)"
      @click.shift.stop="setValue((input ?? 0) + props.step * 10)"
    ></button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { debounce } from '@/libs/utils/Debounce.js';
  import UTooltip from '@/commons/others/UTooltip.vue';
  import IconBase from '@/commons/icons/IconBase.vue';
  import { MIN_INT, MAX_INT } from '@/libs/utils/constants';

  // Déclaration des props en utilisant l'objet
  const props = defineProps({
    modelValue: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    showButtons: { type: Boolean, default: true },
    error: { type: Boolean, default: false },
    label: { type: String, default: '' },
    prefix: { type: String, default: '' },
    step: { type: Number, default: 0.1 },
    min: { type: Number, default: MIN_INT },
    max: { type: Number, default: MAX_INT },
    formatter: {
      type: Function,
      default: (val: number) => new Intl.NumberFormat().format(val),
    },
    resetable: { type: Boolean, default: false },
    resetValue: { type: Number, default: null },
    align: {
      type: String,
      default: 'center',
      validator: (v: string) => ['left', 'center', 'right'].includes(v),
    },
  });

  // Déclaration des événements émis
  const emit = defineEmits<{
    (e: 'update:value', value: number | null): void;
    (e: 'change', value: number | null): void;
    (e: 'reset'): void;
  }>();

  const input = ref(props.modelValue);
  const customInputValue = ref<string | number>('');
  const inputFocused = ref(false);
  const inputRef = ref<HTMLInputElement | null>(null);
  let onInputDebouncer: () => void;

  const alignClass = computed(() => `-${props.align}`);
  const hasLabel = computed(() => !!props.label);

  const precision = (a: number): number => {
    if (!isFinite(a) || a === null) return 0;
    let factor = 1;
    let p = 0;
    while (Math.round(a * factor) / factor !== a) {
      factor *= 10;
      p++;
    }
    return p;
  };

  const stepPrecision = computed(() => precision(props.step));

  const isMaxDisabled = computed(() => {
    if (props.max == null || input.value == null) return false;
    return input.value >= props.max;
  });

  const isMinDisabled = computed(() => {
    if (props.min == null || input.value == null) return false;
    return input.value <= props.min;
  });

  watch(
    () => props.modelValue,
    (val) => {
      input.value = val !== null ? Number(val) : null;
    }
  );

  onMounted(() => {
    onInputDebouncer = debounce(() => onInput(), 300);
  });

  const focusInput = () => {
    if (!props.disabled) {
      customInputValue.value = input.value !== null ? input.value : '';
      inputFocused.value = true;
      setTimeout(() => {
        inputRef.value?.focus();
        document.execCommand('selectAll', false, null);
      }, 50);
    }
  };

  const onInput = () => {
    setValue(
      customInputValue.value !== '' ? Number(customInputValue.value) : null
    );
  };

  const unfocusInput = () => {
    inputFocused.value = false;
    setValue(
      customInputValue.value !== '' ? Number(customInputValue.value) : null
    );
  };

  const setValue = (value: number | null) => {
    if (!props.disabled) {
      input.value = formatValueForInput(value);
      if (isNaN(input.value as number) && input.value !== null) {
        input.value = props.min ?? 0;
      }
      handleChange();
    }
  };

  const handleChange = () => {
    emit('update:value', input.value);
    emit('change', input.value);
  };

  const formatValueForInput = (value: number | null): number | null => {
    if (value === null) return null;
    let res: number;
    if (props.step === null) {
      res = Number(value);
    } else {
      res = Number(Number(value).toFixed(stepPrecision.value));
    }
    if (props.min != null) res = Math.max(res, props.min);
    if (props.max != null) res = Math.min(res, props.max);
    return res;
  };

  const onReset = (e: Event) => {
    e.preventDefault();
    setValue(props.resetValue ?? 0);
    customInputValue.value = props.resetValue !== null ? props.resetValue : '';
    unfocusInput();
    emit('reset');
  };
</script>

<style lang="scss">
  .u-number-input {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.2s;
    border: 1px solid var(--color-input-border);
    border-radius: 4px;
    background-color: var(--color-white);
    height: 40px;
    flex-grow: 3;

    &.-focused {
      outline: 3px solid var(--color-input-outline-focus);
    }

    &:hover {
      border: solid 1px var(--color-input-border-hover);
    }

    &.-error {
      border: solid 1px var(--color-status-error);
    }

    &.-disabled {
      border: solid 1px var(--color-input-disabled-border);
      background-color: var(--color-input-disabled-bakcground);
      color: var(--color-input-disabled-content);
      filter: none;
      cursor: not-allowed;
      .editable-option {
        cursor: not-allowed;
      }
    }

    .plus-button,
    .minus-button {
      position: relative;
      flex-shrink: 0;
      border: none;
      border-radius: 2px;
      background-color: var(--color-neutral-100);
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 100%;
      &:disabled,
      &.-disabled {
        cursor: not-allowed;
        &:after {
          color: var(--color-neutral-100);
        }
      }
      &:hover {
        color: var(--color-input-border-hover);
      }
    }

    .plus-button {
      border-left: 1px solid var(--color-input-border);
      &:after {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 36px;
        font-size: 23px;
        content: '+';
      }
    }

    .minus-button {
      border-right: 1px solid var(--color-input-border);
      &:after {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 36px;
        font-size: var(--subheading);
        content: '-';
      }
    }

    .editable-option {
      display: flex;
      flex-grow: 1;
      align-items: center;
      height: 100%;
      padding: 0 12px;

      &.-left {
        justify-content: left;
      }
      &.-center {
        justify-content: center;
      }
      &.-right {
        justify-content: right;
      }

      .input-value {
        display: inline-block;
        justify-content: center;
        max-width: 100px;
        &.-with-label {
          margin-right: 5px;
          max-width: 80px;
        }
      }
      .custom-input {
        outline: none;
        border: none;
        max-width: 80px;
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        &.-left {
          text-align: left;
        }
        &.-center {
          text-align: center;
        }
        &.-right {
          text-align: right;
        }
      }
    }

    .select-reset-btn {
      padding-right: 4px;
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
