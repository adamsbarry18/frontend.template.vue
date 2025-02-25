import UFilterItemPopper from '@/commons/filter/UFilterItemPopper.vue';
import { ref } from 'vue';
import IconBase from '@/commons/icons/IconBase.vue';

export default {
  title: 'filter/AddFilterPopper',
  component: UFilterItemPopper,
};

export const AddFilterPopper = () => ({
  components: { UFilterItemPopper, IconBase },
  template: `
    <div style="padding: 20px;">
      <h3>Add Filter Popper Example</h3>
      <u-filter-item-popper :config="config" @add-filter="handleAddFilter">
      <p>Clic me</p>
      <icon-base
          icon="icon-filter"
          size="24"
          color="var(--color-primary)"
        />
      </u-filter-item-popper>
      <p>Selected Filter: {{ selectedFilter }}</p>
    </div>
  `,
  setup() {
    const config = ref({
      filter1: { label: 'Filter 1' },
      filter2: { label: 'Filter 2' },
      filter3: { label: 'Filter 3' },
    });
    const selectedFilter = ref('');
    function handleAddFilter(key: string) {
      selectedFilter.value = key;
      console.log('Filter selected: ' + key);
    }
    return {
      config,
      selectedFilter,
      handleAddFilter,
    };
  },
});
