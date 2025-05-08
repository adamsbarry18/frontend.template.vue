<template>
  <div class="u-filter-item-daterange">
    <p class="prompt">
      <span>{{ $t('commons.filter.date-range.prompt') }}</span>
      <span class="defaults-button" @click="onReset">{{ $t('commons.form.reset-defaults') }}</span>
    </p>
    <div class="daterange-wrapper">
      <div class="date-input">
        <span>{{ $t('commons.date-picker.default-start-placeholder') }}</span>
        <u-date-picker
          v-model="internalValue[0]"
          type="date"
          :shortcuts="config.hasOwnProperty('shortcuts') ? config.shortcuts : ''"
          @change="handleChange(0)"
        />
      </div>
      <span class="date-separator">-</span>
      <div class="date-input">
        <span>{{ $t('commons.date-picker.default-end-placeholder') }}</span>
        <u-date-picker
          v-model="internalValue[1]"
          type="date"
          :shortcuts="config.hasOwnProperty('shortcuts') ? config.shortcuts : ''"
          @change="handleChange(1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import dayjs from 'dayjs';

  import UDatePicker from '@/modules/ui/forms/UDatePicker.vue';
  import type { PropType } from 'vue';
  import { formatDateRange } from '@/libs/utils/String';

  const props = defineProps({
    modelValue: {
      type: Array as PropType<any[] | null>,
      default: null,
    },
    config: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const defaultStartValue = computed(() => {
    return props.config.hasOwnProperty('defaultStart') ? props.config.defaultStart : null;
  });

  const defaultEndValue = computed(() => {
    return props.config.hasOwnProperty('defaultEnd') ? props.config.defaultEnd : null;
  });

  const internalValue = ref<(Date | null)[]>(
    Array.isArray(props.modelValue) && props.modelValue.length === 2
      ? props.modelValue
      : [defaultStartValue.value, defaultEndValue.value]
  );

  watch(
    () => [props.modelValue, internalValue.value],
    ([newModelValue, newInternalValue]) => {
      // Ensure internalValue always holds an array
      if (Array.isArray(newModelValue) && newModelValue.length === 2) {
        if (newModelValue !== newInternalValue) {
          internalValue.value = newModelValue;
        }
      } else if (newModelValue === null && internalValue.value !== null) {
        // If modelValue becomes null, reset internalValue to default
        internalValue.value = [defaultStartValue.value, defaultEndValue.value];
      }

      // Emit changes only if internalValue differs from modelValue
      // This comparison needs to handle null vs array carefully
      const modelValueIsArray = Array.isArray(props.modelValue);
      const internalValueIsDefault =
        internalValue.value[0] === defaultStartValue.value &&
        internalValue.value[1] === defaultEndValue.value;

      if (modelValueIsArray && props.modelValue !== internalValue.value) {
        emit('update:value', internalValue.value);
        emit('change', internalValue.value);
      } else if (!modelValueIsArray && !internalValueIsDefault) {
        // If modelValue is null, only emit if internalValue is not the default
        emit('update:value', internalValue.value);
        emit('change', internalValue.value);
      }
    },
    { deep: true }
  );

  const handleChange = (index: number = -1) => {
    if (internalValue.value) {
      // Check bounds consistency
      const startDate = internalValue.value[0];
      const endDate = internalValue.value[1];

      if (startDate instanceof Date && endDate instanceof Date) {
        if (index === 0 && startDate > endDate) {
          internalValue.value[1] = null;
        }
        if (index === 1 && endDate < startDate) {
          internalValue.value[0] = null;
        }
      }

      if (internalValue.value[0] !== null) {
        internalValue.value[0] = dayjs(internalValue.value[0]).startOf('day').toDate();
      }
      if (internalValue.value[1] !== null) {
        internalValue.value[1] = dayjs(internalValue.value[1]).endOf('day').toDate();
      }
    }
  };

  const onReset = () => {
    internalValue.value = [defaultStartValue.value, defaultEndValue.value];
    handleChange();
  };

  const getFormattedValue = (value: Date[] | null): string => {
    if (Array.isArray(value) && value.length === 2) {
      return formatDateRange([value[0], value[1]]);
    }
    return ''; // Retourne une chaîne vide si la valeur n'est pas un tuple valide
  };

  defineExpose({
    getFormattedValue,
  });
</script>

<style lang="scss">
  .u-filter-item-daterange {
    display: flex;
    flex-direction: column;

    .prompt {
      display: flex;
      margin-bottom: 16px;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-03);
      .defaults-button {
        margin-left: auto;
        cursor: pointer;
        text-decoration: underline;
        font-weight: 500;
      }
    }

    .daterange-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .date-input {
        width: 180px;
        .el-date-editor.el-input {
          width: 180px;
        }
      }
      .date-separator {
        margin-top: 15px;
      }
    }
  }
</style>
