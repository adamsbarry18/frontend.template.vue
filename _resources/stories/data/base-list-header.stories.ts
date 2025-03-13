import { ListService } from '@/commons';
import BaseListHeader from '@/commons/data/BaseListHeader.vue';
import { reactive, ref } from 'vue';

export default {
  title: 'data/ListHeader',
  component: BaseListHeader,
};

export const ListHeader = () => ({
  components: { BaseListHeader },
  setup() {
    const data = reactive([
      { id: 1, name: 'Item 1', description: 'First item' },
      { id: 2, name: 'Item 2', description: 'Third item' },
    ]);
    // Création d'un service de liste factice complet, avec search, pagination, entity et sort
    const dummyListServiceFull = {
      pagination: { itemsTotal: 50 },
      search: {
        filterPanelActive: true,
        filters: {}, // Valeur fictive pour les filtres
        input: '',
        filterConfig: { filterKey: 'value' },
      },
      entity: {
        entityIcon: 'icon-entity',
        entityLabelKey: 'commons.entity.label',
      },
      sort: {
        selectValue: '',
        selectOptions: [
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' },
        ],
        placeholder: 'Sort by...',
      },
      itemsTotal: 50,
      showCounts: true,
      data: data,
    };

    // Service de liste avec uniquement le search (pagination, entity et sort absents)
    const dummyListServiceSearchOnly = {
      ...dummyListServiceFull,
      pagination: null,
      entity: null,
      sort: null,
    };

    // Service de liste avec uniquement entity et sort (pas de search ni pagination)
    const dummyListServiceEntitySort = {
      ...dummyListServiceFull,
      search: null,
      pagination: null,
    };

    const listServiceFull = ref(dummyListServiceFull);
    const listServiceSearchOnly = ref(dummyListServiceSearchOnly);
    const listServiceEntitySort = ref(dummyListServiceEntitySort);

    return {
      listServiceFull,
      listServiceSearchOnly,
      listServiceEntitySort,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <!-- Cas 1 : Header complet (search, pagination, entity & sort) -->
      <section>
        <h3>Full Header (Search, Pagination, Entity & Sort)</h3>
        <base-list-header :list-service="listServiceFull">
          <template #header>
            <div style="font-weight: bold; padding: 10px; background: #f0f0f0;">
              Custom Header Content
            </div>
          </template>
        </base-list-header>
      </section>

      <!-- Cas 2 : Header avec uniquement Search -->
      <section>
        <h3>Header with Search Only</h3>
        <base-list-header :list-service="listServiceSearchOnly">
          <template #header>
            <div style="font-weight: bold; padding: 10px; background: #f0f0f0;">
              Search Only Header
            </div>
          </template>
        </base-list-header>
      </section>

      <!-- Cas 3 : Header avec Entity & Sort Only -->
      <section>
        <h3>Header with Entity & Sort Only</h3>
        <base-list-header :list-service="listServiceEntitySort">
          <template #header>
            <div style="font-weight: bold; padding: 10px; background: #f0f0f0;">
              Entity & Sort Header
            </div>
          </template>
        </base-list-header>
      </section>
    </div>
  `,
});
