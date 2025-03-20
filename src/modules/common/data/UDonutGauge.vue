<template>
  <div
    :style="{ height: size, width: size }"
    class="u-donut-gauge"
    :class="{ '-indeterminate': indeterminate }"
  >
    <svg
      :style="{ height: size, width: size }"
      viewBox="0 0 42 42"
      class="circular-chart"
    >
      <path
        :style="circleBgStyle"
        class="circle-bg"
        d="M21 5.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        v-if="percentage > 0 || indeterminate"
        :stroke-dasharray="dasharray"
        :style="circleStyle"
        class="circle"
        d="M21 5.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text v-if="!indeterminate" x="21" y="23.35" class="gauge-text">
        {{ text }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineProps, withDefaults } from 'vue';

  // Interface pour les props avec typage TypeScript
  interface Props {
    size?: string;
    text?: string;
    percentage?: number;
    strokeWidth?: number;
    strokeColor?: string;
    strokeSizeFactor?: number;
    angleOffset?: number;
    indeterminate?: boolean;
  }

  // Définition des props avec valeurs par défaut
  const props = withDefaults(defineProps<Props>(), {
    strokeWidth: 3.6,
    strokeColor: 'var(--color-blue-400)',
    indeterminate: false,
  });

  // Propriétés calculées avec la fonction `computed`
  const dasharray = computed(() => {
    return `${props.indeterminate ? 35 : props.percentage}, 100`;
  });

  const circleBgStyle = computed(() => {
    const style: any = {};
    style.strokeWidth = props.strokeSizeFactor
      ? props.strokeWidth * props.strokeSizeFactor
      : props.strokeWidth;
    return style;
  });

  const circleStyle = computed(() => {
    const style: any = {
      stroke: props.strokeColor,
    };
    style.strokeWidth = props.strokeSizeFactor
      ? props.strokeWidth * props.strokeSizeFactor
      : props.strokeWidth;
    if (props.angleOffset) {
      style.transform = `rotateZ(${props.angleOffset}deg)`;
    }
    return style;
  });
</script>

<style lang="scss">
  .u-donut-gauge {
    position: relative;

    @keyframes indeterminate-anim {
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0px;
      }
      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
      }
      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -99px;
      }
    }

    &.-indeterminate {
      animation: indeterminate-anim 1.5s linear infinite;
      .circular-chart {
        .circle {
          animation: dash 3s ease-in-out infinite running;
        }
      }
    }

    &.-butt {
      .circular-chart {
        .circle {
          stroke-linecap: butt;
        }
      }
    }

    &.-square {
      .circular-chart {
        .circle {
          stroke-linecap: square;
        }
      }
    }

    .circular-chart {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .circle-bg {
        fill: none;
        stroke: var(--color-neutral-100);
      }

      .circle {
        transform-origin: center center;
        animation: donut-progress 1s ease-out forwards;
        fill: none;
        stroke-linecap: round;
      }

      .gauge-text {
        font-size: 0.5em;
        text-anchor: middle;
        fill: var(--color-neutral-800);
        font-weight: 600;
      }

      @keyframes donut-progress {
        0% {
          stroke-dasharray: 0 100;
        }
      }
    }
  }
</style>
