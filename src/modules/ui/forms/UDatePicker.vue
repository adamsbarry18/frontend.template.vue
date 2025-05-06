<template>
  <el-date-picker
    ref="datepicker"
    v-model="input"
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
    @change="onChange"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
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
    modelValue?: Date | Date[] | null;
    placeholder?: string;
    format?: string;
    type?: 'date' | 'datetime' | 'daterange' | 'datetimerange';
    defaultTime?: [Date, Date] | Date;
    startPlaceholder?: string;
    endPlaceholder?: string;
    shortcuts?: '' | 'future' | 'past' | 'around';
    customShortcuts?: DatePickerShortcut[];
    disabled?: boolean;
    // Replace the generic Function type with an explicit signature.
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
    (e: 'update:modelValue', value: Date | Date[] | null): void;
    (e: 'change', value: Date | Date[] | null): void;
    (e: 'blur', value: Date | Date[] | null): void;
    (e: 'pick-shortcut', key: string): void;
  }>();

  const input = ref<Date | Date[] | null>(props.modelValue);

  const datepickerClass = computed(() => ({
    '-disabled': props.disabled,
    '-range': ['daterange', 'datetimerange'].includes(props.type!),
  }));

  const getDefaultValue = computed(() => {
    const currentDate = dayjs();

    if (props.type === 'date' || props.type === 'datetime') {
      return currentDate.toDate();
    }

    if (props.type === 'daterange' || props.type === 'datetimerange') {
      return [currentDate.toDate(), currentDate.add(1, 'month').toDate()];
    }

    return null;
  });

  onMounted(() => {
    input.value = getDefaultValue.value;
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

  // Méthode appelée lors du clic sur un raccourci
  const onPickShortcut = (key: string) => {
    emit('pick-shortcut', key);
  };

  // Génère les raccourcis pour les plages de dates (daterange ou datetimerange)
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

  // Retourne le modificateur utilisé pour calculer la date en fonction du sens des raccourcis
  const shortcutModifier = computed(() => {
    return props.shortcuts === 'past' ? -1 : 1;
  });

  // Choisit le groupe de raccourcis à utiliser en fonction du type et de la valeur du prop shortcuts
  const selectedShortcuts = computed(() => {
    if (props.type === 'daterange' || props.type === 'datetimerange') {
      if (props.shortcuts === 'around') {
        return dateRangeAroundShortcuts.value;
      }
      return dateRangeShortcuts.value;
    }
    return datePickerShortcuts.value;
  });

  // Raccourcis pour un date-picker simple (type "date" ou "datetime")
  const datePickerShortcuts = computed(() => {
    const shortcuts = {
      today: 0,
      '1-day.single': 3600 * 1000 * 24,
      '7_last_days.single': 3600 * 1000 * 24 * 7,
      '30_last_days.single': 3600 * 1000 * 24 * 30,
      '90_last_days.single': 3600 * 1000 * 24 * 90,
      '180_last_days.single': 3600 * 1000 * 24 * 180,
      '365_last_days.single': 3600 * 1000 * 24 * 365,
    };
    const modifier = shortcutModifier.value;
    const shortcutLabel = props.shortcuts;

    return Object.keys(shortcuts).map((key) => ({
      text: i18n.global.t(`commons.date-picker.shortcut.${shortcutLabel}.${key}`),
      onClick: (picker: any) => {
        const date = dayjs().add(modifier * shortcuts[key], 'millisecond');
        picker.emit('pick', date);
        onPickShortcut(key);
      },
    }));
  });

  // Raccourcis pour une plage de dates (date range)
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

  // Raccourcis pour une plage "autour" de la date courante
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

  const formatInput = (value: Date | Date[] | null): Date | Date[] | null => {
    if (!value) {
      return null;
    }

    if (props.type === 'date' || props.type === 'datetime') {
      return new Date((value as Date).getTime());
    }

    if (props.type === 'daterange' && Array.isArray(value) && value.length === 2) {
      return [dayjs(value[0]).startOf('day').toDate(), dayjs(value[1]).endOf('day').toDate()];
    }

    if (props.type === 'datetimerange' && Array.isArray(value) && value.length === 2) {
      return [new Date(value[0].getTime()), new Date(value[1].getTime())];
    }

    return null;
  };

  const onChange = () => {
    const formattedInput = formatInput(input.value);
    input.value = formattedInput;
    emit('update:modelValue', formattedInput);
    emit('change', formattedInput);
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
