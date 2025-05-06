import { UFunnel } from '@/modules/ui';

export default {
  title: 'data/Funnels',
  component: UFunnel,
};

export const Funnel = () => ({
  components: { UFunnel },
  template: `
  <div class="-card-like" style="display: flex; flex-direction: column; gap: 60px;">

   <div>
     <h4>Funnel cool</h4>
      <p class="-description">Description</p>
      <u-funnel
        :data="data1"
        :categories="categoryLabels"
      />
    </div>

    <!-- Cas par défaut -->
    <div>
      <h3>Default Case</h3>
      <u-funnel 
        :data="defaultGraphData" 
        :categories="defaultCategories" 
      />
    </div>
    
    <!-- Cas avec plusieurs catégories -->
    <div>
      <h3>Many Categories</h3>
      <u-funnel 
        :data="manyGraphData" 
        :categories="manyCategories" 
        graphHeight="300px" 
      />
    </div>
    
    <!-- Cas sans données -->
    <div>
      <h3>No Data</h3>
      <u-funnel 
        :data="noGraphData" 
        :categories="defaultCategories" 
      />
    </div>
  </div>
`,
  setup() {
    const data1 = [
      [0, 90000, 'Visiteurs anonymes'],
      [1, 25000, 'Visiteurs anonymes'],
      [2, 12000, 'Visiteurs anonymes estimé'],
      [0, 100000, 'Clients reconnus'],
      [1, 20000, 'Clients reconnus'],
      [2, 8000, 'Clients reconnus'],
    ];
    const categoryLabels = ['Visites Web', 'Intentions', 'Transactions'].map((label) => ({ label }));
    // Cas par défaut : trois catégories simples avec données d'exemple
    const defaultCategories = [
      { label: 'Category A', subtitle: 'A' },
      { label: 'Category B', subtitle: 'B' },
      { label: 'Category C', subtitle: 'C' },
    ];
    const defaultGraphData = [
      [0, 100, 'Dimension 1'],
      [0, 150, 'Dimension 2'],
      [1, 80, 'Dimension 1'],
      [1, 120, 'Dimension 3'],
      [2, 60, 'Dimension 1'],
      [2, 90, 'Dimension 2'],
    ];

    // Cas avec un nombre plus important de catégories
    const manyCategories = [
      { label: 'Cat 1', subtitle: 'One' },
      { label: 'Cat 2', subtitle: 'Two' },
      { label: 'Cat 3', subtitle: 'Three' },
      { label: 'Cat 4', subtitle: 'Four' },
      { label: 'Cat 5', subtitle: 'Five' },
    ];
    const manyGraphData = [
      [0, 200, 'Dim A'],
      [0, 150, 'Dim B'],
      [1, 180, 'Dim A'],
      [1, 130, 'Dim B'],
      [2, 160, 'Dim A'],
      [2, 110, 'Dim B'],
      [3, 140, 'Dim A'],
      [3, 100, 'Dim B'],
      [4, 120, 'Dim A'],
      [4, 80, 'Dim B'],
    ];

    // Cas sans données : graphData vide (affiche ChartNoData)
    const noGraphData: any[] = [];

    return {
      data1,
      categoryLabels,
      defaultCategories,
      defaultGraphData,
      manyCategories,
      manyGraphData,
      noGraphData,
    };
  },
});
