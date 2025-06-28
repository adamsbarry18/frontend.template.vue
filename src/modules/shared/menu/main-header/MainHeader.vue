<template>
  <div class="main-header">
    <router-link class="logo-app -button-like" :to="dashboardRedirection">
      <img src="@/assets/images/logo_stock_app.png" alt="app logo" />
    </router-link>
    <breadcrumb
      class="header-breadcrumb"
      :links="breadcrumbLinks"
      :value="breadcrumbValue"
      :editable="breadcrumbValue !== null"
    />
    <user-info />
    <notifications />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  import Breadcrumb from './_components/Breadcrumb.vue';
  import UserInfo from './_components/UserInfo.vue';
  import Notifications from './_components/Notifications.vue';
  import i18n from '@/i18n';
  import { useBreadcrumbStore } from '@/stores/modules/breadcrumb';

  const breadcrumbStore = useBreadcrumbStore();

  const { breadcrumbLinks, breadcrumbValue } = storeToRefs(breadcrumbStore);

  const dashboardRedirection = computed(() => ({
    name: 'dashboard',
  }));

  onMounted(() => {
    watch(breadcrumbLinks, setDocumentTitle, { immediate: true });
  });

  function setDocumentTitle() {
    if (breadcrumbLinks.value) {
      const values = [...breadcrumbLinks.value].reverse().map((l) => l.label);
      document.title = [...values, i18n.global.t('application.name')].join(' - ');
    }
  }
</script>

<style scoped lang="scss">
  .main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 999;
    background: var(--color-white);
    padding: 0 20px;
    width: 100%;
    min-height: var(--header-height);
    user-select: none;
    box-shadow: var(--box-shadow-s);
    border-bottom: 1px solid var(--color-neutral-300);

    .logo-app {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding-right: 12px;

      img {
        height: 32px;
        width: 32px;
      }
    }
    .global-search {
      margin-right: 12px;
    }

    .header-breadcrumb {
      flex: 1;
      border-left: 1px solid var(--color-neutral-300);
      padding-left: 12px;
    }
  }
</style>
