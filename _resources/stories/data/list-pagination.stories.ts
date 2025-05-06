import { UListPagination } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'data/ListPagination',
  component: UListPagination,
};

export const ListPagination = () => ({
  components: { UListPagination },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
    <!-- Cas 1 : Pagination basique -->
    <div>
      <h3>Basic Pagination (Total: 100, Page Size: 25)</h3>
      <u-list-pagination 
        :total="total1"
        :defaultPage="currentPage1"
        :size="25"
        @page-change="onPageChange1"
      />
      <p>Current Page: {{ currentPage1 }}</p>
    </div>
    <!-- Cas 2 : Pagination avec page par défaut personnalisée -->
    <div>
      <h3>Custom Default Pagination (Total: 100, Page Size: 10, Default Page: 3)</h3>
      <u-list-pagination 
        :total="total2"
        :defaultPage="currentPage2"
        :size="10"
        @page-change="onPageChange2"
      />
      <p>Current Page: {{ currentPage2 }}</p>
    </div>
    <!-- Cas 3 : Pagination sans résultats -->
    <div>
      <h3>No Results Pagination (Total: 0)</h3>
      <u-list-pagination 
        :total="total3"
        :defaultPage="currentPage3"
        :size="25"
        @page-change="onPageChange3"
      />
      <p>Current Page: {{ currentPage3 }}</p>
    </div>
  </div>
`,
  setup() {
    // Cas 1 : Pagination basique (Total: 100, Taille de page: 25)
    const total1 = ref(100);
    const currentPage1 = ref(1);
    const onPageChange1 = (page: number) => {
      console.log('Page change (Basic):', page);
      currentPage1.value = page;
    };

    // Cas 2 : Pagination avec page par défaut personnalisée (Total: 100, Taille de page: 10, page par défaut: 3)
    const total2 = ref(100);
    const currentPage2 = ref(3);
    const onPageChange2 = (page: number) => {
      console.log('Page change (Custom Default):', page);
      currentPage2.value = page;
    };

    // Cas 3 : Pagination sans résultats (Total: 0)
    const total3 = ref(0);
    const currentPage3 = ref(1);
    const onPageChange3 = (page: number) => {
      console.log('Page change (No Results):', page);
      currentPage3.value = page;
    };

    return {
      total1,
      currentPage1,
      onPageChange1,
      total2,
      currentPage2,
      onPageChange2,
      total3,
      currentPage3,
      onPageChange3,
    };
  },
});
