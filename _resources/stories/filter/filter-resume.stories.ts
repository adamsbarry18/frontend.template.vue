import UFilterResume from '@/modules/common/filter/UFilterResume.vue';
import { reactive } from 'vue';

export default {
  title: 'filter/FilterResume',
  components: UFilterResume,
};

export const FilterResume = () => ({
  components: { UFilterResume },
  template: `
    <p>
      <u-filter-resume :filter-config="filterConfig" :active-filter="activeFilter" />
    </p>`,
  setup() {
    const filterConfig = reactive({
      control_group: {
        label: 'Groupe de contrôle',
        type: 'numberrange',
        min: 0,
        max: 100,
        defaultMax: 100,
        unit: '%',
      },
      updated_date: {
        label: 'Date de mise à jour',
        type: 'daterange',
        shortcuts: 'past',
        defaultEnd: new Date(),
      },
      recurring: {
        label: 'Recurrence',
        type: 'bool',
        trueLabel: 'Récurrente',
        falseLabel: 'One-Shot',
      },
      theme: {
        label: 'Thème',
        type: 'enum',
        options: [
          { value: 1, label: 'Fideliser' },
          { value: 2, label: 'Transformer' },
          { value: 3, label: 'convertir' },
        ],
      },
    });
    const activeFilter = reactive({
      control_group: [13, 37],
      updated_date: [new Date('2019-10-10'), new Date('2019-11-12')],
      recurring: true,
      theme: [2],
    });
    return { filterConfig, activeFilter };
  },
});
