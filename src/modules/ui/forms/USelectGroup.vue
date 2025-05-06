<template>
  <el-select
    v-model="localValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :automatic-dropdown="automaticDropdown"
    :filterable="filterable"
    :multiple="multiple"
    :class="[
      'u-select-group',
      { '-icon-prefix': iconPrefix !== null, '-disabled': disabled },
    ]"
    :popper-class="popperClass"
    :clearable="clearable"
    @change="handleChange"
    @blur="handleBlur"
    @visible-change="handleVisibleChange"
    ref="selectRef"
  >
    <template v-if="iconPrefix" #prefix>
      <icon-base
        :icon="iconPrefix"
        class="prefix-icon"
        color="var(--color-neutral-800)"
        :size="20"
      />
    </template>

    <template v-if="groupBy === ''">
      <el-option
        v-for="item in options"
        :key="String(item.key ?? item.value)"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
        <u-tooltip v-if="item.tooltip" placement="top">
          <span class="u-select-group-option" :title="item.label">
            <icon-base
              v-if="item.icon"
              :icon="item.icon"
              class="option-icon"
              :color="item.color ?? 'var(--color-neutral-800)'"
              :size="20"
            />
            <span class="option-label -text-ellipsis">
              {{ item.label }}
            </span>
            <span v-if="item.suffix" class="option-suffix -text-ellipsis">
              {{ item.suffix }}
            </span>
          </span>
          <template #content>
            <p>{{ item.tooltip }}</p>
          </template>
        </u-tooltip>
      </el-option>
    </template>

    <template v-else>
      <el-option-group
        v-for="(group, label) in groupedOptions"
        :key="label"
        :label="withGroupLabel ? label : null"
      >
        <el-option
          v-for="item in group"
          :key="String(item.key ?? item.value)"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        >
          <u-tooltip v-if="item.tooltip" placement="top">
            <span class="u-select-group-option" :title="item.label">
              <icon-base
                v-if="item.icon"
                :icon="item.icon"
                class="option-icon"
                :color="item.color ?? 'var(--color-neutral-800)'"
                :size="20"
              />
              <span class="option-label -text-ellipsis">
                {{ item.label }}
              </span>
            </span>
            <template #content>
              <p>{{ item.tooltip }}</p>
            </template>
          </u-tooltip>
        </el-option>
      </el-option-group>
    </template>
  </el-select>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
    type PropType,
  } from 'vue';
  import { groupBy as _groupBy } from '@/libs/utils/Array';
  import { isObject } from '@/libs/utils/Object';
  import { ElSelect, ElOption, ElOptionGroup } from 'element-plus';
  import { IconBase, UTooltip } from '@/modules/ui';

  // Props
  const props = defineProps({
    modelValue: {
      type: [String, Number, Object, Array],
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
    automaticDropdown: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    focusOnMount: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    groupBy: {
      type: String,
      default: '',
    },
    withGroupLabel: {
      type: Boolean,
      default: true,
    },
    popperClass: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    fallbackLabel: {
      type: String,
      default: null,
    },
  });

  // Emits
  const emit = defineEmits([
    'update:modelValue',
    'change',
    'blur',
    'visible-change',
  ]);

  // Refs
  const localValue = ref(props.modelValue);
  const selectRef = ref(null);

  // Computed
  const groupedOptions = computed(() => {
    if (!props.groupBy) {
      return {};
    }
    return _groupBy(props.options, props.groupBy);
  });

  const selectedOption = computed(() => {
    return props.options.find((o) => {
      if (isObject(localValue.value)) {
        return (o.value as any)?.value === (localValue.value as any)?.value;
      }
      return o.value === localValue.value;
    });
  });

  const iconPrefix = computed(() => {
    return selectedOption.value?.icon ?? null;
  });

  // Watchers
  watch(
    () => props.modelValue,
    (newValue) => {
      localValue.value = newValue;
      if (props.fallbackLabel && !selectedOption.value && localValue.value) {
        localValue.value = props.fallbackLabel;
      }
    }
  );

  watch(
    () => props.options,
    () => {
      if (props.fallbackLabel && !selectedOption.value && localValue.value) {
        localValue.value = props.fallbackLabel;
      }
    },
    { deep: true }
  );

  // Lifecycle Hooks
  onMounted(() => {
    localValue.value = props.modelValue ?? null;
    if (props.fallbackLabel && !selectedOption.value && localValue.value) {
      localValue.value = props.fallbackLabel;
    }
    if (props.focusOnMount) {
      focus();
    }
    if (props.clearable) {
      nextTick(() => {
        const select = selectRef.value;
        if (select) {
          select.inputHovering = true;
          const selectInputEl = select.$el.querySelector('input');
          if (selectInputEl) {
            selectInputEl.addEventListener(
              'mouseenter',
              stopEventPropagation,
              true
            );
            selectInputEl.addEventListener(
              'mouseleave',
              stopEventPropagation,
              true
            );
          }
        }
      });
    }
  });

  onBeforeUnmount(() => {
    if (props.clearable) {
      const select = selectRef.value;
      if (select) {
        const selectInputEl = select.$el.querySelector('input');
        if (selectInputEl) {
          selectInputEl.removeEventListener(
            'mouseenter',
            stopEventPropagation,
            true
          );
          selectInputEl.removeEventListener(
            'mouseleave',
            stopEventPropagation,
            true
          );
        }
      }
    }
  });

  const stopEventPropagation = (event: Event) => {
    event.stopPropagation();
  };

  const focus = () => {
    selectRef.value?.focus();
  };

  const handleChange = (value: any) => {
    emit('update:modelValue', value);
    emit('change', value);
  };

  const handleBlur = () => {
    emit('blur');
  };

  const handleVisibleChange = (event: any) => {
    emit('visible-change', event);
  };
</script>

<style lang="scss">
  .el-select-dropdown__item {
    &:focus:not(:active) {
      background-color: transparent !important;
    }
    &:hover:not(:active) {
      background-color: var(--color-neutral-100);
    }
    &:hover {
      background-color: var(--color-neutral-100);
    }
    &.selected {
      background: var(--color-neutral-100);
    }

    .u-select-group-option {
      height: 100%;
      display: flex;
      align-items: center;
      line-height: inherit;
      .option-icon {
        margin-right: 8px;
      }
      .option-label {
        display: block;
        max-width: 400px;
      }

      .option-suffix {
        margin-left: 4px;
        font-size: var(--paragraph-03);
        color: var(--color-neutral-600);
      }
    }
    &.is-disabled span {
      color: var(--color-neutral-300);
    }
  }

  .el-scrollbar {
    &__bar.is-vertical {
      border-radius: 5px;
      background-color: transparent;
      width: 6px;
    }
  }

  .u-select-group {
    .el-select__wrapper {
      background-color: var(--color-white);
      box-shadow: 0 0 0 1px var(--color-input-border);
      border-radius: 4px;
    }
    &.-no-border {
      .el-input__inner {
        border: none;
      }
    }
    &:hover:not(.-disabled) {
      border-radius: 4px;
      background-color: var(--color-white);
    }

    &.-disabled {
      background-color: var(--color-input-disabled-background);
      border-color: var(--color-input-disabled-border);
      color: var(--color-input-disabled-content);
      cursor: not-allowed;
      .el-input__inner {
        background-color: var(--color-input-disabled-background);
        cursor: not-allowed;
        color: var(--color-input-disabled-content);
      }
    }

    &.-icon-prefix {
      .el-input__inner {
        padding-left: 36px;
      }
      .el-input__prefix {
        display: flex;
        left: 12px;
        align-items: center;
        justify-content: center;
      }
    }

    .el-select__tags {
      .el-tag {
        background-color: var(--color-neutral-800);
        border: 1px solid var(--color-input-border);
        padding: 4px 12px 2px 12px;
        border-radius: 16px;
        border-color: var(--color-neutral-800);
        height: 28px;
        .el-select__tags-text {
          font-size: var(--caption);
          font-weight: 700;
          color: var(--color-neutral-100);
        }
        .el-icon-close {
          font-size: 18px;
          color: var(--color-neutral-100);
          font-weight: 900;
          background: transparent;
        }
      }
    }

    .el-input__inner {
      border: 1px solid var(--color-input-border);
      padding: 0 30px 0 12px;
      height: 40px;
      text-overflow: ellipsis;
      font-size: var(--paragraph-02);
      color: var(--color-neutral-800);
      &:hover {
        border-color: var(--color-input-border-hover);
      }
      &:focus {
        outline: 3px solid var(--color-input-outline-focus);
        border-color: var(--color-input-border);
      }
    }

    .el-input .el-input__suffix .el-input__suffix-inner {
      display: flex;
      flex-direction: row-reverse;
      height: inherit;

      .el-select__caret {
        display: inline-block !important;
      }
    }

    &.el-select .el-input .el-select__caret {
      transform: rotateZ(-180deg);
      color: var(--color-neutral-800);
      font-size: var(--paragraph-02);
      &.is-reverse {
        transform: rotateZ(0deg);
      }
    }
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: var(--color-input-border);
  }
</style>
