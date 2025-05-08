<template>
  <div ref="buttonRef" class="u-filter-item" :class="{ '-unset': !isSet, '-active': active }">
    <div class="filter-label" @click="displayPopper">
      <b>{{ config.label }}:&nbsp;</b>
      <span>{{ formattedValue }}</span>
    </div>
    <div class="expand-button" @click="displayPopper">
      <icon-base icon="icon-arrow" :size="14" color="var(--color-neutral-700)" />
    </div>
    <div class="close-button -button-like" @click.stop="onRemove">
      <icon-base icon="icon-close" :size="9" color="var(--color-neutral-700)" />
    </div>
    <u-popper v-model:visible="visible" placement="bottom-start">
      <div class="u-filter-item-popper" :class="config.type ? '-' + config.type : '-unknown'">
        <component :is="componentsMap[config.type]" v-model="input" :config="config" @change="handleChange" />
      </div>
    </u-popper>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import i18n from '@/i18n';
  import {
    UFilterItemDatePicker,
    UPopper,
    IconBase,
    UFilterItemNumberrange,
    UFilterItemEnum,
    UfilterItemBool,
  } from '@/modules/ui';

  interface ConfigType {
    label: string;
    type: string;
    [key: string]: any;
  }

  // Define formatting functions
  function formatBool(value: any, config: ConfigType): string {
    if (value === true) return config.trueLabel || 'Yes';
    if (value === false) return config.falseLabel || 'No';
    return 'Unknown';
  }

  function formatEnum(value: any, config: ConfigType): string {
    const option = config.options?.find((opt: { value: any; label: string }) => opt.value === value);
    return option ? option.label : String(value);
  }

  function formatNumberRange(value: any, config: ConfigType): string {
    if (Array.isArray(value) && value.length === 2) {
      return `${value[0]} - ${value[1]} ${config.unit || ''}`.trim();
    }
    return String(value);
  }

  function formatDateRange(value: any): string {
    if (Array.isArray(value) && value.length === 2) {
      const start = value[0] instanceof Date ? value[0].toLocaleDateString() : String(value[0]);
      const end = value[1] instanceof Date ? value[1].toLocaleDateString() : String(value[1]);
      return `${start} - ${end}`;
    }
    return String(value);
  }

  // Map filter types to formatting functions
  interface FormatValueMap {
    bool: (value: any, config: ConfigType) => string;
    enum: (value: any, config: ConfigType) => string;
    numberrange: (value: any, config: ConfigType) => string;
    daterange: (value: any) => string;
  }

  const formatValue: FormatValueMap = {
    bool: formatBool,
    enum: formatEnum,
    numberrange: formatNumberRange,
    daterange: formatDateRange,
  };

  const props = defineProps({
    modelValue: {
      type: [Array, Number, String, Object, Boolean, Date, null],
      default: () => [],
    },
    config: {
      type: Object as () => ConfigType,
      required: true,
    },
  });

  const emit = defineEmits<{
    (e: 'input', value: any): void;
    (e: 'change', value: any): void;
    (e: 'remove'): void;
  }>();

  const input = ref(props.modelValue);
  const visible = ref(false);
  const active = ref(false);

  watch(
    () => props.modelValue,
    (newVal) => {
      input.value = newVal;
    }
  );

  const isSet = computed(() => {
    if (Array.isArray(input.value) && input.value.length === 0) return false;
    return input.value || input.value === false;
  });

  // Component mapping remains unchanged
  const componentsMap: Record<string, any> = {
    bool: UfilterItemBool,
    enum: UFilterItemEnum,
    numberrange: UFilterItemNumberrange,
    daterange: UFilterItemDatePicker,
  };

  // Updated formattedValue computation
  const formattedValue = computed(() => {
    if (input.value == null) {
      return i18n.global.t('commons.filter-no-value');
    }
    const formatter = formatValue[props.config.type as keyof FormatValueMap];
    if (typeof formatter === 'function') {
      return formatter(input.value, props.config);
    } else {
      console.warn(`No formatter found for type: ${props.config.type}`);
      return String(input.value);
    }
  });

  function handleChange() {
    emit('input', input.value);
    emit('change', input.value);
  }

  const buttonRef = ref<HTMLElement>();

  function displayPopper() {
    if (!active.value) {
      active.value = true;
      visible.value = true;
    }
  }

  function onRemove() {
    emit('remove');
  }

  watch(visible, (val) => {
    if (!val) active.value = false;
  });
</script>

<style lang="scss" scoped>
  .u-filter-item {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-input-border);
    border-radius: 4px;
    width: fit-content;
    height: 42px;
    &:hover {
      border-color: var(--color-input-border-hover);
    }
    &.-unset {
      border-color: var(--color-neutral-500);
      .filter-label,
      .expand-button {
        background-color: var(--color-neutral-100);
      }
      .close-button {
        border-color: transparent transparent transparent var(--color-neutral-700);
      }
    }
    &.-active {
      outline: 3px solid var(--color-input-outline-focus);
      .close-button {
        border-color: transparent transparent transparent var(--color-neutral-700);
      }
    }
    .filter-label {
      display: flex;
      align-items: center;
      border-radius: 3px 0 0 3px;
      background-color: var(--color-white);
      cursor: pointer;
      padding: 8px 12px;
    }
    .expand-button {
      display: flex;
      align-items: center;
      background-color: var(--color-white);
      cursor: pointer;
      padding: 0 8px;
      height: 100%;
      svg {
        transform: rotate(90deg);
      }
    }
    .close-button {
      display: flex;
      align-items: center;
      border-left: 1px solid var(--color-input-border);
      border-radius: 0 4px 4px 0;
      padding: 0 12px;
      height: 100%;
    }
  }

  .u-filter-item-popper {
    &.-numberrange {
      width: 450px;
    }
    &.-daterange {
      width: 500px;
    }
    &.-enum {
      padding: 0;
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
