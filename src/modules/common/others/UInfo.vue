<template>
  <u-tooltip
    ref="tooltipRef"
    :placement="placement"
    :tooltip-class="popperClass"
  >
    <template #content>
      <slot />
    </template>
    <icon-base
      class="u-info"
      icon="icon-info"
      :color="iconColor"
      :width="width"
      :height="height"
    />
  </u-tooltip>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import UTooltip from '@/modules/common/others/UTooltip.vue';
  import IconBase from '@/modules/common/icons/IconBase.vue';
  import type { Placement } from 'element-plus';

  const props = defineProps({
    placement: {
      type: String as () => Placement,
      default: 'right',
    },
    tooltipClass: {
      type: String,
      default: '',
    },
    width: {
      type: [Number, String],
      default: 24,
    },
    height: {
      type: [Number, String],
      default: 24,
    },
    iconColor: {
      type: String,
      default: 'var(--color-neutral-500)',
    },
  });

  const tooltipRef = ref<InstanceType<typeof UTooltip> | null>(null);

  const popperClass = computed(() => {
    let res = 'u-info-popper';
    if (props.tooltipClass) {
      res += ` ${props.tooltipClass}`;
    }
    return res;
  });
</script>

<style lang="scss" scoped>
  .u-tooltip.list-tooltip {
    margin-right: 20px;
    max-width: 40vw;

    & > ul {
      list-style: none;

      li {
        margin: 0;
      }
    }
  }
</style>
