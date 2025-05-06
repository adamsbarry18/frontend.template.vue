<template>
  <el-collapse
    v-model="activePanel"
    accordion
    class="u-accordion"
    @change="onChange"
  >
    <slot />
  </el-collapse>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import { ElCollapse } from 'element-plus';

  const props = defineProps({
    modelValue: {
      default: null,
    },
  });
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void;
    (e: 'change', value: string | null): void;
  }>();

  const activePanel = ref(null);

  watch(
    () => props.modelValue,
    (val) => {
      activePanel.value = val;
    }
  );

  onMounted(() => {
    activePanel.value = props.modelValue ?? null;
  });

  const onChange = (val: string | string[]) => {
    activePanel.value = typeof val === 'string' ? val : null;
    emit('update:modelValue', activePanel.value);
    emit('change', activePanel.value);
  };
</script>

<style lang="scss">
  .u-accordion {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: 100%;
    overflow: hidden;
  }
</style>
