<template>
  <el-date-picker
    ref="datepicker"
    :model-value="input ?? undefined"
    :default-value="defaultValueForPicker"
    class="u-date-picker"
    :class="datepickerClass"
    :placeholder="placeholder || $t('commons.date-picker.default-placeholder')"
    :start-placeholder="startPlaceholder || $t('commons.date-picker.default-start-placeholder')"
    :end-placeholder="endPlaceholder || $t('commons.date-picker.default-end-placeholder')"
    :format="format || defaultFormat"
    :disabled="disabled"
    :type="type"
    :default-time="defaultTime"
    :clearable="clearable"
    :shortcuts="computedShortcuts"
    :disabled-date="disabledDate"
    :first-day-of-week="firstDayOfWeek"
    :popper-class="popperClass"
    @update:model-value="handleElDatePickerUpdate"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { ElDatePicker } from 'element-plus';
  import dayjs from 'dayjs';
  import i18n from '@/i18n';
  import { getDateFormatByLang, getDateTimeFormatByLang } from '@/libs/utils/Date';

  interface DatePickerShortcut {
    text: string;
    value?: () => Date | Date[];
    onClick?: (picker: any) => void;
  }

  interface Props {
    modelValue?: Date | [Date, Date] | null;
    placeholder?: string;
    format?: string;
    type?: 'date' | 'datetime' | 'daterange' | 'datetimerange';
    defaultTime?: [Date, Date] | Date;
    startPlaceholder?: string;
    endPlaceholder?: string;
    shortcuts?: '' | 'future' | 'past' | 'around';
    customShortcuts?: DatePickerShortcut[];
    disabled?: boolean;
    disabledDate?: () => void;
    clearable?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'date',
    disabled: false,
    clearable: true,
    shortcuts: 'future',
    modelValue: null,
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Date | [Date, Date] | null): void;
    (e: 'change', value: Date | [Date, Date] | null): void;
    (e: 'blur', value: Date | [Date, Date] | null): void;
    (e: 'pick-shortcut', key: string): void;
  }>();

  const input = ref<Date | [Date, Date] | null>(null);

  const datepickerClass = computed(() => ({
    '-disabled': props.disabled,
    '-range': ['daterange', 'datetimerange'].includes(props.type!),
  }));

  // Default value for the picker calendar view when modelValue is initially null
  const defaultValueForPicker = computed(() => {
    if (props.type === 'date' || props.type === 'datetime') {
      return new Date();
    }
    if (props.type === 'daterange' || props.type === 'datetimerange') {
      return new Date();
    }
    return undefined;
  });

  const defaultFormat = computed(() =>
    ['datetime', 'datetimerange'].includes(props.type!)
      ? getDateTimeFormatByLang(i18n.global.locale.value)
      : getDateFormatByLang(i18n.global.locale.value)
  );

  const firstDayOfWeek = computed(() => (i18n.global.locale.value === 'fr' ? 1 : 7));

  const popperClass = computed(() => {
    const classes = ['u-date-picker-popper', 'no-close-trigger'];
    if (props.shortcuts) classes.push('-shortcuts');
    return classes.join(' ');
  });

  const onPickShortcut = (key: string) => {
    emit('pick-shortcut', key);
  };

  const generateRangeShortcuts = (shortcuts: Record<string, { range: number; modifier?: number }>) => {
    return Object.keys(shortcuts).map((key) => {
      const { range, modifier } = shortcuts[key];
      const computedModifier = modifier !== undefined ? modifier : shortcutModifier.value;
      return {
        text: i18n.global.t(`commons.date-picker.shortcut.${props.shortcuts}.${key}`),
        onClick: (picker: any) => {
          const date = dayjs();
          const targetDate = dayjs().add(computedModifier * range, 'millisecond');

          // For ranges, ensure we're using dayjs objects
          if (computedModifier < 0) {
            picker.emit('pick', [targetDate, date]);
          } else {
            picker.emit('pick', [date, targetDate]);
          }
          onPickShortcut(key);
        },
      };
    });
  };

  const shortcutModifier = computed(() => {
    return props.shortcuts === 'past' ? -1 : 1;
  });

  const selectedShortcuts = computed(() => {
    if (props.type === 'daterange' || props.type === 'datetimerange') {
      if (props.shortcuts === 'around') {
        return dateRangeAroundShortcuts.value;
      }
      return dateRangeShortcuts.value;
    }
    return datePickerShortcuts.value;
  });

  const datePickerShortcuts = computed(() => {
    const shortcuts: Record<string, { range: number; modifier?: number }> = {
      today: { range: 0 },
      '1-day.single': { range: 3600 * 1000 * 24 },
      '7_last_days.single': { range: 3600 * 1000 * 24 * 7 },
      '30_last_days.single': { range: 3600 * 1000 * 24 * 30 },
      '90_last_days.single': { range: 3600 * 1000 * 24 * 90 },
      '180_last_days.single': { range: 3600 * 1000 * 24 * 180 },
      '365_last_days.single': { range: 3600 * 1000 * 24 * 365 },
    };
    const modifier = shortcutModifier.value;
    const shortcutLabel = props.shortcuts;

    return Object.keys(shortcuts).map((key) => ({
      text: i18n.global.t(`commons.date-picker.shortcut.${shortcutLabel}.${key}`),
      onClick: (picker: any) => {
        const date = dayjs().add(modifier * shortcuts[key].range, 'millisecond');
        picker.emit('pick', date);
        onPickShortcut(key);
      },
    }));
  });

  const dateRangeShortcuts = computed(() => {
    const shortcuts = {
      '1-day.range': {
        range: 3600 * 1000 * 24,
        modifier: 1,
      },
      '7_last_days.range': {
        range: 3600 * 1000 * 24 * 7,
        modifier: 1,
      },
      '30_last_days.range': {
        range: 3600 * 1000 * 24 * 30,
        modifier: 1,
      },
      '90_last_days.range': {
        range: 3600 * 1000 * 24 * 90,
        modifier: 1,
      },
      '180_last_days.range': {
        range: 3600 * 1000 * 24 * 180,
        modifier: 1,
      },
      '365_last_days.range': {
        range: 3600 * 1000 * 24 * 365,
        modifier: 1,
      },
    };
    return generateRangeShortcuts(shortcuts);
  });

  const dateRangeAroundShortcuts = computed(() => {
    const shortcuts = {
      '6_last_months.range': {
        range: 3600 * 1000 * 24 * 185,
        modifier: -1,
      },
      '3_last_months.range': {
        range: 3600 * 1000 * 24 * 95,
        modifier: -1,
      },
      '1-day.range': {
        range: 3600 * 1000 * 24,
      },
      '3_next_months.range': {
        range: 3600 * 1000 * 24 * 95,
        modifier: 1,
      },
      '6_next_months.range': {
        range: 3600 * 1000 * 24 * 185,
        modifier: 1,
      },
    };
    return generateRangeShortcuts(shortcuts);
  });

  const computedShortcuts = computed(() => {
    if (props.customShortcuts) return props.customShortcuts;
    if (props.shortcuts) return selectedShortcuts.value;
    return [];
  });

  // Ensures the input value is always a Date object, a [Date, Date] tuple, or null
  const formatInput = (value: Date | [Date, Date] | null): Date | [Date, Date] | null => {
    if (value === null) {
      return null;
    }

    if (props.type === 'datetimerange' || props.type === 'daterange') {
      if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
        const date1 = value[0] instanceof Date ? value[0] : new Date(value[0]);
        const date2 = value[1] instanceof Date ? value[1] : new Date(value[1]);
        return [date1, date2];
      }
      return null;
    }

    if (Array.isArray(value)) {
      console.warn('UDatePicker received an array for a non-range type. Using the first element.');
      const firstVal = value[0];
      return firstVal ? (firstVal instanceof Date ? firstVal : new Date(firstVal)) : null;
    }
    return value instanceof Date ? value : new Date(value);
  };

  // Handles the @update:model-value event from el-date-picker
  const handleElDatePickerUpdate = (value: Date | [Date, Date] | null) => {
    const formattedValue = formatInput(value);
    if (formattedValue !== input.value) {
      input.value = formattedValue;
      emit('update:modelValue', formattedValue);
      emit('change', formattedValue);
    } else if (value === null && input.value !== null) {
      input.value = null;
      emit('update:modelValue', null);
      emit('change', null);
    }
  };

  const onBlur = () => {
    emit('blur', input.value);
  };

  watch(
    () => props.modelValue,
    (val) => {
      input.value = formatInput(val);
    },
    { immediate: true }
  );
