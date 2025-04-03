import { ref } from 'vue';
import { UButton, UExplorer } from '@/modules/common';

export default {
  title: 'Navigation/Explorer',
};

interface ExplorerItem {
  id: number | string;
  label: string;
  icon: string;
  disabled?: boolean;
  unselectable?: boolean;
  parentLabel?: string;
}

export const Explorer = () => ({
  components: { UExplorer, UButton },
  template: `
    <div style="position: relative; background-color: var(--color-neutral-800); display: flex; flex-direction: column">
      <u-button 
        style="margin-top: 400px; margin-bottom: 100px" 
        ref="button" 
        @click="displayExplorer" 
        type="default">
        Show
      </u-button>
      <u-button 
        style="margin-top: 100px; margin-bottom: 400px" 
        ref="button2" 
        @click="displayExplorerWithoutRoot" 
        type="default">
        Show without root
      </u-button>
      <u-explorer :list="list" ref="explorer" />
    </div>
  `,
  setup() {
    // Références vers les composants
    const explorer = ref<InstanceType<typeof UExplorer> | null>(null);
    const button = ref<HTMLElement | null>(null);
    const button2 = ref<HTMLElement | null>(null);

    // Exemple de données pour l'explorateur
    const list: ExplorerItem[] = [
      { id: 1, label: 'Folder 1', icon: 'icon-folder' },
      { id: 2, label: 'Folder 2', icon: 'icon-folder', disabled: true },
      { id: 3, label: 'Folder 3', icon: 'icon-folder' },
    ];

    // Cas de test 1 : affichage de l'explorateur avec un item racine
    function displayExplorer(): void {
      if (explorer.value && button.value) {
        explorer.value.showExplorer({
          id: 0,
          label: 'Root Folder',
          icon: 'icon-folder',
          parentLabel: '',
        });
      }
    }

    // Cas de test 2 : affichage de l'explorateur sans item racine (null)
    function displayExplorerWithoutRoot(): void {
      if (explorer.value && button2.value) {
        explorer.value.showExplorer();
      }
    }

    return {
      explorer,
      button,
      button2,
      list,
      displayExplorer,
      displayExplorerWithoutRoot,
    };
  },
});
