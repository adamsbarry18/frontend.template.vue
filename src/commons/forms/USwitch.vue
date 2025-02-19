<template>
  <div class="u-switch" :class="{ '-active': modelValue }">
    <span
      v-if="displayBothLabels"
      class="false-label"
      :class="{ '-active': !modelValue }"
    >
      {{ falseLabel }}
    </span>
    <el-switch
      v-model="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <span v-if="!displayBothLabels" class="input-label">
      {{ modelValue ? trueLabel : falseLabel }}
    </span>
    <span
      v-if="displayBothLabels"
      class="true-label"
      :class="{ '-active': modelValue }"
    >
      {{ trueLabel }}
    </span>
    <u-info v-if="$slots.info" :placement="infoPlacement">
      <slot name="info" />
    </u-info>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import { ElSwitch, Placement } from 'element-plus';
  import UInfo from '@/commons/others/UInfo.vue';

  const props = defineProps({
    modelValue: Boolean,
    trueLabel: { type: String, default: '' },
    falseLabel: { type: String, default: '' },
    displayBothLabels: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    infoPlacement: {
      type: String as () => Placement,
      default: 'right',
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);
  const modelValue = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (newVal) => {
      modelValue.value = newVal;
    }
  );

  const handleChange = () => {
    emit('update:modelValue', modelValue.value);
    emit('change', modelValue.value);
  };
</script>

<style lang="scss">
  .u-switch {
    display: flex;
    align-items: center;
    padding: 8px 0;

    .el-switch.is-checked .el-switch__core {
      border-color: var(--color-green-600);
      background-color: var(--color-green-600);
    }

    .el-switch__core {
      border-color: var(--color-neutral-400);
      background: var(--color-neutral-400);
      width: 40px;
      height: 24px;
      border-radius: 16px;
      &:after {
        width: 20px;
        height: 20px;
      }
    }

    .input-label {
      margin-left: 8px;
      color: var(--color-neutral-800);
      font-weight: bold;
    }
    &.-active {
      .input-label {
        color: var(--color-neutral-800);
      }
    }

    .true-label,
    .false-label {
      margin-right: 8px;
      margin-left: 8px;
      color: var(--color-neutral-500);
      &.-active {
        color: var(--color-neutral-800);
        font-weight: bold;
      }
    }
  }
</style>
