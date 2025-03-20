import UWiredVerticalStepper from '@/modules/common/navigation/UWiredVerticalStepper.vue';
import UButton from '@/modules/common/basic/UButton.vue';
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
            />
        </div>
    `,
  setup() {
    const activeStep = ref(2);
    const onStepChange = (step) => {
      activeStep.value = step.id;
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
