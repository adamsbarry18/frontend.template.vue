import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface NavItem {
  name: string;
  icon: string;
  state?: string;
  activesStates?: string[];
  isPrimary?: boolean;
  children?: NavItem[];
  color?: string;
  isRoot?: boolean;
  disabled?: boolean;
}

export const useNavStore = defineStore('nav', () => {
  const context = ref<Record<string, any>>({});
  const currentItem = ref<string>('');
  const groupsNav = ref<NavItem[]>([
    {
      name: 'hotel',
      icon: 'hotel',
      isPrimary: true,
      children: [
        {
          name: 'product',
          icon: 'product',
          state: 'product',
          activesStates: ['product'],
        },
        {
          name: 'kitchen',
          icon: 'kitchen',
          state: 'kitchen',
          activesStates: ['kitchen'],
        },
      ],
    },
    {
      name: 'store',
      icon: 'store',
      isPrimary: true,
      children: [
        {
          name: 'travel',
          icon: 'travel',
          state: 'travel',
          activesStates: ['travel'],
        },
      ],
    },
  ]);

  const settings = ref<NavItem>({
    name: 'settings',
    icon: 'settings',
    children: [
      {
        name: 'preferences',
        icon: 'vehicle',
        state: 'preferences',
        activesStates: ['preferences', 'other-preferences'],
      },
    ],
  });

  const globals = ref<NavItem[]>([
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
      state: 'account',
    },
    {
      name: 'logout',
      icon: 'logout',
      state: 'logout',
    },
  ]);

  const availableGroupsNav = computed<NavItem[]>(() => {
    return groupsNav.value.reduce((acc, group) => {
      const filteredGroup: NavItem = { ...group, children: [] };
      filteredGroup.children = group.children?.filter((item) => !!item) || [];
      if (filteredGroup.children.length > 0) {
        acc.push(filteredGroup);
      }
      return acc;
    }, [] as NavItem[]);
  });

  const availableSettings = computed<NavItem[]>(() => {
    const filteredSettings: NavItem = { ...settings.value, children: [] };
    filteredSettings.children =
      settings.value.children?.filter((item) => !!item) || [];
    return filteredSettings.children.length > 0 ? [filteredSettings] : [];
  });

  const availableGlobals = computed<NavItem[]>(() =>
    globals.value.filter((g) => !!g)
  );

  const currentGroup = computed<string>(() => {
    const current = currentGroupInfo.value;
    return current?.name || '';
  });

  const currentGroupInfo = computed<NavItem | undefined>(() => {
    const name = currentItem.value;
    const allChildren = groupsNav.value.flatMap((g) =>
      (g.children || []).map((child) => ({ ...child, group: g }))
    );
    return allChildren.find((child) => child.activesStates?.includes(name))
      ?.group;
  });

  function setCurrentItem(value: string) {
    currentItem.value = value;
  }

  function setContext({ key, value }: { key: string; value: any }) {
    context.value[key] = value;
  }

  function clearContext() {
    context.value = {};
  }

  return {
    context,
    currentItem,
    groupsNav,
    settings,
    globals,
    availableGroupsNav,
    availableSettings,
    availableGlobals,
    currentGroup,
    currentGroupInfo,
    setCurrentItem,
    setContext,
    clearContext,
  };
});
