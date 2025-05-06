import { UFigure } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'data/Figure',
  component: UFigure,
};

export const Figure = () => ({
  components: { UFigure },
  setup() {
    const sampleValue = ref('42');
    return { sampleValue };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <!-- Example 1: Figure with Icon, Label and Numeric Value (Medium) -->
      <div>
        <h3>Figure with Icon and Label (Medium)</h3>
        <u-figure 
          :model-value="'42'" 
          label="Total Views" 
          icon="icon-eye" 
          :icon-size="40"
          iconColor="blue"
          size="medium"
        />
      </div>
      
      <!-- Example 2: Figure without Icon (Small) -->
      <div>
        <h3>Figure without Icon (Small)</h3>
        <u-figure 
          :model-value="'N/A'" 
          label="No Data" 
          size="small"
        />
      </div>
      
      <!-- Example 3: Figure with 'between' Slot Content -->
      <div>
        <h3>Figure with 'between' Slot Content</h3>
        <u-figure 
          :model-value="'100'" 
          label="Users" 
          icon="icon-user" 
          size="medium"
        >
          <template #between>
            <span style="font-size: 12px; color: grey;">(updated now)</span>
          </template>
        </u-figure>
      </div>
      
      <!-- Example 4: Figure with Custom Label Content via Default Slot -->
      <div>
        <h3>Figure with Custom Label Content</h3>
        <u-figure 
          :model-value="'75'" 
          label="Completion"
          size="medium"
        >
          <template>
            <span style="font-weight: bold; color: green;">75% completed</span>
          </template>
        </u-figure>
      </div>
    </div>
  `,
});
