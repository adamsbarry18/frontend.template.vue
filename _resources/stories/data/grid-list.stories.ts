import UGridList from '@/commons/data/UGridList.vue';
import ListService from '../../../src/commons/data/services/listService';
import { reactive, ref } from 'vue';

const emptyData: any[] = [];

export default {
  title: 'data/GridList',
  component: UGridList,
};

export const GridList = () => ({
  components: { UGridList },
  setup() {
    // Create instances of ListService with dummy data

    const data = reactive([
      { id: 1, name: 'Item 1', description: 'First item' },
      { id: 2, name: 'Item 2', description: 'Second item' },
      { id: 3, name: 'Item 3', description: 'Third item' },
    ]);
    const dummyListService = new ListService({
      data: data,
      autoload: false,
    });
    const emptyListService = new ListService({
      data: emptyData,
      autoload: false,
    });
    return { dummyListService, emptyListService };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <!-- Case 1: Grid List with Items -->
      <section>
        <h3>Grid List with Items</h3>
        <u-grid-list :list-service="dummyListService" class="u-grid-list">
          <template #header>
            <div style="padding: 10px; background: #f9f9f9;">
              Header: Items List
            </div>
          </template>
          <template #item="{ item }">
            <div style="padding: 10px; border: 1px solid #ccc; margin: 5px; flex: 0 0 30%;">
              <strong>ID:</strong> {{ item.id }}<br>
              <strong>Name:</strong> {{ item.name }}<br>
              <strong>Description:</strong> {{ item.description }}
            </div>
          </template>
          <template #empty-label>
            <div style="padding: 20px; text-align: center;">No items found.</div>
          </template>
        </u-grid-list>
      </section>

      <!-- Case 2: Grid List with No Items -->
      <section>
        <h3>Grid List with No Items</h3>
        <u-grid-list :list-service="emptyListService" class="u-grid-list">
          <template #header>
            <div style="padding: 10px; background: #f9f9f9;">
              Header: Empty List
            </div>
          </template>
          <template #item="{ item }">
            <div style="padding: 10px; border: 1px solid #ccc; margin: 5px;">
              {{ item }}
            </div>
          </template>
          <template #empty-label>
            <div style="padding: 20px; text-align: center;">No items to display.</div>
          </template>
        </u-grid-list>
      </section>

      <!-- Case 3: Static Grid List (Slots Only) -->
      <section>
        <h3>Static Grid List (Slots Only)</h3>
        <u-grid-list class="u-grid-list">
          <template #header>
            <div style="padding: 10px; background: #f9f9f9;">
              Static Header
            </div>
          </template>
          <template #item>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              <div style="padding: 10px; border: 1px solid #ccc; flex: 0 0 30%;">
                Static Item 1
              </div>
              <div style="padding: 10px; border: 1px solid #ccc; flex: 0 0 30%;">
                Static Item 2
              </div>
              <div style="padding: 10px; border: 1px solid #ccc; flex: 0 0 30%;">
                Static Item 3
              </div>
            </div>
          </template>
          <template #empty-label>
            <div style="padding: 20px; text-align: center;">
              Nothing to show.
            </div>
          </template>
        </u-grid-list>
      </section>
    </div>
  `,
});
