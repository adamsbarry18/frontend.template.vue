import { UButton, UWiredVerticalStepper } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'Navigation/WiredVerticalStepper',
};

export const WiredVerticalStepper = () => ({
  components: { UWiredVerticalStepper, UButton },
  template: `
        <div style='background-color: var(--color-background-white); display: flex; flex-direction: column; padding: 160px'>
            <u-wired-vertical-stepper
                :steps="steps"
                :active-step="activeStep"
                @step-change="onStepChange"
                @sub-step-change="onSubStepChange"
            />
        </div>
    `,
  setup() {
    const activeStep = ref(2);
    const onStepChange = (step: { id: number }) => {
      console.log('Step changed:', step.id);
      activeStep.value = step.id;
    };

    const onSubStepChange = (step: { id: number }) => {
      console.log('Sub-step changed:', step.id);
    };

    const steps = [
      {
        id: 1,
        label: 'Informations',
      },
      {
        id: 2,
        label: 'Cible',
      },
      {
        id: 3,
        label: 'Médiaplan',
      },
      {
        id: 4,
        label: 'Simulation',
      },
      {
        id: 5,
        label: 'Performance',
        sublabel: '(opt)',
      },
      {
        id: 6,
        label: 'Lancement',
        icon: 'icon-activate',
      },
    ];
    return {
      activeStep,
      steps,
      onStepChange,
    };
  },
});
