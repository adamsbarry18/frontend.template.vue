<template>
  <div class="u-filter-item-numberrange">
    <p class="prompt">
      <span>{{ $t('commons.filter.number-range.prompt') }}</span>
      <span class="defaults-button" @click="onReset">
        {{ $t('commons.form.reset-defaults') }}
      </span>
    </p>
    <div
      v-if="internalInput && internalInput.length === 2"
      class="input-wrapper"
    >
      <u-number-input
        v-model="internalInput[0]"
        :min="min"
        :max="internalInput[1]"
        :step="1"
        @change="handleChange"
      />
      <span class="separator"> - </span>
      <u-number-input
        v-model="internalInput[1]"
        :min="internalInput[0]"
        :max="max"
        :step="1"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import UNumberInput from '@/commons/forms/UNumberInput.vue';
  import { ref, computed, watch, PropType } from 'vue';
  import { formatNumberRange } from '@/libs/utils/String';

  const props = defineProps({
    modelValue: {
      type: Array as PropType<number[]>,
    },
    config: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(['update:value', 'change']);

  const internalInput = ref(props.modelValue);

  const min = computed(() => props.config.min ?? null);
  const defaultMin = computed(() => props.config.defaultMin ?? null);
  const max = computed(() => props.config.max ?? null);
  const defaultMax = computed(() => props.config.defaultMax ?? null);

  watch(
    () => props.modelValue,
    (val) => {
      internalInput.value = val;
    },
    { immediate: true }
  );

  watch(
    internalInput,
    (val) => {
      if (val && val.length === 2) {
        emit('update:value', val);
        emit('change', val);
      }
    },
    { deep: true }
  );

  function handleChange() {
    emit('update:value', internalInput.value);
    emit('change', internalInput.value);
  }

  function onReset() {
    internalInput.value = [defaultMin.value, defaultMax.value];
    handleChange();
  }

  function getFormattedValue(
    value: [number | null, number | null],
    config: any
  ) {
    return formatNumberRange(value, config);
  }
</script>

<style lang="scss">
  .u-filter-item-numberrange {
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

    .input-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .u-number-input {
        width: 170px;
      }
    }
  }
</style>
