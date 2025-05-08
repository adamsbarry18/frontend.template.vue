import { UCascaderMenu } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'others/CascaderMenu',
  component: UCascaderMenu,
};

export const CascaderMenu = () => ({
  components: { UCascaderMenu },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
    <!-- Basic Cascader Menu -->
    <div>
      <h3>Basic Cascader Menu</h3>
      <u-cascader-menu
        v-model="value"
        :options="options"
        placeholder="Select an option"
        :allowParentSelection="allowParentSelection"
        :expandTrigger="expandTrigger"
        :disabled="disabled"
        @select="handleSelect"
      />
      <p>Selected Value: {{ value }}</p>
    </div>

    <!-- Disabled Cascader Menu -->
    <div>
      <h3>Disabled Cascader Menu</h3>
      <u-cascader-menu
        v-model="value"
        :options="options"
        placeholder="Select an option"
        :allowParentSelection="allowParentSelection"
        :expandTrigger="expandTrigger"
        disabled
        @select="handleSelect"
      />
      <p>Selected Value: {{ value }}</p>
    </div>

    <!-- Cascader Menu with Hover Expand Trigger -->
    <div>
      <h3>Cascader Menu (Hover Expand Trigger)</h3>
      <u-cascader-menu
        v-model="value"
        :options="options"
        placeholder="Select an option"
        :allowParentSelection="allowParentSelection"
        expandTrigger="hover"
        :disabled="disabled"
        @select="handleSelect"
      />
      <p>Selected Value: {{ value }}</p>
    </div>
  </div>
`,
  setup() {
    const value = ref([]);
    const options = ref([
      {
        label: 'Fruits',
        value: 'fruits',
        children: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Orange', value: 'orange' },
        ],
      },
      {
        label: 'Vegetables',
        value: 'vegetables',
        children: [
          { label: 'Carrot', value: 'carrot' },
          { label: 'Lettuce', value: 'lettuce' },
        ],
      },
      { label: 'Dairy', value: 'dairy' },
    ]);

    const disabled = ref(false);
    const allowParentSelection = ref(true);
    const expandTrigger = ref('click');

    const handleSelect = (selectedValue: string[]) => {
      console.log('Selected value:', selectedValue);
    };

    return {
      value,
      options,
      disabled,
      allowParentSelection,
      expandTrigger,
      handleSelect,
    };
  },
});
