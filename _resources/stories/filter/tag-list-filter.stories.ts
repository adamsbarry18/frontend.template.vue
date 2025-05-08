import { UTagListFilter } from '@/modules/ui';
import { ref } from 'vue';

const items = [
  { icon: 'icon-explore', label: 'Label 1', value: 'explore' },
  { label: 'Label 2', value: 'default' },
  {
    icon: 'icon-store',
    label: 'Label 3',
    value: 'store',
    backgroundColor: 'var(--color-red-500)',
    color: 'var(--color-primary-100)',
  },
  {
    icon: 'icon-rocket',
    label: 'Label 4',
    value: 'rocket',
    backgroundColor: 'var(--color-blue-200)',
    color: 'var(--color-white)',
  },
  {
    icon: 'icon-add',
    label: 'Label 5',
    value: 'plain',
    backgroundColor: 'var(--color-yellow-300)',
  },
];

export default {
  title: 'Filter/TagListFilter',
  component: UTagListFilter,
  argTypes: {
    direction: {
      control: 'select',
      options: ['column', 'row'],
      defaultValue: 'column',
    },
  },
};

export const TagListFilter = (args: any) => ({
  components: { UTagListFilter },
  props: Object.keys(args),
  template: `
  <div style="padding: 20px;">
    <h3>Default Tag List Filter (No preselection)</h3>
    <u-tag-list-filter
      v-model="selectedDefault"
      :options="listItems"
      :direction="args.direction"
      background-color="var(--color-green-200)"
      color="var(--color-neutral-800)"
      @change="handleChangedDefault"
      @select="handleSelectDefault"
      @unselect="handleUnselectDefault"
    />
    <div style="margin: 16px 0;">
      <strong>Selected:</strong>
      <pre>{{ selectedDefault }}</pre>
    </div>
    
    <hr style="margin: 40px 0;" />
    
    <h3>Preselected Tag List Filter</h3>
    <u-tag-list-filter
      v-model="selectedPreselected"
      :options="listItems"
      :direction="args.direction"
      background-color="var(--color-green-200)"
      color="var(--color-neutral-800)"
      @change="handleChangedPreselected"
      @select="handleSelectPreselected"
      @unselect="handleUnselectPreselected"
    />
    <div style="margin: 16px 0;">
      <strong>Selected:</strong>
      <pre>{{ selectedPreselected }}</pre>
    </div>
    
    <hr style="margin: 40px 0;" />
    
    <h3>Tag List Filter (Row Layout)</h3>
    <u-tag-list-filter
      v-model="selectedRow"
      :options="listItems"
      direction="row"
      background-color="var(--color-green-200)"
      color="var(--color-neutral-800)"
      @change="handleChangedRow"
      @select="handleSelectRow"
      @unselect="handleUnselectRow"
    />
    <div style="margin: 16px 0;">
      <strong>Selected:</strong>
      <pre>{{ selectedRow }}</pre>
    </div>
  </div>
`,
  setup() {
    // Data for all examples
    const listItems = ref(items);

    // Example 1: Default (no preselection)
    const selectedDefault = ref<string[]>([]);
    const handleChangedDefault = () => console.log('change - Default: ', selectedDefault.value);
    const handleSelectDefault = (tag: { value: any; label?: string }) =>
      selectedDefault.value.push(tag.value);
    const handleUnselectDefault = (tag: { value: any; label?: string }) =>
      console.log('unselect - Default: ', tag);

    // Example 2: Preselected (preselect "store")
    const selectedPreselected = ref(['store']);
    const handleChangedPreselected = () => console.log('change - Preselected: ', selectedPreselected.value);
    const handleSelectPreselected = (tag: { value: any; label?: string }) =>
      selectedPreselected.value.push(tag.value);
    const handleUnselectPreselected = (tag: { value: any; label?: string }) =>
      console.log('unselect - Preselected: ', tag);

    // Example 3: Row layout
    const selectedRow = ref<string[]>([]);
    const handleChangedRow = () => console.log('change - Row: ', selectedRow.value);
    const handleSelectRow = (tag: { value: any; label?: string }) => selectedRow.value.push(tag.value);
    const handleUnselectRow = (tag: { value: any; label?: string }) => console.log('unselect - Row: ', tag);

    return {
      listItems,
      selectedDefault,
      selectedPreselected,
      selectedRow,
      handleChangedDefault,
      handleSelectDefault,
      handleUnselectDefault,
      handleChangedPreselected,
      handleSelectPreselected,
      handleUnselectPreselected,
      handleChangedRow,
      handleSelectRow,
      handleUnselectRow,
      args,
    };
  },
});
