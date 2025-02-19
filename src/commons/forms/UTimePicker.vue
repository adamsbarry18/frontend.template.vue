<template>
  <el-time-select
    v-model="input"
    :placeholder="placeholder"
    :disabled="disabled"
    :picker-options="pickerOptions"
    class="u-time-picker"
    :popper-class="popperClass"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import { ElTimeSelect } from 'element-plus';

  const props = defineProps({
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '00:00',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    pickerOptions: {
      type: Object,
      default: () => ({
        start: '00:00',
        end: '23:45',
        step: '00:15',
      }),
    },
  });
  const emit = defineEmits(['update:modelValue', 'change']);
  const input = ref(props.modelValue);

  const popperClass = computed(() =>
    ['u-time-picker-popper', 'no-close-trigger'].join(' ')
  );

  watch(
    () => props.modelValue,
    (newValue) => {
      input.value = newValue;
    },
    { immediate: true }
  );

  onMounted(() => {
    if (!props.modelValue) {
      input.value = '00:00';
      emit('update:modelValue', input.value);
    }
  });

  const onChange = () => {
    emit('update:modelValue', input.value);
    emit('change', input.value);
  };
</script>

<style lang="scss">
  .u-time-picker {
    cursor: pointer;
    font-size: var(--paragraph-03);
  }
</style>
