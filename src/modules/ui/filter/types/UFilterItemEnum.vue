<template>
  <u-radio
    v-if="config.singleValue"
    v-model="internalValue"
    class="u-filter-item-enum"
    direction="column"
    :options="config.options"
    @change="handleChange"
  />
  <u-checkbox-group
    v-else
    v-model="internalValue"
    :options="config.options"
    class="u-filter-item-enum"
    direction="column"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import UCheckboxGroup from '@/modules/ui/forms/UCheckboxGroup.vue';
  import URadio from '@/modules/ui/forms/URadio.vue';
  import i18n from '@/i18n';

  const props = defineProps({
    modelValue: {
      type: Array,
    },
    config: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const internalValue = ref<any>(null);

  watch(
    () => props.modelValue,
    (newValue) => {
      const filteredValue = newValue.filter((v) =>
        props.config.options.map((o) => o.value).includes(v)
      );
      internalValue.value = props.config.singleValue
        ? filteredValue.length > 0
          ? filteredValue[0]
          : null
        : filteredValue;
    },
    { immediate: true }
  );

  const handleChange = () => {
    emit(
      'update:value',
      props.config.singleValue ? internalValue.value : internalValue.value
    );
    emit(
      'change',
      props.config.singleValue ? internalValue.value : internalValue.value
    );
  };

  const getFormattedValue = (value, config) => {
    if (!value || value.length === 0) {
      return i18n.global.t('commons.filter-no-value');
    }
    const opt = config.options.find((opt) => opt.value === value[0]);
    const optLabel = opt
      ? opt.label
      : i18n.global.t('commons.filter-invalid-value');
    if (value.length === 1) {
      return optLabel;
    }
    return `${optLabel} (+${value.length - 1})`;
  };

  defineExpose({
    getFormattedValue,
  });
</script>

<style lang="scss">
  .u-filter-item-enum {
    padding: 5px 0;
    .option-button {
      &:hover {
        background-color: var(--color-neutral-100);
      }
    }
  }
</style>
