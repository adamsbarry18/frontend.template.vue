<template>
  <div class="u-vertical-sub-stepper">
    <div
      v-for="step in steps"
      :key="step.id"
      class="vertical-sub-step"
      :class="{
        '-active': step.id === activeStepId,
        '-disabled': step.disabled,
      }"
      @click="onSubStepClick(step)"
    >
      <span class="step-label">{{ step.label }}</span>

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
          :size="22"
        />
        <icon-base
          v-if="step.status === 'ERROR'"
          icon="icon-error"
          color="var(--color-status-error)"
          :size="22"
        />
        <icon-base
          v-if="step.status === 'WARNING'"
          icon="icon-warning"
          color="var(--color-status-warning)"
          :size="22"
        />
        <div v-if="step.status === 'TODO'" class="todo-icon" />
        <span v-else></span>
      </u-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue';
  import UTooltip from '@/modules/common/others/UTooltip.vue';
  import IconBase from '@/modules/common/icons/IconBase.vue';
  import areSubstepsValid from './validateSubsteps';
  import { Substep } from './step-interfaces';

  defineProps({
    steps: {
      type: Array as PropType<Substep[]>,
      required: true,
      validator: (value: Substep) => areSubstepsValid(value),
    },
    activeStepId: {
      type: [Number, String],
      default: null,
    },
  });

  const emit = defineEmits<{
    (e: 'sub-step-change', step: Substep): void;
  }>();

  const onSubStepClick = (step: Substep) => {
    if (step.disabled) {
      return;
    }
    emit('sub-step-change', step);
  };
</script>

<style lang="scss" scoped>
  .u-vertical-sub-stepper {
    display: flex;
    flex-direction: column;
    overflow-x: auto;

    .vertical-sub-step {
      align-items: center;
      cursor: pointer;
      display: flex;
      font-weight: 400;
      height: 24px;

      &.-active .step-label {
        font-weight: 800;
      }

      &.-disabled {
        background-color: var(--color-button-disabled-background);
        border-radius: 4px;
        cursor: not-allowed;
        span {
          color: var(--color-button-disabled-content);
        }
      }

      .step-label {
        flex-grow: 1;
        text-align: left;
      }

      .todo-icon {
        border: 1px dashed var(--color-neutral-300);
        border-radius: 50%;
        width: 13px;
        height: 13px;
        margin: 4px 4px 4px 0;
      }
    }
  }
</style>
