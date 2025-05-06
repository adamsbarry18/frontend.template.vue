import { UButton, UWizardNav } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'navigation/WizardNav',
};

export const WizardNav = () => ({
  components: { UButton, UWizardNav },
  template: `
    <div style='background-color: var(--color-background-white); display: flex; flex-direction: column; padding: 160px'>
      <u-wizard-nav
        :steps-count="stepsCount"
        :active-step="activeStep"
        @back="onBack"
        @next="onNext"
        @submit="onSubmit"
      />
      <br />
      <u-wizard-nav
        :steps-count="stepsCount"
        :active-step="activeStep"
        @back="onBack"
        @next="onNext"
        @submit="onSubmit"
      >
        <template #next-tooltip>
          Ceci est le tooltip du bouton Next.
        </template>
        <template #submit-tooltip>
          Ceci est le tooltip du bouton Submit.
        </template>
      </u-wizard-nav>
    </div>
  `,
  setup() {
    const activeStep = ref(1);
    const stepsCount = ref(5);
    const onBack = () => {
      activeStep.value = Math.max(0, activeStep.value - 1);
    };
    const onNext = () => {
      activeStep.value = Math.min(stepsCount.value, activeStep.value + 1);
    };
    const onSubmit = () => {
      alert('Good job!');
    };

    return {
      activeStep,
      stepsCount,
      onBack,
      onNext,
      onSubmit,
    };
  },
});
