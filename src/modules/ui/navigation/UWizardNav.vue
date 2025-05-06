<template>
  <div class="u-wizard-nav">
    <u-button v-if="withBackButton" class="-secondary" @click="onBack">
      <p>{{ backButtonLabel || $t('commons.form.back') }}</p>
    </u-button>
    <div v-else />
    <div class="steps-indicator">
      <div
        v-for="i in stepsCount"
        v-show="activeStep > 0 && stepsCount > 1"
        :key="i"
        class="step-indicator"
        :class="{ '-full': i <= activeStep }"
      />
    </div>
    <template v-if="activeStep < stepsCount">
      <u-tooltip v-if="withNextButton" placement="top">
        <div class="next-button-wrapper">
          <u-button
            class="next-button"
            type="primary"
            :disabled="nextButtonDisabled"
            @click="onNext"
          >
            {{ nextButtonLabel || $t('commons.form.next') }}
          </u-button>
        </div>
        <template #content>
          <slot name="next-tooltip" />
        </template>
      </u-tooltip>
    </template>
    <u-tooltip v-else-if="withSubmitButton" placement="top">
      <div class="submit-button-wrapper">
        <u-button
          class="submit-button"
          :disabled="submitButtonDisabled || submitButtonLoading"
          type="primary"
          @click="onSubmit"
        >
          {{ submitButtonLabel || $t('commons.form.submit') }}
        </u-button>
      </div>
      <template #content>
        <slot name="submit-tooltip" />
      </template>
    </u-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { UButton, UTooltip } from '@/modules/ui';

  defineProps({
    activeStep: {
      type: Number,
      required: true,
    },
    stepsCount: {
      type: Number,
      required: true,
    },
    withBackButton: {
      type: Boolean,
      default: true,
    },
    backButtonLabel: {
      type: String,
    },
    submitButtonLabel: {
      type: String,
    },
    withNextButton: {
      type: Boolean,
      default: true,
    },
    withSubmitButton: {
      type: Boolean,
      default: true,
    },
    nextButtonLabel: {
      type: String,
    },
    submitButtonDisabled: {
      type: Boolean,
      default: false,
    },
    submitButtonLoading: {
      type: Boolean,
      default: false,
    },
    nextButtonDisabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['back', 'next', 'submit']);

  const onBack = () => {
    emit('back');
  };

  const onNext = () => {
    emit('next');
  };

  const onSubmit = () => {
    emit('submit');
  };
</script>

<style lang="scss" scoped>
  .u-wizard-nav {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    .u-button {
      max-width: 120px;
    }

    .steps-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      .step-indicator {
        margin: 0 8px;
        border: 1px solid var(--color-primary-500);
        border-radius: 50%;
        background-color: var(--color-white);
        width: 10px;
        height: 10px;
        &.-full {
          background-color: var(--color-primary-500);
        }
      }
    }
    .submit-button-wrapper {
      justify-self: end;
      .u-button {
        max-width: 240px;
      }
    }
    .next-button-wrapper {
      justify-self: end;
      .u-button {
        max-width: 240px;
      }
    }
  }
</style>
