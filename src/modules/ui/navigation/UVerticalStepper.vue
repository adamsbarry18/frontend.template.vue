<template>
  <div class="u-vertical-stepper">
    <div
      v-for="step in steps"
      :key="step.id"
      class="wizard-step"
      :class="{ '-active': step.id === activeStepId }"
      @click="onStepClick(step)"
    >
      <div class="step-container">
        <span class="step-label">
          {{ step.label }}
          <span v-if="step.sublabel" class="step-sublabel">{{ step.sublabel }}</span>
        </span>

        <u-tooltip :key="step.status" placement="right">
          <template #content>
            <div v-if="step.message">
              {{ step.message }}
            </div>
          </template>
          <icon-base
            v-if="step.status === 'SUCCESS'"
            icon="icon-completed"
            color="var(--color-status-success)"
            :size="28"
          />
          <icon-base
            v-if="step.status === 'ERROR'"
            icon="icon-error"
            color="var(--color-status-error)"
            :size="28"
          />
          <icon-base
            v-if="step.status === 'WARNING'"
            icon="icon-warning"
            color="var(--color-status-warning)"
            :size="28"
          />
          <div v-if="step.status === 'TODO'" class="todo-icon" />
          <span v-else></span>
        </u-tooltip>
      </div>

      <u-vertical-sub-stepper
        v-if="step.substeps"
        :steps="step.substeps"
        :active-step-id="activeSubStepComputed"
        @sub-step-change="onSubStepChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType, computed } from 'vue';
  import { UTooltip, IconBase, UVerticalSubStepper } from '@/modules/ui';
  import areSubStepsValid from './validateSubsteps';
  import { Step } from './step-interfaces';

  const props = defineProps({
    steps: {
      type: Array as PropType<Step[]>,
      required: true,
      validator: (value: any) => {
        let isValid = true;
        value.forEach((step: Step) => {
          const { id, label, message, status, sublabel, substeps } = step;
          if (!id) {
            isValid = false;
          }

          if (!label || typeof label !== 'string') {
            isValid = false;
          }

          if (message && typeof message !== 'string') {
            isValid = false;
          }

          if (sublabel && typeof sublabel !== 'string') {
            isValid = false;
          }

          if (substeps && !areSubStepsValid(substeps)) {
            isValid = false;
          }

          isValid = isValid && ['EMPTY', 'ERROR', 'SUCCESS', 'TODO', 'WARNING'].includes(status as string);
        });

        return isValid;
      },
    },
    activeStepId: {
      type: [Number, String] as PropType<string | number>,
      default: undefined,
    },
    activeSubStepId: {
      type: [Number, String],
      default: null,
    },
  });

  const emit = defineEmits<{
    (e: 'step-change', step: Step): void;
    (e: 'sub-step-change', step: Step): void;
  }>();

  const activeSubStepComputed = computed(() => {
    if (!props.activeStepId) return undefined;
    const currentStep = props.steps.find((step) => step.id === props.activeStepId);
    return currentStep?.substeps?.find((substep) => substep.id === props.activeStepId)?.id || undefined;
  });

  const onStepClick = (step: Step) => {
    emit('step-change', step);
  };

  const onSubStepChange = (step: Step) => {
    emit('sub-step-change', step);
  };
</script>

<style lang="scss" scoped>
  .u-vertical-stepper {
    display: flex;
    flex-direction: column;
    overflow-x: auto;

    .wizard-step {
      border-top: 1px solid var(--color-neutral-300);
      cursor: pointer;
      padding: 12px 20px 12px 20px;

      &:last-child {
        border-bottom: 1px solid var(--color-neutral-300);
      }

      &.-active {
        border-left: 6px solid var(--color-primary-500);
        padding-left: 10px;

        .step-container .step-label {
          font-weight: 800;
          font-size: var(--paragraph-01);
        }
      }

      .step-container {
        align-items: center;
        display: flex;
        min-height: 28px;

        .step-label {
          flex-grow: 1;
          font-weight: 400;
          text-align: left;

          .step-sublabel {
            color: var(--color-neutral-500);
            font-weight: normal;
          }
        }

        .todo-icon {
          border: 1px dashed var(--color-neutral-300);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          margin: 4px 4px 4px 0;
        }
      }

      .u-vertical-sub-stepper {
        padding: 0 2px 0 12px;
      }
    }
  }
</style>
