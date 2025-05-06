import { UVerticalStepper } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'Navigation/VerticalStepper',
};

export const VerticalStepper = () => ({
  components: {
    UVerticalStepper,
  },
  template: `
    <div style='background-color: var(--color-background-white); display: flex; flex-direction: column; padding: 160px'>
      <u-vertical-stepper
        :steps="steps"
        :active-step-id="activeStepId"
        :active-sub-step-id="activeSubStepId"
        @step-change="onStepChange"
        @sub-step-change="onSubStepChange"
      />
    </div>
  `,
  setup() {
    const activeStepId = ref(2);
    const activeSubStepId = ref(4);

    const subStebs = [
      { id: 1, label: 'Paramétrage', status: 'SUCCESS' },
      {
        id: 2,
        label: 'Conception',
        status: 'ERROR',
        message: "Tooltip message pour indiquer la raison de l'erreur",
      },
      { id: 3, label: 'Personnalisation', status: 'TODO', disabled: true },
      { id: 4, label: 'Simulation', status: 'WARNING' },
      { id: 5, label: 'Empty', status: 'EMPTY' },
    ];

    const steps = [
      { id: 1, label: 'Planification', status: 'SUCCESS' },
      {
        id: 2,
        label: 'Ciblage',
        status: 'ERROR',
        message: 'Message en tooltip',
      },
      { id: 3, label: 'Connecteur', status: 'SUCCESS' },
      { id: 4, label: 'Contenu', status: 'TODO', substeps: subStebs },
      {
        id: 5,
        label: 'Simulation & test',
        sublabel: '(opt)',
        status: 'SUCCESS',
      },
      { id: 6, label: 'Résumé', status: 'EMPTY' },
    ];

    const onStepChange = (step) => {
      activeStepId.value = step.id;
    };
    const onSubStepChange = (step) => {
      activeSubStepId.value = step.id;
    };
    return {
      activeStepId,
      activeSubStepId,
      subStebs,
      steps,
      onSubStepChange,
      onStepChange,
    };
  },
});
