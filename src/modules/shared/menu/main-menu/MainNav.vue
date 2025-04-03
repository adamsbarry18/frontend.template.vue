<template>
  <div class="main-nav">
    <base-nav
      :config="config"
      :current-group="currentGroupNav"
      :current-item="currentNavItem"
      :generate-link="generateLink"
      @nav-click="onMenuClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import BaseNav from './_components/BaseNav.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNavStore } from '@/stores/modules/menu/nav';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const usersStore = useUsersStore();
  const navStore = useNavStore();

  const currentNavItem = ref('');
  const config = computed(() => ({
    currentItem: navStore.currentItem,
    context: navStore.context,
    univers: navStore.availableGroupsNav,
    settings: navStore.availableSettings,
    globals: navStore.availableGlobals.filter((g) => g.isRoot),
  }));

  const currentGroupNav = computed(() => {
    const name = navStore.currentItem;
    const allGroupsNav = navStore.availableGroupsNav.flatMap((group) =>
      (group.children || []).map((child) => ({ ...child, group: group.name }))
    );
    const current = allGroupsNav.find((child) =>
      child.activesStates?.includes(name)
    );
    if (current) {
      currentNavItem.value = current.name;
      return current.group;
    }
    const allSettings = navStore.availableSettings
      .map(
        (g) =>
          g.children?.map((child) => ({ ...child, settings: g.name })) || []
      )
      .flat()
      .filter((i) => !!i);
    const currentSetting = allSettings.find((child) =>
      child.activesStates?.includes(name)
    );
    if (currentSetting) {
      currentNavItem.value = currentSetting.name;
      return currentSetting.settings;
    }
    const currentGlobal = navStore.availableGlobals.find((g) =>
      g.activesStates?.includes(name)
    );
    if (currentGlobal) {
      currentNavItem.value = currentGlobal.name;
      return 'global';
    }
    currentNavItem.value = '';
    return 'global';
  });

  function onMenuClick(item: any) {
    switch (item.state) {
      case 'logout':
        goToLogout();
        break;
      default:
        goToState(item);
    }
  }

  function generateLink(item: any): string {
    if (item.disabled) return '';
    const resolved = router.resolve(prepareState(item.state));
    return resolved.href;
  }

  function prepareState(stateName: string) {
    const route = (router.options.routes as any[]).find(
      (r) => r.name === stateName
    );
    const query: Record<string, any> = {};
    if (
      route &&
      navStore.context[route.name] &&
      navStore.context[route.name].query
    ) {
      Object.assign(query, navStore.context[route.name].query);
    }
    if (!route) {
      console.warn(
        `State [${stateName}] not implemented; using current route as fallback.`
      );
      return { name: router.currentRoute.value.name, query };
    }
    return { name: route.name, query };
  }

  function goToState(item: any) {
    router.push(prepareState(item.state));
  }

  async function goToLogout() {
    await usersStore.logout();
    router.push({ name: 'login' });
  }

  router.beforeEach((to, from, next) => {
    if (to.name) {
      console.log('Navigating to:', to.name);
      navStore.setCurrentItem(to.name as string);
    }
    next();
  });
</script>

<style scoped lang="scss">
  .main-nav {
    background-color: var(--color-white);
    width: var(--base-nav-width, 64px);
    user-select: none;
    flex-shrink: 0;
  }
</style>
