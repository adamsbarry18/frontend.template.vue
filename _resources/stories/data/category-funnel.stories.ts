import UCategoryFunnel from '@/modules/common/data/UCategoryFunnel.vue';
import { ref } from 'vue';

export default {
  title: 'data/CategoryFunnel',
  component: UCategoryFunnel,
};

export const CategoryFunnel = () => ({
  components: { UCategoryFunnel },
  template: `
  <div style="display: flex; flex-direction: column; gap: 60px;">
    <!-- Cas par défaut -->
    <div>
      <h3>Usage par défaut</h3>
      <u-categoryFunnel :categories="defaultCategories" :colors="customColors"/>
    </div>
    
    <!-- Cas avec couleurs personnalisées -->
    <div>
      <h3>Couleurs personnalisées et grandes valeurs</h3>
      <u-categoryFunnel :categories="defaultCategories" :colors="customColors" />
    </div>
    
    <!-- Cas avec un grand nombre de catégories -->
    <div>
      <h3>Beaucoup de catégories</h3>
      <u-categoryFunnel :categories="manyCategories" :colors="colors" />
    </div>
  </div>
`,
  setup() {
    // Cas par défaut avec trois catégories
    const defaultCategories = ref([
      { title: 'Catégorie 1', value: 125_000_000, subtitle: 'Sous-titre 1' },
      { title: 'Catégorie 2', value: 62_250_000, subtitle: 'Sous-titre 2' },
      { title: 'Catégorie 3', value: 26_300_000, subtitle: 'Sous-titre 3' },
    ]);

    // Cas avec couleurs personnalisées
    const customColors = ref(['#FF6B6B', '#4ECDC4', '#556270']);
    const colors = ref(['blue', 'green', 'orange', 'pink', 'cyan']);

    // Cas avec un plus grand nombre de catégories
    const manyCategories = ref([
      { title: 'A', value: 150, subtitle: 'Première' },
      { title: 'B', value: 130, subtitle: 'Deuxième' },
      { title: 'C', value: 110, subtitle: 'Troisième' },
      { title: 'D', value: 90, subtitle: 'Quatrième' },
      { title: 'E', value: 70, subtitle: 'Cinquième' },
    ]);

    return {
      defaultCategories,
      customColors,
      manyCategories,
      colors,
    };
  },
});
