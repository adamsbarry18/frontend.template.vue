import USortableList from '@/commons/data/USortableList.vue';
import { ref } from 'vue';
import { action } from '@storybook/addon-actions';
import IconBase from '@/commons/icons/IconBase.vue';

export default {
  title: 'data/SortableList',
  component: USortableList,
};

export const SortableList = () => ({
  components: { USortableList, IconBase },
  setup() {
    // Exemple de données pour la liste triable
    const itemsEnabled = ref([
      { id: 1, name: 'Item One', info: 'This is the first item.' },
      { id: 2, name: 'Item Two', info: 'This is the second item.' },
      { id: 3, name: 'Item Three', info: 'This is the third item.' },
      { id: 4, name: 'Item Four', info: 'This is the fourth item.' },
    ]);
    // Copie pour le cas désactivé
    const itemsDisabled = ref([...itemsEnabled.value]);

    // Actions pour les événements (utilisés par le composant via v-model et changements)
    const onChange = action('change');

    return { itemsEnabled, itemsDisabled, onChange };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <!-- Cas 1: Liste triable activée -->
      <section>
        <h3>Enabled Sortable List</h3>
        <u-sortable-list v-model="itemsEnabled" @change="onChange">
          <template #header>
            <tr class="u-sortable-list-header">
              <th style="width: 64px;">Handle</th>
              <th>Name</th>
              <th>Info</th>
            </tr>
          </template>
          <template #default="{ item }">
            <tr class="u-sortable-list-item">
              <td class="u-sortable-list-handle">
                <icon-base icon="icon-draggable" :size="24" />
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.info }}</td>
            </tr>
          </template>
        </u-sortable-list>
      </section>

      <!-- Cas 2: Liste triable désactivée -->
      <section>
        <h3>Disabled Sortable List</h3>
        <u-sortable-list v-model="itemsDisabled" :disabled="true">
          <template #header>
            <tr class="u-sortable-list-header">
              <th style="width: 64px;">Handle</th>
              <th>Name</th>
              <th>Info</th>
            </tr>
          </template>
          <template #default="{ item }">
            <tr class="u-sortable-list-item">
              <td class="u-sortable-list-handle">
                <icon-base icon="icon-add" :size="24" />
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.info }}</td>
            </tr>
          </template>
        </u-sortable-list>
      </section>
    </div>
  `,
});
