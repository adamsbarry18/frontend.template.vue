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
  import { useNavStore, NavItem } from '@/stores/modules/menu/nav';

  const router = useRouter();
  const usersStore = useUsersStore();
  const navStore = useNavStore();
  const {
    availableGroupsNav,
    availableSettings,
    availableGlobals,
    currentItem,
    currentSectionName,
    context,
  } = storeToRefs(navStore);

  const navConfig = computed(() => ({
    currentItem: currentItem.value,
    context: context.value,
    univers: availableGroupsNav.value,
    settings: availableSettings.value,
    globals: availableGlobals.value.filter((g) => g.isRoot),
  }));

  function onMenuClick(item: NavItem) {
    switch (item.state) {
      case 'logout':
        goToLogout();
        break;
      default:
        if (item.state) {
          goToState(item);
        } else {
          console.warn(
            `Menu item "${item.name}" clicked but has no state defined.`
          );
        }
    }
  }
  function generateLink(item: NavItem): string {
    if (item.disabled || !item.state) return '';
    try {
      const resolved = router.resolve(prepareState(item.state));
      return resolved.href;
    } catch (e) {
      console.error(`Could not resolve route for state: ${item.state}`, e);
      return '';
    }
  }

  function prepareState(stateName: string) {
    const route = router.options.routes.find((r) => r.name === stateName);
    const query: Record<string, any> = {};

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
  function goToState(item: NavItem) {
    if (!item.state) return;
    const location = prepareState(item.state);
    if (location && location.name) {
      router.push(location);
    }
  }

  // Gère la déconnexion
  async function goToLogout() {
    try {
      await usersStore.logout();
      router.push({ name: 'login' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
</script>

<style scoped lang="scss">
  .main-nav {
    background-color: var(--color-white);
    width: var(--base-nav-width, 64px);
    user-select: none;
    flex-shrink: 0;
  }
</style>
