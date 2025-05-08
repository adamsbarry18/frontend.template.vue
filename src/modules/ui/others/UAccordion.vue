<template>
  <el-collapse v-model="activePanel" accordion class="u-accordion" @change="onChange">
    <slot />
  </el-collapse>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, Ref } from 'vue';
  import { ElCollapse } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined,
    },
  });
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | undefined): void;
    (e: 'change', value: string | undefined): void;
  }>();

  const activePanel: Ref<string | number | undefined> = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (val) => {
      activePanel.value = val;
    }
  );

  onMounted(() => {
    if (props.modelValue !== undefined) {
      activePanel.value = props.modelValue;
    }
  });

  const onChange = (val: string | number | Array<string | number>) => {
    let currentActive: string | number | undefined;
    if (Array.isArray(val)) {
      // In accordion mode, we expect a single value or empty if nothing is active.
      // If it's an array, take the first item if it exists, otherwise undefined.
      currentActive = val.length > 0 ? val[0] : undefined;
    } else {
      currentActive = val;
    }
    activePanel.value = currentActive;

    // Emit value as string | undefined for UAccordion
    const valueToEmit = typeof currentActive === 'string' ? currentActive : undefined;
    emit('update:modelValue', valueToEmit);
    emit('change', valueToEmit);
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
