import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUsersStore } from '@/stores/modules/users/user';
import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';
import { SecurityLevel } from '@/stores/modules/users/models/UserModel';

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
  authorisation?: {
    level?: SecurityLevel;
    feature?: string;
    action?: string;
    onlyInternal?: boolean;
    allowInternal?: boolean;
    anyOf?: any[]; // Pour les conditions OR
    allOf?: any[]; // Pour les conditions AND
  };
}

function checkAuthorization(item: NavItem): boolean {
  const usersStore = useUsersStore();
  const authorisationsStore = useAuthorisationsStore();

  if (!item.authorisation) {
    return true;
  }

  const auth = item.authorisation;
  const userLevel = usersStore.level;
  const isUserInternal = usersStore.internal;

  // Conditions OR
  if (auth.anyOf) {
    return auth.anyOf.some((condition) =>
      checkAuthorization({ authorisation: condition } as NavItem)
    );
  }

  // Conditions AND
  if (auth.allOf) {
    return auth.allOf.every((condition) =>
      checkAuthorization({ authorisation: condition } as NavItem)
    );
  }

  if (auth.onlyInternal && !isUserInternal) {
    return false;
  }

  if (auth.allowInternal && isUserInternal) {
    return true;
  }
  if (auth.level !== undefined && userLevel < auth.level) {
    return false;
  }
  if (auth.feature && auth.action) {
    if (!authorisationsStore.isUserAllowed(auth.feature, auth.action)) {
      return false;
    }
  }
  return true;
}

export const useNavStore = defineStore('nav', () => {
  // --- State ---
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
          // authorisation: { feature: 'product', action: 'read' },
        },
        {
          name: 'kitchen',
          icon: 'kitchen',
          state: 'kitchen',
          activesStates: ['kitchen'],
          // authorisation: { feature: 'kitchen', action: 'read' },
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
          // authorisation: { feature: 'travel', action: 'read' },
        },
      ],
    },
  ]);

  const settings = ref<NavItem>({
    name: 'settings',
    icon: 'settings',
    children: [
      {
        name: 'users',
        icon: 'users',
        state: 'users',
        activesStates: [
          'users',
          'admin-user-settings-edit',
          'user-settings-creation',
        ],
        authorisation: {
          // feature: 'user',
          // action: 'read',
          level: SecurityLevel.ADMIN,
        },
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
      state: 'user-settings-edit',
    },
    {
      name: 'logout',
      icon: 'logout',
      state: 'logout',
    },
  ]);

  // --- Getters ---

  // Filtre les groupes et leurs enfants selon les autorisations
  const availableGroupsNav = computed<NavItem[]>(() => {
    return groupsNav.value
      .filter((group) => checkAuthorization(group))
      .map((group) => ({
        ...group,
        children: (group.children ?? []).filter((item) =>
          checkAuthorization(item)
        ),
      }))
      .filter((group) => group.children && group.children.length > 0);
  });

  // Filtre les paramètres selon les autorisations
  const availableSettings = computed<NavItem[]>(() => {
    const filteredChildren = (settings.value.children ?? []).filter((item) =>
      checkAuthorization(item)
    );

    return filteredChildren.length > 0
      ? [{ ...settings.value, children: filteredChildren }]
      : [];
  });

  // Filtre les éléments globaux selon les autorisations
  const availableGlobals = computed<NavItem[]>(() => {
    return globals.value.filter((global) => checkAuthorization(global));
  });

  // Trouve le groupe (univers) de l'item de navigation courant
  const currentGroupInfo = computed<NavItem | undefined>(() => {
    const name = currentItem.value;
    const allChildren = availableGroupsNav.value.flatMap((g) =>
      (g.children || []).map((child) => ({ ...child, group: g }))
    );
    return allChildren.find((child) => child.activesStates?.includes(name))
      ?.group;
  });

  // Trouve l'item de menu "settings" si l'item courant est un de ses enfants
  const currentSettingsInfo = computed<NavItem | undefined>(() => {
    const name = currentItem.value;
    const settingsChildren = availableSettings.value[0]?.children ?? [];
    const found = settingsChildren.some((child) =>
      child.activesStates?.includes(name)
    );
    return found ? availableSettings.value[0] : undefined;
  });

  // Détermine le nom du groupe/section actuel ('hotel', 'store', 'settings', ou 'global')
  const currentSectionName = computed<string>(() => {
    if (currentGroupInfo.value) {
      return currentGroupInfo.value.name;
    }
    if (currentSettingsInfo.value) {
      return currentSettingsInfo.value.name;
    }

    const isGlobalRoot = availableGlobals.value.some(
      (g) => g.isRoot && g.activesStates?.includes(currentItem.value)
    );
    if (isGlobalRoot) {
      return 'global';
    }
    return 'global';
  });

  // --- Actions ---

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
    // State
    context,
    currentItem,
    // Raw data (peut être utile pour debug ou admin)
    // groupsNav,
    // settings,
    // globals,
    // Getters filtrés
    availableGroupsNav,
    availableSettings,
    availableGlobals,
    currentSectionName,
    currentGroupInfo,
    currentSettingsInfo,
    // Actions
    setCurrentItem,
    setContext,
    clearContext,
  };
});
