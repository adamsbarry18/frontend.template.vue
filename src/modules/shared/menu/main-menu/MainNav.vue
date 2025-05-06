<template>
  <div class="main-nav">
    <base-nav
      :config="navConfig"
      :current-group="currentSectionName"
      :current-item="currentItem"
      :generate-link="generateLink"
      @nav-click="onMenuClick"
      @update:extended="onBaseNavExtendedUpdate"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import BaseNav from './_components/BaseNav.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNavStore, NavItem } from '@/stores/modules/menu/nav';

  const router = useRouter();
  const usersStore = useUsersStore();
  const navStore = useNavStore();
  const emit = defineEmits(['update:nav-extended']);

  const isNavExtendedOverall = ref(false);
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

  function onBaseNavExtendedUpdate(isExtended: boolean) {
    isNavExtendedOverall.value = isExtended;
    emit('update:nav-extended', isExtended);
  }

  function onMenuClick(item: NavItem) {
    switch (item.state) {
      case 'logout':
        goToLogout();
        break;
      default:
        if (item.state) {
          goToState(item);
        } else {
          console.warn(`Menu item "${item.name}" clicked but has no state defined.`);
        }
    }
  }
  function generateLink(item: NavItem): string {
    if (item.disabled || !item.state) return '';
    try {
      const location = prepareState(item.state);
      if (!location) {
        return '';
      }
      const resolved = router.resolve(location);
      return resolved.href;
    } catch (e) {
      console.error(`Could not resolve route for state: ${item.state}`, e);
      return '';
    }
  }

  function prepareState(stateName: string): { name: string; query: Record<string, any> } | null {
    const route = router.options.routes.find((r) => r.name === stateName);
    const query: Record<string, any> = {};

    if (context.value[stateName] && context.value[stateName].query) {
      Object.assign(query, context.value[stateName].query);
    }

    if (!route) {
      console.warn(
        `State [${stateName}] not found in router configuration. Cannot generate link or navigate.`
      );
      return null;
    }
    const routeName = route.name as string;
    return { name: routeName, query };
  }

  function goToState(item: NavItem) {
    if (!item.state) return;
    const location = prepareState(item.state);
    // Vérifie que location n'est pas null avant de tenter la navigation.
    if (location) {
      router.push(location).catch((err) => {
        // Ajout d'une gestion d'erreur pour router.push, au cas où la navigation échouerait pour une autre raison.
        console.error(`Navigation failed for state [${item.state}]:`, err);
      });
    }
  }

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
    position: relative;
    z-index: 100;
  }
</style>
