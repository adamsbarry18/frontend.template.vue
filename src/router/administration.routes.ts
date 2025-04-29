import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
import { RouteRecordRaw } from 'vue-router';

const administrationRoutes: RouteRecordRaw[] = [
  // Route pour la page "Mon Compte" de l'utilisateur connecté
  {
    path: '/account/settings', // Nouveau chemin dédié
    name: 'user-settings-edit', // Nom de route cohérent avec nav.ts et UserInfo.vue
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: { mode: 'user-edit' }, // Mode spécifique pour l'édition par l'utilisateur
    meta: {
      // Le breadcrumb est géré dynamiquement dans UserSettings.vue pour ce mode.
      // Authentification requise par défaut.
    },
  },
  // Section Administration (accessible uniquement aux admins)
  {
    path: '/admin/users', // Chemin préfixé par /admin pour clarté
    name: 'users', // Nom pour la liste des utilisateurs
    component: () => import('@/modules/users/_views/Users.vue'),
    meta: {
      breadcrumb: [{ label: 'admin.users' }], // Breadcrumb pour la liste admin
      authorisation: {
        level: SecurityLevel.ADMIN, // Seuls les admins peuvent accéder
      },
    },
  },
  {
    path: '/admin/users/settings/:id(\\d+)', // Chemin admin + ID numérique
    name: 'admin-user-settings-edit', // Nom distinct pour l'édition par l'admin
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    // Passer l'ID comme prop numérique et le mode admin
    props: (route) => ({ mode: 'admin-edit', id: Number(route.params.id) }),
    meta: {
      // Le breadcrumb est géré dynamiquement dans UserSettings.vue pour ce mode.
      authorisation: {
        level: SecurityLevel.ADMIN, // Seuls les admins peuvent éditer d'autres utilisateurs
      },
    },
  },
  {
    path: '/admin/users/new', // Chemin admin pour la création
    name: 'user-settings-creation', // Nom distinct pour la création par l'admin
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: { mode: 'creation' }, // Mode spécifique pour la création
    meta: {
      // Le breadcrumb est géré dynamiquement dans UserSettings.vue pour ce mode.
      authorisation: {
        level: SecurityLevel.ADMIN, // Seuls les admins peuvent créer des utilisateurs
      },
    },
  },
  // Les anciennes routes 'my-account', 'user-settings' et 'new-user' ont été
  // remplacées/renommées par les routes ci-dessus pour plus de clarté et de cohérence.
];

export default administrationRoutes;
