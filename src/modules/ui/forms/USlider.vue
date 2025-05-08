<template>
  <div class="u-slider">
    <el-slider
      v-model="input"
      :marks="marks"
      :min="min"
      :max="max"
      :format-tooltip="formatTooltip"
      :disabled="disabled"
      tooltip-class="u-slider-tooltip"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, Ref } from 'vue';
  import { ElSlider } from 'element-plus';

  const props = defineProps({
    modelValue: {
      required: true,
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

  const emit = defineEmits(['update:modelValue', 'change']);

  const input = computed({
    get() {
      return props.modelValue;
    },
    set(val: number | number[]) {
      emit('update:modelValue', Array.isArray(val) ? val[0] : val);
    },
  }) as Ref<number | number[]>;
  const formatTooltip = (value: number): string => {
    return `${value}%`;
  };
  const marks = computed(() => ({
    [props.min]: formatTooltip(props.min),
    [props.max]: formatTooltip(props.max),
  }));
  const onChange = (val: number | number[]) => {
    if (Array.isArray(val)) {
      emit('change', val[0]);
    } else {
      emit('change', val);
    }
  };
</script>

<style lang="scss">
  .u-slider {
    padding: 0 12px 8px 12px;
  }

  .u-slider-tooltip {
    border: 1px solid var(--color-neutral-100);
    box-shadow: var(--box-shadow-l);
    background-color: var(--color-white) !important;
    font-size: var(--paragraph-03);

    &[x-placement^='bottom'] .popper__arrow {
      border-bottom-color: var(--color-neutral-100);
      &::after {
        border-bottom-color: var(--color-white);
      }
    }
    &[x-placement^='top'] .popper__arrow {
      border-top-color: var(--color-neutral-100);
      &::after {
        border-top-color: var(--color-white);
      }
    }
  }
</style>
