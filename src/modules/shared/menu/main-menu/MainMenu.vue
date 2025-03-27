<template>
  <div class="main-menu">
    <base-menu
      :config="config"
      :current-universe="currentUniverse"
      :current-item="currentMenuItem"
      :generate-link="generateLink"
      @menu-click="onMenuClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import BaseMenu from './_components/BaseMenu.vue';
  import { useUsersStore } from '@/stores/users/user';
  import { useMenuStore } from '@/stores/menu/menu';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const usersStore = useUsersStore();
  const menuStore = useMenuStore();

  const currentMenuItem = ref('');
  const menuContext = computed(() => menuStore.context);
  const universes = computed(() => menuStore.availableUniverses);
  const settings = computed(() => menuStore.availableSettings);
  const globals = computed(() => menuStore.availableGlobals);
  const currentItemFromStore = computed(() => menuStore.currentItem);

  const config = computed(() => ({
    currentItem: currentItemFromStore.value,
    context: menuContext.value,
    univers: universes.value,
    settings: settings.value,
    globals: globals.value.filter((g) => g.isRoot),
  }));

  const currentUniverse = computed(() => {
    const name = currentItemFromStore.value;
    const allUniverses = universes.value
      .map((u) => u.subitem?.map((s) => ({ ...s, universe: u.name })) || [])
      .flat(2)
      .filter((i) => !!i) as any[]; // Type assertion needed

    const current = allUniverses.find((u) => u.activesStates?.includes(name));
    if (current) {
      currentMenuItem.value = current.name;
      return current.universe;
    }

    const allSettings = (config.value.settings as any[])
      .map((u) => u.subitem?.map((s) => ({ ...s, settings: u.name })) || [])
      .flat(2)
      .filter((i) => !!i) as any[]; // Type assertion needed

    const currentSetting = allSettings.find((u) =>
      u.activesStates?.includes(name)
    );
    if (currentSetting) {
      currentMenuItem.value = currentSetting.name;
      return currentSetting.settings;
    }

    const currentGlobal = (config.value.globals as any[]).find((g) =>
      g.activesStates?.includes(name)
    );
    if (currentGlobal) {
      currentMenuItem.value = currentGlobal.name;
      return 'global';
    }

    currentMenuItem.value = '';
    return 'global';
  });

  const onMenuClick = (item: any) => {
    switch (item.state) {
      case 'logout':
        goToLogout();
        break;
      default:
        goToState(item);
    }
  };

  const generateLink = (item: any) => {
    if (item.disabled) {
      return '';
    }
    switch (item.state) {
      case 'logout':
        return '#';
      default:
        const resolved = router.resolve(prepareState(item.state));
        return resolved.href;
    }
  };

  const prepareState = (stateName: string) => {
    const state = (router.options.routes as any[]).find(
      (route) => route.name === stateName
    );
    const query: Record<string, any> = {};

    if (state) {
      if (
        menuContext.value.hasOwnProperty(state.name) &&
        (menuContext.value as any)[state.name].hasOwnProperty('query')
      ) {
        Object.assign(query, (menuContext.value as any)[state.name].query);
      }
    } else {
      throw new Error(`State [${stateName}] not implemented`);
    }
    return { name: state.name, query };
  };

  const goToState = (item: any) => {
    router.push(prepareState(item.state));
  };

  const goToLogout = async () => {
    await usersStore.logout();
    router.push({ name: 'login' });
  };
</script>

<style scoped lang="scss">
  .main-menu {
    --base-nav-width: 64px;
    background-color: var(--color-white);
    width: var(--base-nav-width);
    user-select: none;
    flex-shrink: 0;
  }
</style>
