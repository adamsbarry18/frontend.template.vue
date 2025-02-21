<template>
  <div class="u-wired-vertical-stepper">
    <div
      v-for="(step, idx) in steps"
      :key="step.id"
      class="vertical-step"
      :class="{
        '-active': step.id === activeStep,
        '-disabled': step.disabled,
      }"
      @click="onStepClick(step)"
    >
      <div class="step-number">
        <icon-base
          v-if="step.icon"
          :icon="step.icon"
          :size="24"
          :color="`var(--color-${step.id === activeStep ? 'white' : 'blue-lighten-2'})`"
        />
        <span v-else>{{ idx + 1 }}</span>
      </div>
      <span class="step-label">
        {{ step.label }}
        <span v-if="step.sublabel" class="step-sublabel">{{
          step.sublabel
        }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue';
  import IconBase from '@/commons/icones/IconBase.vue';
  import { Step } from './step-interfaces';

  const props = defineProps({
    steps: {
      type: Array as PropType<Step[]>,
      required: true,
    },
    activeStep: {
      type: [Number, String],
      default: null,
    },
  });

  const emit = defineEmits<{
    (e: 'step-change', step: Step): void;
  }>();

  const onStepClick = (step: Step) => {
    if (!step?.disabled && step?.id !== props.activeStep) {
      emit('step-change', step);
    }
  };
</script>

<style lang="scss" scoped>
  .u-wired-vertical-stepper {
    --circle-size: 36px;
    --space-between-steps: 28px;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    padding: 28px;

    .vertical-step {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: calc(var(--space-between-steps) / 2) 0;
      z-index: 0;

      &:last-child .step-number::after {
        display: none;
      }

      &.-active {
        .step-label {
          color: var(--color-primary-500);
          font-weight: bold;
        }

        .step-number {
          border: none;
          background-color: var(--color-primary-500);
          font-weight: bold;
          span {
            color: var(--color-white);
          }
        }
      }

      &.-disabled {
        cursor: not-allowed;

        .step-label {
          color: var(--color-neutral-500);
        }
      }

      .step-number {
        position: relative;
        border: solid 1px var(--color-input-border-hover);
        color: var(--color-neutral-500);
        height: var(--circle-size);
        width: var(--circle-size);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--paragraph-01);

        &::after {
          content: '';
          position: absolute;
          width: 1px;
          height: var(--space-between-steps);
          left: 0;
          right: 0;
          top: calc(var(--circle-size) - 1px);
          margin: auto;
          z-index: -1;
          background: var(--color-input-border-hover);
        }
      }

      .step-label {
        margin-left: 12px;
        flex-grow: 1;
        text-align: left;

        .step-sublabel {
          color: var(--color-neutral-500);
        }
      }
    }
  }
</style>
