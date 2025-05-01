<template>
  <el-radio-group
    v-model="input"
    class="u-radio"
    :class="{ '-button': button, '-vertical': direction === 'column' }"
    :disabled="disabled"
    @change="handleChange"
  >
    <el-radio
      v-for="option in options"
      :key="option.value"
      :border="button || border"
      :value="option.value"
      :disabled="disabled || option.disabled"
      :class="{ '-disabled': disabled || option.disabled }"
    >
      <div class="radio-content">
        <slot :name="`option-${option.value}`">
          {{ option.label || ' ' }}
        </slot>
        <span v-if="option.optionalLabel" class="optional-label">
          {{ option.optionalLabel }}
        </span>
        <u-info v-if="option.info" placement="right">
          <div v-html="option.info" />
        </u-info>
        <div v-if="option.description" class="description">
          {{ option.description }}
        </div>
      </div>
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import type { PropType } from 'vue';
  import { UInfo } from '@/modules/common';
  import { ElRadio, ElRadioGroup } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: [String, Number, Date, Array, Boolean],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'row',
      validator: (value: string) =>
        ['row', 'column', 'column-reverse', 'row-reverse'].includes(value),
    },
    button: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const input = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (val: any) => {
      input.value = val;
    }
  );

  onMounted(() => {
    input.value =
      props.modelValue || props.modelValue === false ? props.modelValue : null;
  });

  function handleChange() {
    emit('update:modelValue', input.value);
    emit('change', input.value);
  }
</script>

<style lang="scss">
  .u-radio {
    &.-vertical {
      &.el-radio-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
    &.-button {
      &.el-radio-group {
        display: flex;

        .el-radio {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          box-shadow: 0 1px 4px 0 rgba(47, 50, 76, 0.14);
          background-color: var(--color-background-white);
          padding: 0 25px;
          min-height: 40px;
          text-align: center;

          &:hover:not(.is-checked) {
            filter: none;
            background-color: var(--color-neutral-100);
          }
          &:focus {
            border: 1px solid var(--color-green-500);
          }
          &.is-checked {
            border: 1px solid var(--color-primary-500);
            background-color: var(--color-primary-500);
            .el-radio__label {
              color: var(--color-white);
            }
          }

          .el-radio__inner {
            display: none;
          }
          .el-radio__label {
            padding-left: 0;
            font-weight: 700;
            span {
              font-size: var(--paragraph-03);
            }
          }
          &.-disabled {
            &:not(.is-checked) {
              border: none;
              box-shadow: none;
              background: var(--color-input-disabled-background);
              color: var(--color-input-disabled-border);
            }
          }
        }
      }
    }
    .el-radio {
      display: flex;
      align-items: center;
      padding: 10px 15px 0 10px;
      min-width: 75px;
      min-height: 36px;
      & + .el-radio.is-bordered {
        margin-left: 0;
      }
      span.optional-label {
        color: var(--color-neutral-500);
        font-style: italic;
      }
      .el-radio__label {
        font-size: var(--paragraph-02);
      }
      .description {
        font-size: var(--paragraph-03);
        font-weight: 500;
      }
      &:hover {
        .el-radio__inner {
          border-color: var(--color-primary-500);
        }
      }
      &:focus {
        .el-radio__inner {
          border-color: var(--color-primary-500);
          outline: 2px solid var(--color-primary-100);
        }
      }
      &.is-bordered {
        border-color: var(--color-input-border);
        &.is-checked {
          border-color: var(--color-primary-500);
        }
        &:focus {
          border-color: var(--color-primary-500);
          outline: 3px solid var(--color-primary-100);
        }
      }
    }
    .el-radio__input.is-checked + .el-radio__label {
      color: var(--color-neutral-800);
    }
    .el-radio--small.is-bordered .el-radio__label {
      font-size: var(--paragraph-02);
    }
  }
</style>
