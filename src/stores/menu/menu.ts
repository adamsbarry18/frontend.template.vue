import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface MenuItem {
  name: string;
  icon: string;
  state?: string;
  activesStates?: string[];
  isMainFeature?: boolean;
  subitem?: MenuItem[];
  color?: string;
  isRoot?: boolean;
  disabled?: boolean;
}

export const useMenuStore = defineStore('menu', () => {
  const context = ref<Record<string, any>>({});
  const currentItem = ref<string>('');
  const univers = ref<MenuItem[]>([
    {
      name: 'menu1',
      icon: 'icon-add',
      isMainFeature: true,
      subitem: [
        {
          name: 'profile-search',
          icon: 'qualifications',
          state: 'profile-search',
          activesStates: ['profile-search'],
        },
        {
          name: 'user-report',
          icon: 'users',
          state: 'user-report.socio-demo',
          activesStates: ['user-report.socio-demo'],
        },
      ],
    },
    {
      name: 'menu-store',
      icon: 'icon-store',
      isMainFeature: true,
      subitem: [
        {
          name: 'feeds',
          icon: 'icon-user',
          state: 'feeds.all',
          activesStates: ['feeds.all'],
        },
      ],
    },
  ]);

  const settings = ref<MenuItem>({
    name: 'administration',
    icon: 'settings',
    subitem: [
      {
        name: 'users',
        icon: 'users',
        state: 'users',
        activesStates: ['users', 'user-settings', 'new-user'],
      },
    ],
  });

  const globals = ref<MenuItem[]>([
    {
      isRoot: true,
      name: 'dashboard',
      icon: 'dashboard',
      state: 'dashboard',
      activesStates: ['dashboard'],
    },
    {
      name: 'account',
      icon: 'account',
      state: 'my-account',
    },
    {
      name: 'logout',
      icon: 'logout',
      state: 'logout',
    },
  ]);

  const availableUniverses = computed<MenuItem[]>(() => {
    return univers.value.reduce((acc, universe) => {
      const filteredUniverse: MenuItem = { ...universe, subitem: [] };
      filteredUniverse.subitem = universe.subitem?.filter((item) => item) || [];
      if (filteredUniverse.subitem?.length > 0) {
        acc.push(filteredUniverse);
      }
      return acc;
    }, [] as MenuItem[]);
  });

  const availableSettings = computed<MenuItem[]>(() => {
    const filteredSetting: MenuItem = { ...settings.value, subitem: [] };
    filteredSetting.subitem =
      settings.value.subitem?.filter((item) => item) || [];
    return filteredSetting.subitem?.length > 0 ? [filteredSetting] : [];
  });

  const availableGlobals = computed<MenuItem[]>(() =>
    globals.value.filter((global) => global)
  );

  const currentUniverse = computed<string>(() => {
    const current = currentUniverseInfo.value;
    return current?.name || '';
  });

  const currentUniverseInfo = computed<MenuItem | undefined>(
    (): MenuItem | undefined => {
      const name = currentItem.value;
      const allSubItems = univers.value.flatMap((u) =>
        (u.subitem || []).map((s) => ({ ...s, universe: u }))
      );
      return allSubItems.find((u) => u.activesStates?.includes(name))?.universe;
    }
  );

  function setCurrentItem(value: string) {
    currentItem.value = value;
  }

  function setContext({ stateKey, value }: { stateKey: string; value: any }) {
    context.value[stateKey] = value;
  }

  function clearContext() {
    context.value = {};
  }

  return {
    context,
    currentItem,
    univers,
    settings,
    globals,
    availableUniverses,
    availableSettings,
    availableGlobals,
    currentUniverse,
    currentUniverseInfo,
    setCurrentItem,
    setContext,
    clearContext,
  };
});
