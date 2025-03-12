import {
  ListService,
  PaginationService,
  SearchService,
  SortService,
} from '@/commons';
import UGridList from '@/commons/data/UGridList.vue';
import { reactive } from 'vue';

export default {
  title: 'data/GridList',
  component: UGridList,
};

const emptyData: any[] = [];

export const GridList = () => ({
  components: { UGridList },
  setup() {
    const data = reactive([
      { id: 1, name: 'Item 1', description: 'First item' },
      { id: 2, name: 'Item 2', description: 'Third item' },
      { id: 3, name: 'Item 3', description: 'Third item' },
    ]);

    const pagination = new PaginationService({ size: 12 });
    const search = new SearchService({
      filterPanelActive: false,
      placeholder: 'search ...',
    });
    const sort = new SortService({
      choices: [
        {
          label: 'most-recent',
          prop: 'updated_time',
          order: SortService.ORDER_DESC,
        },
        {
          label: 'oldest',
          prop: 'updated_time',
          order: SortService.ORDER_ASC,
        },
        {
          label: 'alpha asc',
          prop: 'name',
          order: SortService.ORDER_ASC,
        },
        {
          label: 'alpha desc',
          prop: 'name',
          order: SortService.ORDER_DESC,
        },
      ],
      defaultOrder: SortService.ORDER_DESC,
      defaultProp: 'updated_time',
      placeholder: 'placeholder sort',
    });

    const listService = new ListService({ pagination, search, sort, data });

    const dummyListService = {
      data: data,
      search: {
        input: '',
        filterConfig: {},
        filterPanelActive: false,
        filters: {},
      },
      pagination: {
        defaultPage: 1,
        itemsTotal: 3,
        pageNumber: 1,
        pageTotal: 1,
        size: 12,
      },
      entity: {
        entityLabelKey: 'commons.list-entities-count',
        entityIcon: 'icon-object',
      },
      urlFilters: {},
      sort: {
        choices: [],
        defaultProp: null,
        defaultOrder: 'ascending',
        placeholder: null,
      },
      retrieveDataPromise: null,
      showCounts: true,
      autoload: true,
    };

    return { dummyListService, listService };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <section>
        <h3>Grid List with Items</h3>
        <u-grid-list :list-service="listService" class="u-grid-list">
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
    </div>
  `,
});
