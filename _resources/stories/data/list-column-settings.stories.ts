import UListColumnSettings from '@/commons/data/UListColumnSettings.vue';
import UButton from '@/commons/basic/UButton.vue';
import { ref, provide } from 'vue';
import IconBase from '@/commons/icons/IconBase.vue';

export default {
  title: 'Data/ListColumnSettings',
  component: UListColumnSettings,
};

export const ListColumnSettings = () => ({
  components: { UListColumnSettings, UButton, IconBase },
  setup() {
    // Définition d'un tableau de colonnes
    const columns = ref([
      { key: 'col1', label: 'Column 1' },
      { key: 'col2', label: 'Column 2' },
      { key: 'col3', label: 'Column 3' },
    ]);

    // Valeurs par défaut pour la visibilité des colonnes
    const defaults = ref({
      col1: 'always',
      col2: 'visible',
      col3: 'invisible',
    });

    // État de visibilité des colonnes
    const columnVisibility = {
      'testList@col1': true,
      'testList@col2': true,
      'testList@col3': false,
    };

    provide('listKey', 'testList');
    provide('columnVisibility', columnVisibility);

    // Handlers pour les événements émis par le composant
    const onColumnVisibilityChange = (columnId, visible) => {
      columnVisibility[columnId] = visible;
      console.log('Column visibility changed:', columnVisibility);
    };

    // Référence pour accéder aux méthodes publiques du composant
    const settingsRef = ref(null);

    // Fonction pour ouvrir le panneau de réglages
    const openSettings = () => {
      settingsRef.value.showSettings();
    };

    return {
      columns,
      defaults,
      columnVisibility,
      onColumnVisibilityChange,
      settingsRef,
      openSettings,
    };
  },
  template: `
    <div style="padding: 20px;">
      <h3>List Column Settings Example</h3>
        <icon-base
          icon="icon-settings"
          class="column-settings-button -button-like"
          :size="24"
          @click="openSettings"
        />
      <u-list-column-settings
        ref="settingsRef"
        :columns="columns"
        :defaults="defaults"
        @column-visibility-change="onColumnVisibilityChange"
      />
    </div>
  `,
});
