import { UFilter } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'filter/Filter',
  components: UFilter,
};

export const Filter = () => ({
  components: { UFilter },
  template: `
    <div>
      <u-filter v-model="activeFilter" :search.sync="search" :config="filterConfig" @collapse="onCollapse" />
      <br />
      Search : <input v-model="search" width="300" />
    </div>`,
  setup() {
    const onCollapse = () => {
      console.info('on collapse');
    };
    const search = ref('Active search');
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
    });

    const activeFilter = ref({
      control_group: [13, 37],
      updated_date: [new Date('2019-10-10'), new Date('2019-11-12')],
    });

    return { filterConfig, activeFilter, onCollapse, search };
  },
});
