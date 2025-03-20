import UContextualMenu from '@/modules/common/navigation/UContextualMenu.vue';
import UButton from '@/modules/common/basic/UButton.vue';
import { ref } from 'vue';

export default {
  title: 'Navigation/ContextualMenu',
};

export const ContextualMenu = () => ({
  components: { UContextualMenu, UButton },
  template: `
    <div style="position: relative; height: 600px; padding: 20px;">
      <h3>Basic Contextual Menu</h3>
      <u-button @click="openBasicMenu" style="margin-bottom: 12px;">Open Basic Menu</u-button>
      <u-contextual-menu
        ref="basicMenu"
        :list="basicMenuList"
      >
        <template #title>
          <div style="padding: 4px; font-weight: bold;">Basic Menu Title</div>
        </template>
      </u-contextual-menu>
      
      <h3 style="margin-top: 40px;">Nested Contextual Menu</h3>
      <u-button @click="openNestedMenu" style="margin-bottom: 12px;">Open Nested Menu</u-button>
      <u-contextual-menu
        ref="nestedMenu"
        :list="nestedMenuList"
        :itemWidth="180"
      />
      
      <h3 style="margin-top: 40px;">Contextual Menu with Shortcut</h3>
      <u-button @click="openShortcutMenu" style="margin-bottom: 12px;">Open Menu with Shortcut</u-button>
      <u-contextual-menu
        ref="shortcutMenu"
        :list="shortcutMenuList"
        shortcut="esc"
      />
    </div>
  `,
  setup() {
    const basicMenu = ref(null);
    const nestedMenu = ref(null);
    const shortcutMenu = ref(null);
    const basicMenuList = ref([
      {
        label: 'Itemaaaaaaaaaaaaaaa 1',
        icon: 'icon-add',
        onClick: () => alert('Item 1'),
        children: [
          {
            label: 'Item 1-1',
            onClick: () => alert('Item 1-1'),
          },
          {
            label: 'Item 1-2',
            onClick: () => alert('Item 1-2'),
          },
          {
            label: 'Item 1-3',
            onClick: () => alert('Item 1-3'),
          },
        ],
      },
      {
        label: 'Item 2',
        onClick: () => alert('Item 2'),
        icon: 'icon-activate',
      },
      {
        label: 'Item 3',
        onClick: () => alert('Item 3'),
        icon: 'icon-user',
      },
      {
        label: 'Item 4',
        onClick: () => alert('Item 4'),
        icon: 'icon-user',
        children: [
          {
            label: 'Item 4-1',
            onClick: () => alert('Item 4-1'),
          },
          {
            label: 'Item 4-2',
            onClick: () => alert('Item 4-2'),
          },
          {
            label: 'Item 4-3',
            onClick: () => alert('Item 4-3'),
          },
        ],
      },
    ]);

    // Liste d'items avec sous-menus pour le menu imbriqué
    const nestedMenuList = ref([
      {
        label: 'File',
        children: [
          { label: 'New', onClick: () => alert('New File') },
          { label: 'Open', onClick: () => alert('Open File') },
        ],
      },
      {
        label: 'Edit',
        children: [
          { label: 'Undo', onClick: () => alert('Undo') },
          { label: 'Redo', onClick: () => alert('Redo') },
        ],
      },
    ]);

    // Liste d'items pour le menu avec raccourci
    const shortcutMenuList = ref([
      { label: 'Cut', onClick: () => alert('Cut') },
      { label: 'Copy', onClick: () => alert('Copy') },
      { label: 'Paste', onClick: () => alert('Paste') },
    ]);

    // Fonctions pour ouvrir chaque menu en simulant des coordonnées (axis)
    const openBasicMenu = () => {
      if (basicMenu.value && typeof basicMenu.value.showMenu === 'function') {
        basicMenu.value.showMenu({ x: 100, y: 100 });
      }
    };

    const openNestedMenu = () => {
      if (nestedMenu.value && typeof nestedMenu.value.showMenu === 'function') {
        nestedMenu.value.showMenu({ x: 300, y: 150 });
      }
    };

    const openShortcutMenu = () => {
      if (
        shortcutMenu.value &&
        typeof shortcutMenu.value.showMenu === 'function'
      ) {
        shortcutMenu.value.showMenu({ x: 500, y: 200 });
      }
    };

    return {
      basicMenu,
      nestedMenu,
      shortcutMenu,
      basicMenuList,
      nestedMenuList,
      shortcutMenuList,
      openBasicMenu,
      openNestedMenu,
      openShortcutMenu,
    };
  },
});
