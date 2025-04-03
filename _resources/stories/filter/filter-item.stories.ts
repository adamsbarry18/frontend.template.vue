import { UFilterItem } from '@/modules/common';
import { ref } from 'vue';

export default {
  title: 'filter/FilterItem',
  components: UFilterItem,
};

export const FilterItem = () => ({
  components: { UFilterItem },
  template: `
    <div>
      <u-filter-item v-model="activeFilter.control_group" :config="filterConfig.control_group" />
      <br />
      <u-filter-item v-model="activeFilter.updated_date" :config="filterConfig.updated_date" />
      <br />
      <u-filter-item v-model="activeFilter.recurring" :config="filterConfig.recurring" />
      <br />
      <u-filter-item v-model="activeFilter.recurring_unset" :config="filterConfig.recurring" />
      <br />
      <u-filter-item v-model="activeFilter.theme" :config="filterConfig.theme" />
      <br />
      <u-filter-item v-model="activeFilter.animal" :config="filterConfig.animal" />
    </div>`,
  setup() {
    const filterConfig = ref({
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
        label: 'Récurrence',
        prompt: 'Vous souhaitez afficher les actions de type : ',
        type: 'bool',
        trueLabel: 'Récurrente',
        falseLabel: 'Non récurrente',
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
      animal: {
        label: 'animal',
        singleValue: true,
        type: 'enum',
        options: [
          { value: 1, label: 'Cat' },
          { value: 2, label: 'Dog' },
          { value: 3, label: 'Rabbit' },
        ],
      },
    });

    const activeFilter = ref({
      control_group: [13, 37],
      updated_date: [new Date('2019-10-10'), new Date('2019-11-12')],
      recurring: true,
      recurring_unset: null,
      theme: [2],
      animal: [1],
    });

    return { filterConfig, activeFilter };
  },
});
