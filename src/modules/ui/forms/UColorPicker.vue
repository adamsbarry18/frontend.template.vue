<template>
  <div class="u-color-picker" :class="`-${colorBrightness}`">
    <el-color-picker
      v-model="selectedColor"
      :disabled="disabled"
      @change="(value: string | null) => handleChange(value!)"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElColorPicker } from 'element-plus';
  import { computed } from 'vue';
  import { getColorContrast } from '@/libs/utils/Color.js';

  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const selectedColor = computed({
    get: () => props.modelValue,
    set: (value: string) => {
      emit('update:modelValue', value);
    },
  });

  const colorBrightness = computed(() => getColorContrast(selectedColor.value));

  const handleChange = (value: string) => {
    emit('change', value);
  };
</script>

<style lang="scss" scoped>
  .u-color-picker {
    position: inherit;
    .el-color-picker {
      .el-color-picker__mask {
        border: none;
        border-radius: 50%;
      }

      .el-color-picker__trigger {
        border: none;
        border-radius: 50%;
        box-shadow: var(--box-shadow-s);
        background-color: white;
        padding: 2px;

        .el-color-picker__color {
          border: none;
          border-radius: 50%;

          .el-color-picker__color-inner {
            border: none;
            border-radius: 50%;
          }

          .el-color-picker__empty {
            transform: translate3d(-50%, -50%, 0);
          }
        }

        .el-color-picker__icon {
          transform: translate3d(-50%, -50%, 0);
          font-weight: 1000;
        }
      }
    }

    &.-dark {
      .el-color-picker__trigger {
        background-color: var(--border-input);

        .el-color-picker__icon {
          color: var(--color-neutral-800);
        }
      }
    }
  }
</style>
