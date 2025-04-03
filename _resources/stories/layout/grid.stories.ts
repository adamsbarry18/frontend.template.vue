import { UGrid } from '@/modules/common';
import { ref } from 'vue';

export default {
  title: 'layout/Grid',
};

export const Grid = () => ({
  components: { UGrid },
  template: `
    <div style="padding: 20px;">
      <h3>Grid with Content</h3>
      <u-grid :showContent="true" emptyLabel="No items available">
        <div
          v-for="item in items"
          :key="item.id"
          class="grid-item"
          style="border: 1px solid #ccc; padding: 10px; border-radius: 4px;"
        >
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </u-grid>
      
      <h3 style="margin-top: 40px;">Empty Grid</h3>
      <u-grid :showContent="false" emptyLabel="Aucun contenu disponible." />
    </div>
  `,
  setup() {
    const items = ref([
      { id: 1, title: 'Item 1', description: 'Description for item 1' },
      { id: 2, title: 'Item 2', description: 'Description for item 2' },
      { id: 3, title: 'Item 3', description: 'Description for item 3' },
      { id: 4, title: 'Item 4', description: 'Description for item 4' },
      { id: 5, title: 'Item 5', description: 'Description for item 5' },
      { id: 6, title: 'Item 6', description: 'Description for item 6' },
    ]);
    return { items };
  },
});
