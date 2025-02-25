<template>
  <div class="u-filter-item-bool">
    <p class="prompt">
      {{ config.prompt }}
    </p>
    <u-radio
      v-model="internalValue"
      border
      :options="enumOptions"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
  import URadio from '@/commons/forms/URadio.vue';
  import { computed, ref, watch, onMounted } from 'vue';
  import { formatBool } from '@/libs/utils/String';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const internalValue = ref(props.modelValue);

  const enumOptions = computed(() => [
    { value: true, label: props.config.trueLabel },
    { value: false, label: props.config.falseLabel },
  ]);

  const getFormattedValue = (
    value: boolean,
    config: { trueLabel: string; falseLabel: string }
  ): string => {
    return formatBool(value, config);
  };

  watch(
    () => props.modelValue,
    (val) => {
      internalValue.value = val;
    }
  );

  onMounted(() => {
    internalValue.value = props.modelValue;
    if (
      props.config.hasOwnProperty('default') &&
      internalValue.value === null
    ) {
      internalValue.value = props.config.default;
      handleChange();
    }
  });

  const handleChange = () => {
    emit('update:modelValue', internalValue.value);
    emit('change', internalValue.value);
  };
</script>

<style lang="scss">
  .u-filter-item-bool {
    .prompt {
      margin-bottom: 16px;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-03);
    }
  }
</style>
