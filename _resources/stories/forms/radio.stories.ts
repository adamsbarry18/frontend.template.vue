import { ref } from 'vue';
import URadio from '@/modules/common/forms/URadio.vue';

export default {
  title: 'Forms/Radio',
};

export const Radio = () => ({
  components: { URadio },
  template: `
  <div style="width: 380px">
    <br />
    <!-- Radio group with border -->
    <u-radio v-model="enumValue" border :options="enumOptions" />
    <br />
    <!-- Radio group without border -->
    <u-radio v-model="enumValue2" :options="enumOptions2" />
    <br />
    <!-- Radio group with button style -->
    <u-radio v-model="enumValue3" button :options="enumOptions3" />
    <br />
    <!-- Radio group with disabled options -->
    <u-radio v-model="enumValue4" :options="enumOptions4" />
    <br />
    <!-- Radio group with vertical layout -->
    <u-radio v-model="enumValue5" direction="column" :options="enumOptions5" />
    <br />
    <!-- Radio group with optional labels and descriptions -->
    <u-radio v-model="enumValue6" :options="enumOptions6" />
    <br />
    <!-- Radio group with event handling -->
    <u-radio v-model="enumValue7" :options="enumOptions7" @change="onChange" />
  </div>
  `,
  setup() {
    const enumValue = ref('before');
    const enumValue2 = ref('alice');
    const enumValue3 = ref('bob');
    const enumValue4 = ref('enabled');
    const enumValue5 = ref('item1');
    const enumValue6 = ref('option1');
    const enumValue7 = ref('choice1');

    const enumOptions = [
      { value: 'before', label: 'Before', info: 'information' },
      { value: 'after', label: 'After', info: 'information' },
    ];

    const enumOptions2 = [
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob' },
      { value: 'charlie', label: 'Charlie' },
    ];

    const enumOptions3 = [
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob' },
      { value: 'charlie', label: 'Charlie' },
    ];

    const enumOptions4 = [
      { value: 'enabled', label: 'Enabled' },
      { value: 'disabled', label: 'Disabled', disabled: true },
    ];

    const enumOptions5 = [
      { value: 'item1', label: 'Item 1' },
      { value: 'item2', label: 'Item 2' },
      { value: 'item3', label: 'Item 3' },
    ];

    const enumOptions6 = [
      { value: 'option1', label: 'Option 1', optionalLabel: '(Optional)' },
      {
        value: 'option2',
        label: 'Option 2',
        description: 'This is a description',
      },
      {
        value: 'option3',
        label: 'Option 3',
        optionalLabel: '(Optional)',
        description: 'Another description',
      },
    ];

    const enumOptions7 = [
      { value: 'choice1', label: 'Choice 1' },
      { value: 'choice2', label: 'Choice 2' },
      { value: 'choice3', label: 'Choice 3' },
    ];

    const onChange = (newValue: string) => {
      console.log('Radio value changed:', newValue);
    };

    return {
      enumValue,
      enumValue2,
      enumValue3,
      enumValue4,
      enumValue5,
      enumValue6,
      enumValue7,
      enumOptions,
      enumOptions2,
      enumOptions3,
      enumOptions4,
      enumOptions5,
      enumOptions6,
      enumOptions7,
      onChange,
    };
  },
});
