import UCascaderInput from '@/commons/forms/UCascaderInput.vue';
import { ref } from 'vue';

export default {
  title: 'Forms/CascaderInput',
  component: UCascaderInput, // Specify the component here
};

export const CascaderInput = () => ({
  components: { UCascaderInput },
  template: `
  <div>
    <h3>Basic Cascader Input</h3>
    <u-cascader-input
      v-model="basicValue"
      :options="basicOptions"
      :label-formatter="labelFormatter"
      placeholder="Please select an option"
      @change="handleBasicChange"
    />
    <p>Selected Value: {{ basicValue }}</p>
    <br/><br/>

    <h3>Disabled Cascader Input</h3>
    <u-cascader-input
      v-model="disabledValue"
      :options="disabledOptions"
      :label-formatter="labelFormatter"
      placeholder="Cascader disabled"
      disabled
    />
    <p>Selected Value: {{ disabledValue }}</p>
    <br/><br/>

    <h3>Focus On Mount Cascader Input</h3>
    <u-cascader-input
      v-model="focusValue"
      :options="focusOptions"
      :label-formatter="labelFormatter"
      placeholder="Focus on mount cascader"
      :focusOnMount="true"
    />
    <p>Selected Value: {{ focusValue }}</p>
    <br/><br/>
     <h3>Multiple Selection Cascader Input</h3>
        <u-cascader-input
          v-model="multipleValue"
          :options="multipleOptions"
          :label-formatter="labelFormatter"
          placeholder="Multiple selection cascader"
          :allowParentSelection="true"
        />
        <p>Selected Value: {{ multipleValue }}</p>
  </div>
`,
  setup() {
    const basicOptions = ref([
      {
        value: 'address',
        label: 'Addresse',
      },
      {
        value: 'store',
        label: 'Store',
      },
      {
        value: 'items',
        label: 'items',
        children: [
          {
            value: 'return_reason',
            label: 'Motif_retour',
          },
          {
            value: 'products',
            label: 'Products',
            children: [
              {
                value: 'from_list',
                label: 'From list',
                children: [
                  {
                    value: 'list_1',
                    label: 'List1',
                  },
                  {
                    value: 'list_2',
                    label: 'List2',
                  },
                  {
                    value: 'list_3',
                    label: 'List3',
                  },
                  {
                    value: 'list_4',
                    label: 'List4',
                  },
                  {
                    value: 'list_5',
                    label: 'List5',
                  },
                ],
              },
              {
                value: 'from_feed',
                label: 'From feed',
                children: [
                  {
                    value: 'code_famille',
                    label: 'CodeFamille',
                  },
                  {
                    value: 'code_barre',
                    label: 'CodeBarre',
                  },
                  {
                    value: 'code_article',
                    label: 'CodeArticle',
                  },
                  {
                    value: 'categ_main',
                    label: 'Categ_main',
                  },
                  {
                    value: 'categ_sub_1',
                    label: 'Categ_sub_1',
                  },
                  {
                    value: 'categ_sub_2',
                    label: 'Categ_sub_2',
                  },
                ],
              },
              {
                value: 'from_event',
                label: 'From event',
              },
            ],
          },
          {
            value: 'subtotal',
            label: 'Subtotal',
          },
          {
            value: 'quantity',
            label: 'Quantity',
          },
          {
            value: 'type_ligne',
            label: 'Type_ligne',
          },
          {
            value: 'other',
            label: 'Other',
          },
        ],
      },
      {
        value: 'subtotal',
        label: 'Subtotal',
      },
      {
        value: 'shipping',
        label: 'Shipping',
      },
      {
        value: 'currency',
        label: 'Currency',
      },
    ]);
    const disabledOptions = ref([
      {
        label: 'Option A',
        value: 'optionA',
        children: [
          { label: 'Suboption A-1', value: 'suboptionA-1' },
          { label: 'Suboption A-2', value: 'suboptionA-2' },
        ],
      },
      {
        label: 'Option B',
        value: 'optionB',
        children: [
          { label: 'Suboption B-1', value: 'suboptionB-1' },
          { label: 'Suboption B-2', value: 'suboptionB-2' },
        ],
      },
    ]);
    const focusOptions = ref([
      {
        label: 'Option X',
        value: 'optionX',
        children: [
          { label: 'Suboption X-1', value: 'suboptionX-1' },
          { label: 'Suboption X-2', value: 'suboptionX-2' },
        ],
      },
      {
        label: 'Option Y',
        value: 'optionY',
        children: [
          { label: 'Suboption Y-1', value: 'suboptionY-1' },
          { label: 'Suboption Y-2', value: 'suboptionY-2' },
        ],
      },
    ]);

    const multipleOptions = ref([
      {
        value: 'level1',
        label: 'Level 1',
        children: [
          {
            value: 'level2-1',
            label: 'Level 2-1',
            children: [
              {
                value: 'level3',
                label: 'Level 3',
                children: [
                  {
                    value: 'level4',
                    label: 'Level 4',
                  },
                ],
              },
            ],
          },
          {
            value: 'level2-2',
            label: 'Level 2-2',
            children: [
              {
                value: 'level3',
                label: 'Level 3',
                children: [
                  {
                    value: 'level4',
                    label: 'Level 4',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);

    const basicValue = ref(null);
    const disabledValue = ref(null);
    const focusValue = ref(null);
    const multipleValue = ref(null);

    const labelFormatter = (labels: string[]) => {
      // Corrected type
      return Array.isArray(labels) ? labels.join(' / ') : '';
    };

    const handleBasicChange = (val: string[]) => {
      console.log('Basic Cascader Change:', val);
    };

    return {
      basicOptions,
      disabledOptions,
      focusOptions,
      multipleOptions,
      basicValue,
      disabledValue,
      focusValue,
      multipleValue,
      labelFormatter,
      handleBasicChange,
    };
  },
});
