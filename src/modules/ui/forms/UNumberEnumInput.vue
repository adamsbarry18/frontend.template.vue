<template>
  <div class="u-number-enum-input">
    <div
      v-for="option in options"
      :key="option"
      class="option -button-like"
      :class="{
        '-selected': input === option && !customInputFocused,
        '-disabled': disabled,
      }"
      @click="setModelValue(option)"
    >
      {{ option }}
    </div>
    <div
      class="editable-option -button-like"
      :title="$t('commons.number-enum-input.edit')"
      :class="{
        '-disabled': disabled,
        '-selected': isCustomModelValue,
        '-focused': customInputFocused,
      }"
      @click="focusCustomInput"
    >
      <input
        v-if="customInputFocused"
        ref="inputRef"
        v-model="input"
        class="custom-input"
        type="number"
        :min="min"
        :max="max"
        @blur="unfocusCustomInput"
        @keypress.enter="unfocusCustomInput"
      />
      <span v-if="!customInputFocused">{{
        isCustomModelValue ? input : lastCustomModelValue
      }}</span>
      <icon-base
        v-if="!customInputFocused"
        icon="icon-edit"
        color="var(--color-neutral-700)"
        size="16"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick, PropType } from 'vue';
  import { IconBase } from '@/modules/ui';

  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0,
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits<{
    (e: 'input', modelValue: number): void;
    (e: 'change', modelValue: number): void;
  }>();

  const input = ref(props.modelValue);
  const lastCustomModelValue = ref<string | number>('…');
  const customInputFocused = ref(false);
  const inputRef = ref<HTMLInputElement | null>(null);

  const isCustomModelValue = computed(
    () => !props.options.includes(input.value)
  );

  watch(
    () => props.modelValue,
    (val) => {
      input.value = val;
    }
  );

  const focusCustomInput = () => {
    if (!props.disabled) {
      customInputFocused.value = true;
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus();
          inputRef.value.select();
          if (lastCustomModelValue.value !== '…') {
            input.value = lastCustomModelValue.value as number;
          }
        }
      });
    }
  };

  const unfocusCustomInput = () => {
    customInputFocused.value = false;
    input.value = Math.min(
      Math.max(input.value, props.min || 0),
      props.max || 100
    );
    lastCustomModelValue.value = input.value;
    if (isNaN(input.value)) {
      input.value = props.min || 0;
      lastCustomModelValue.value = props.options.includes(input.value)
        ? '…'
        : input.value;
    }
    handleChange();
  };

  const setModelValue = (value: number) => {
    if (!props.disabled) {
      input.value = value;
      handleChange();
    }
  };

  const handleChange = () => {
    emit('input', input.value);
    emit('change', input.value);
  };
</script>

<style lang="scss" scoped>
  .u-number-enum-input {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: space-between;
    margin: 5px 0 8px 0;
    height: 40px;

    .editable-option,
    .option {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      box-shadow: var(--box-shadow-m);
      background-color: var(--color-background-white);
      height: 40px;
      font-size: var(--paragraph-03);
      font-weight: 700;

      &:hover:not(.-selected):not(.-focused):not(.-disabled) {
        filter: none;
        background-color: var(--color-neutral-100);
      }

      &.-selected:not(.-focused) {
        background-color: var(--color-primary-500);
        color: var(--color-white);
      }

      &.-disabled {
        cursor: not-allowed;

        &:not(.-selected) {
          box-shadow: none;
          background: var(--color-input-disabled-background);
          border-color: var(--color-input-disabled-border);
          color: var(--color-input-disabled-content);
        }

        &.-selected,
        &:hover {
          filter: none;
        }
      }

      &.-focused {
        border: solid 1px var(--color-green-500);
      }
    }

    .option {
      width: 71px;
    }

    .editable-option {
      width: 142px;

      .custom-input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 30px;
        height: 30px;
        text-align: center;
        font-size: var(--paragraph-03);
        font-weight: 700;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &:focus {
          outline: none;
          border: none;
        }
      }
    }
  }
</style>