</script>

<style lang="scss">
  .u-date-picker {
    width: 100%;
    max-width: 320px;
    cursor: pointer;
    font-size: var(--paragraph-03);

    &.-range {
      max-width: 400px;
    }
  }

  .el-date-editor.u-date-picker {
    .el-input__wrapper {
      background-color: var(--color-white);
      box-shadow: 0 0 0 1px var(--color-input-border);
      border-radius: 4px;
      padding: 0 12px;
      height: 35px;

      &:hover {
        box-shadow: 0 0 0 1px var(--color-input-border-hover);
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--color-primary-500);
        outline: 3px solid var(--color-input-outline-focus);
      }
    }

    .el-input__inner {
      height: 100%;
      font-size: var(--paragraph-03);
      color: var(--color-neutral-900);

      &::placeholder {
        color: var(--color-neutral-500);
      }
    }
  }

  .el-date-editor.u-date-picker.el-range-editor {
    background-color: var(--color-white);
    box-shadow: 0 0 0 1px var(--color-input-border);
    border-radius: 4px;
    padding: 0 12px;
    .el-range-input {
      font-size: var(--paragraph-03);
      color: var(--color-neutral-900);

      &::placeholder {
        color: var(--color-neutral-500);
      }
    }

    .el-range-separator {
      color: var(--color-neutral-500);
      padding: 0 4px;
    }
  }

  .el-date-editor.u-date-picker.is-disabled {
    .el-input__wrapper {
      background-color: var(--color-input-disabled-background);
      box-shadow: 0 0 0 1px var(--color-input-disabled-border);
      cursor: not-allowed;

      &:hover {
        box-shadow: 0 0 0 1px var(--color-input-disabled-border);
      }
    }

    .el-input__inner,
    .el-range-input {
      color: var(--color-neutral-600);
      -webkit-text-fill-color: var(--color-neutral-600);
      cursor: not-allowed;
    }
  }

  .u-date-picker-popper {
    &.el-date-picker.has-sidebar {
      width: 488px;
    }

    .el-picker-panel__sidebar {
      width: 150px;
      padding: 0;
      border-right: 1px solid var(--color-neutral-200);

      .el-picker-panel__shortcut {
        padding: 8px 12px;
        font-size: var(--paragraph-03);
        color: var(--color-neutral-900);

        &:hover {
          background-color: var(--color-neutral-100);
        }
      }
    }

    .el-picker-panel__body {
      margin-left: 160px;
    }

    .el-date-table {
      th {
        font-weight: 600;
        color: var(--color-neutral-700);
      }

      td {
        &.today span {
          color: var(--color-primary-500);
          font-weight: 600;
        }

        &.current:not(.disabled) span {
          background-color: var(--color-primary-500);
          color: white;
          font-weight: 600;
        }

        &.available:hover span {
          background-color: var(--color-neutral-100);
        }

        &.start-date span,
        &.end-date span {
          background-color: var(--color-primary-500);
          color: var(--color-white);
        }

        &.today:not(.end-date) span {
          color: var(--color-primary-500);
        }
      }
    }
  }

  .el-picker-panel {
    .time-select-item.selected:not(.disabled) {
      color: var(--color-primary-500);
      background: var(--color-neutral-100);
    }
  }
</style>
