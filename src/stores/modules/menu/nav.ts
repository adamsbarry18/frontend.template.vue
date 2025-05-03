import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUsersStore } from '@/stores/modules/users/user';
import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';
import { SecurityLevel } from '@/stores/modules/users/models/UserModel'; // Importer SecurityLevel

// Interface pour les éléments de navigation
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
    // Utiliser une interface plus stricte si possible
    level?: SecurityLevel;
    feature?: string;
    action?: string;
    onlyInternal?: boolean;
    allowInternal?: boolean;
    anyOf?: any[]; // Pour les conditions OR
    allOf?: any[]; // Pour les conditions AND
  };
}

// Fonction utilitaire pour vérifier les autorisations (peut être interne au store)
function checkAuthorization(item: NavItem): boolean {
  const usersStore = useUsersStore();
  const authorisationsStore = useAuthorisationsStore();

  // Si pas de champ authorisation, l'accès est autorisé
  if (!item.authorisation) {
    return true;
  }

  const auth = item.authorisation;
  const userLevel = usersStore.level; // Utiliser le getter du store user
  const isUserInternal = usersStore.internal; // Utiliser le getter du store user

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

  // Vérification spécifique interne/externe
  if (auth.onlyInternal && !isUserInternal) {
    return false;
  }
  // Si allowInternal est vrai et l'utilisateur est interne, on autorise directement
  if (auth.allowInternal && isUserInternal) {
    return true;
  }

  // Vérification du niveau (si défini)
  if (auth.level !== undefined && userLevel < auth.level) {
    return false;
  }

  // Vérification de la feature/action (si définie)
  if (auth.feature && auth.action) {
    // Utiliser le getter isUserAllowed qui encapsule hasCurrentUserAuthorisation
    if (!authorisationsStore.isUserAllowed(auth.feature, auth.action)) {
      return false;
    }
  }

  // Si toutes les vérifications passent (ou aucune n'est applicable après les checks internes/niveau)
  return true;
}

export const useNavStore = defineStore('nav', () => {
  // --- State ---
  const context = ref<Record<string, any>>({});
  const currentItem = ref<string>(''); // Nom de l'état/route actuel

  // Définition statique des menus (pourrait venir d'une config externe)
  const groupsNav = ref<NavItem[]>([
    {
      name: 'hotel',
      icon: 'hotel',
      isPrimary: true,
      children: [
        {
          name: 'product',
          icon: 'product',
          state: 'product', // Nom de la route Vue
          activesStates: ['product'], // Routes qui activent cet item
          authorisation: { feature: 'product', action: 'read' },
        },
        {
          name: 'kitchen',
          icon: 'kitchen',
          state: 'kitchen',
          activesStates: ['kitchen'],
          authorisation: { feature: 'kitchen', action: 'read' },
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
          authorisation: { feature: 'travel', action: 'read' },
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
        state: 'users', // Route pour la liste des utilisateurs
        activesStates: [
          'users', // Liste des utilisateurs
          'admin-user-settings-edit', // Édition d'un utilisateur par l'admin
          'user-settings-creation', // Création d'un utilisateur par l'admin
        ],
        authorisation: {
          // feature: 'user',
          // action: 'read',
          level: SecurityLevel.ADMIN, // Niveau requis pour voir la section utilisateurs
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
      // Accessible à tous les utilisateurs connectés par défaut
    },
    {
      name: 'account',
      icon: 'account',
      state: 'user-settings-edit', // Redirige vers les paramètres de l'utilisateur courant
      // Pas d'activesStates spécifiques, géré par le contexte utilisateur
    },
    {
      name: 'logout',
      icon: 'logout',
      state: 'logout', // Pas une vraie route, déclenche une action
    },
  ]);

  // --- Getters ---

  // Filtre les groupes et leurs enfants selon les autorisations
  const availableGroupsNav = computed<NavItem[]>(() => {
    return groupsNav.value
      .filter((group) => checkAuthorization(group)) // Vérifier l'autorisation du groupe lui-même si nécessaire
      .map((group) => ({
        ...group,
        children: (group.children ?? []).filter((item) =>
          checkAuthorization(item)
        ),
      }))
      .filter((group) => group.children && group.children.length > 0); // Garder seulement les groupes avec enfants autorisés
  });

  // Filtre les paramètres selon les autorisations
  const availableSettings = computed<NavItem[]>(() => {
    const filteredChildren = (settings.value.children ?? []).filter((item) =>
      checkAuthorization(item)
    );
    // Retourner la section settings seulement si elle a des enfants autorisés
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
    // Chercher dans les groupes disponibles
    const allChildren = availableGroupsNav.value.flatMap((g) =>
      (g.children || []).map((child) => ({ ...child, group: g }))
    );
    return allChildren.find((child) => child.activesStates?.includes(name))
      ?.group;
  });

  // Trouve l'item de menu "settings" si l'item courant est un de ses enfants
  const currentSettingsInfo = computed<NavItem | undefined>(() => {
    const name = currentItem.value;
    // Chercher dans les settings disponibles
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
    // Vérifier si l'item courant est un global root
    const isGlobalRoot = availableGlobals.value.some(
      (g) => g.isRoot && g.activesStates?.includes(currentItem.value)
    );
    if (isGlobalRoot) {
      return 'global'; // Ou le nom spécifique du global si pertinent
    }
    return 'global'; // Fallback
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
    // Getters d'état courant
    currentSectionName, // Remplacer currentGroup
    currentGroupInfo, // Garder pour l'icône/couleur si besoin
    currentSettingsInfo, // Pour l'icône/couleur des settings
    // Actions
    setCurrentItem,
    setContext,
    clearContext,
  };
});
