import UCheckboxGroup from '@/commons/forms/UCheckboxGroup.vue';
import { ref } from 'vue';

export default {
  title: 'Forms/CheckboxGroup',
  component: UCheckboxGroup,
};

export const DefaultCheckboxGroup = () => ({
  components: { UCheckboxGroup },
  template: `
    <div>
      <h3>Horizontal Checkbox Group</h3>
      <u-checkbox-group
        v-model="selectedValues"
        :options="options"
        @change="handleChange"
      />
      <p>Selected: {{ selectedValues }}</p>

      <h3 style="margin-top: 20px;">Vertical Checkbox Group</h3>
      <u-checkbox-group
        v-model="selectedValuesColumn"
        :options="options"
        direction="column"
        @change="handleChangeColumn"
      />
      <p>Selected: {{ selectedValuesColumn }}</p>
    </div>
  `,
  setup() {
    // Les valeurs sélectionnées sont initialisées en tant que tableaux vides
    const selectedValues = ref([]);
    const selectedValuesColumn = ref([]);
    // Exemple d'options avec icônes et menu contextuel pour une option
    const options = ref([
      {
        value: 'option1',
        label: 'Option 1',
        icon: 'icon-user',
        color: 'red',
        contextualMenu: [
          { label: 'Edit', onClick: () => alert('Edit Option 1') },
          { label: 'Delete', onClick: () => alert('Delete Option 1') },
        ],
      },
      {
        value: 'option2',
        label: 'Option 2',
        icon: 'icon-add',
        color: 'blue',
      },
      {
        value: 'option3',
        label: 'Option 3',
      },
    ]);

    function handleChange(val) {
      selectedValues.value = val;
      console.log('Horizontal Checkbox Group Change:', val);
    }

    function handleChangeColumn(val) {
      selectedValuesColumn.value = val;
      console.log('Vertical Checkbox Group Change:', val);
    }

    return {
      selectedValues,
      selectedValuesColumn,
      options,
      handleChange,
      handleChangeColumn,
    };
  },
});
