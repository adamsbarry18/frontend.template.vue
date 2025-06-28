<template>
  <el-rate
    v-model="internalValue"
    :disabled="disabled"
    :show-score="showScore"
    :text-color="textColor"
    :score-template="scoreTemplate"
    :size="size"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { ElRate } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showScore: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: '',
    },
    scoreTemplate: {
      type: String,
      default: '{value}',
    },
    size: {
      type: String as () => 'large' | 'default' | 'small',
      default: 'default',
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const internalValue = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (newValue) => {
      internalValue.value = newValue;
    }
  );

  const handleChange = (value: number) => {
    emit('update:modelValue', value);
    emit('change', value);
  };
</script>

<style scoped lang="scss">
  /* Ajoutez des styles spécifiques si nécessaire */
</style>
