<template>
  <div class="main-nav">
    <base-nav
      :config="navConfig"
      :current-group="currentSectionName"
      :current-item="currentItem"
      :generate-link="generateLink"
      @nav-click="onMenuClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import BaseNav from './_components/BaseNav.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNavStore, NavItem } from '@/stores/modules/menu/nav'; // Importer NavItem

  const router = useRouter();
  const usersStore = useUsersStore();
  const navStore = useNavStore();

  // Utiliser storeToRefs pour obtenir des références réactives aux getters et états du store
  const {
    availableGroupsNav,
    availableSettings,
    availableGlobals,
    currentItem,
    currentSectionName, // Utiliser le nouveau getter pour la section active
    context, // Garder le contexte si nécessaire pour prepareState
  } = storeToRefs(navStore);

  // Créer la configuration pour BaseNav en utilisant les getters du store
  const navConfig = computed(() => ({
    currentItem: currentItem.value,
    context: context.value,
    univers: availableGroupsNav.value,
    settings: availableSettings.value,
    // Filtrer les globals pour ne garder que ceux marqués comme root pour la barre principale
    globals: availableGlobals.value.filter((g) => g.isRoot),
  }));

  // La logique pour déterminer le groupe/item actif est maintenant dans le store (currentSectionName, currentItem)
  // Plus besoin de currentGroupNav et currentNavItem locaux

  function onMenuClick(item: NavItem) {
    switch (item.state) {
      case 'logout':
        goToLogout();
        break;
      default:
        if (item.state) {
          // S'assurer qu'il y a un état à naviguer
          goToState(item);
        } else {
          console.warn(
            `Menu item "${item.name}" clicked but has no state defined.`
          );
        }
    }
  }

  // Génère le lien href pour un item de menu (utilisé par BaseNav pour les `<a>`)
  function generateLink(item: NavItem): string {
    if (item.disabled || !item.state) return ''; // Ne pas générer de lien si désactivé ou pas d'état
    try {
      const resolved = router.resolve(prepareState(item.state));
      return resolved.href;
    } catch (e) {
      console.error(`Could not resolve route for state: ${item.state}`, e);
      return ''; // Retourner une chaîne vide en cas d'erreur
    }
  }

  // Prépare l'objet de localisation pour la navigation (nom de route + query)
  function prepareState(stateName: string) {
    const route = router.options.routes.find((r) => r.name === stateName);
    const query: Record<string, any> = {};

    // Vérifier si un contexte existe pour cette route et s'il contient des query params
    if (context.value[stateName] && context.value[stateName].query) {
      Object.assign(query, context.value[stateName].query);
    }

    if (!route) {
      console.warn(
        `State [${stateName}] not found in router configuration. Cannot navigate.`
      );
      // Retourner un objet vide ou la route actuelle pour éviter une erreur complète ?
      // Ou lancer une erreur ? Pour l'instant, on retourne un objet vide.
      return {};
    }
    return { name: route.name, query };
  }

  // Navigue vers l'état défini pour l'item de menu
  function goToState(item: NavItem) {
    if (!item.state) return;
    const location = prepareState(item.state);
    // S'assurer que la location a un nom avant de pousser
    if (location && location.name) {
      router.push(location);
    }
  }

  // Gère la déconnexion
  async function goToLogout() {
    try {
      await usersStore.logout();
      // Rediriger vers la page de login après déconnexion réussie
      router.push({ name: 'login' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Afficher une notification d'erreur si nécessaire
    }
  }

  // Le router.beforeEach pour mettre à jour currentItem est maintenant dans src/router/index.ts
  // Il n'est plus nécessaire ici.
</script>

<style scoped lang="scss">
  .main-nav {
    background-color: var(--color-white);
    width: var(--base-nav-width, 64px);
    user-select: none;
    flex-shrink: 0;
  }
</style>
