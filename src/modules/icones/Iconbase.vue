<template>
  <svg
    class="icon"
    :width="iconWidth"
    :height="iconHeight"
    :viewBox="viewbox"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title v-if="title">{{ title }}</title>
    <g :class="{ '-rich': rich }" :fill="color">
      <component :is="iconComponent" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from "vue";
import * as icons from "./index.ts";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  rich: {
    type: Boolean,
    default: false,
  },
  size: {
    type: [Number, String],
    default: 30,
  },
  width: {
    type: [Number, String],
    default: null,
  },
  height: {
    type: [Number, String],
    default: null,
  },
  color: {
    type: String,
    default: "var(--color-neutral-800)",
  },
  richColor: {
    type: String,
    default: "var(--color-primary-500)",
  },
  title: {
    type: String,
    default: null,
  },
  viewbox: {
    type: String,
    default: "0 0 32 32",
  },
});

const iconName = computed(() =>
  props.icon
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
);

const iconComponent = computed(() => icons[iconName.value]);

const iconWidth = computed(() => props.width || props.size);
const iconHeight = computed(() => props.height || props.size);
</script>

<style lang="scss">
svg.icon {
  vertical-align: middle;
  & > g {
    &.-rich .rich {
      fill: v-bind(richColor);
    }
  }
}
</style>
