import { UEntityTagSummary } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'others/EntityTagSummary',
  component: UEntityTagSummary,
};

export const TagSummary = () => ({
  components: { UEntityTagSummary },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
    <!-- Cas 1 : Aucun tag -->
    <div>
      <h3>Aucun tag</h3>
      <u-entity-tag-summary :tags="noTags" />
    </div>
    <!-- Cas 2 : Un seul tag, sans affichage du nom (withName = false par défaut) -->
    <div>
      <h3>Un seul tag</h3>
      <u-entity-tag-summary :tags="singleTag" />
    </div>
    <!-- Cas 3 : Plusieurs tags, affichage par défaut (maxVisible = 1) -->
    <div>
      <h3>Plusieurs tags (avec compte caché)</h3>
      <u-entity-tag-summary :tags="multipleTags" :maxVisible="2"/>
    </div>
    <!-- Cas 4 : Plusieurs tags avec affichage du nom (withName = true) -->
    <div>
      <h3>Plusieurs tags (avec nom affiché)</h3>
      <u-entity-tag-summary :tags="multipleTags" withName />
    </div>
  </div>
`,
  setup() {
    // Aucun tag
    const noTags = ref([]);

    // Un seul tag
    const singleTag = ref([{ id: 1, name: 'Tag One', color: 'var(--color-blue-600)' }]);

    // Plusieurs tags (visibleTags = premier tag, hiddenTags = tags supplémentaires)
    const multipleTags = ref([
      { id: 1, name: 'Tag One', color: 'var(--color-red-800)' },
      { id: 2, name: 'Tag Two', color: 'var(--color-yellow-800)' },
      { id: 3, name: 'Tag Three', color: 'green' },
      { id: 4, name: 'Tag Four', color: 'purple' },
    ]);

    return { noTags, singleTag, multipleTags };
  },
});
