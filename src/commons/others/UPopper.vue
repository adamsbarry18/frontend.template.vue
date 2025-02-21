<template>
  <el-popover
    ref="popoverRef"
    :placement="placement"
    :width="width"
    :trigger="trigger"
    :visible="visible"
    :offset="offset"
    :disabled="disabled"
    :popper-options="popperOptions"
    @show="$emit('show')"
    @hide="$emit('hide')"
    @after-enter="$emit('after-enter')"
    @after-leave="$emit('after-leave')"
  >
    <template #reference>
      <slot />
    </template>
    <slot />
  </el-popover>
</template>

<script setup lang="ts">
  import { ref, watch, defineExpose, nextTick } from 'vue';
  import { ElPopover, Placement, TooltipTriggerType } from 'element-plus';
  import type { PropType } from 'vue';
  import { preventOverflow, flip } from '@popperjs/core';

  const props = defineProps({
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom-start',
    },
    width: {
      type: [String, Number],
      default: undefined,
    },
    trigger: {
      type: String as () => TooltipTriggerType,
      default: 'click',
    },
    visible: {
      type: Boolean,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: Number,
      default: 0,
    },
    popperOptions: {
      type: Object,
      default: () => ({
        modifiers: [
          { name: 'offset', options: { offset: [0, 10] } },
          preventOverflow,
          flip,
        ],
      }),
    },
  });

  const emit = defineEmits([
    'show',
    'hide',
    'after-enter',
    'after-leave',
    'update:visible',
  ]);

  const popoverRef = ref<
    InstanceType<typeof ElPopover> & {
      popperRef: { update: () => void };
      show: () => void;
      hide: () => void;
    }
  >();

  const updatePopper = () => {
    nextTick(() => {
      popoverRef.value?.popperRef?.update();
    });
  };

  defineExpose({
    updatePopper,
    show: () => popoverRef.value?.show(),
    hide: () => popoverRef.value?.hide(),
  });

  watch(
    () => props.visible,
    (newVal) => {
      emit('update:visible', newVal);
    }
  );
</script>
