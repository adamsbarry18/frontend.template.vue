<template>
  <u-tooltip
    class="user-info"
    tooltip-class="user-info-tooltip"
    placement="bottom-start"
  >
    <u-color-initials
      :initial="userInitial"
      class="user-initials -button-like"
      size="30"
      font-size="14"
    />
    <template v-slot:content>
      <div class="user-tooltip-content">
        <div class="user-profile-wrapper">
          <u-color-initials
            :initial="userInitial"
            class="user-initials -button-like"
            size="37"
            font-size="17"
          />
          <div class="user-informations">
            <h3>
              {{ userName }}
            </h3>
            <span class="user-email">{{ userEmail }}</span>
          </div>
        </div>
        <div class="user-action">
          <div
            class="-button-like"
            datu-nav="user.view-account"
            @click="goToMyAccountScreen"
          >
            <icon-base
              icon="icon-account"
              size="16"
              color="var(--color-neutral-800)"
            />
            <span>{{ $t('globals.account.title') }}</span>
          </div>
          <div class="-button-like" @click="goToLoginScreen">
            <icon-base
              icon="icon-logout"
              size="16"
              color="var(--color-neutral-800)"
            />
            <span>{{ $t('globals.logout.title') }}</span>
          </div>
        </div>
      </div>
    </template>
  </u-tooltip>
</template>

<script setup lang="ts">
  import { computed, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { UTooltip, UColorInitials, IconBase } from '@/modules/common';

  // Accès au store et au router
  const usersStore = useUsersStore();
  const router = useRouter();

  // Accès à l'utilisateur courant via une propriété globale
  const currentUser = computed(
    () => getCurrentInstance()?.appContext.config.globalProperties.$currentUser
  );

  // Propriétés calculées basées sur currentUser
  const userId = computed(() => currentUser.value?.id ?? 0);
  const userName = computed(() => currentUser.value?.name ?? '');
  const userEmail = computed(() => currentUser.value?.email ?? '');

  // Propriétés calculées basées sur le store
  const userInitial = computed(() => usersStore.getInitial);
  const isInternal = computed(() => usersStore.isInternal);

  // Méthodes de navigation
  const goToLoginScreen = async () => {
    await usersStore.logout();
    router.push({ name: 'login' });
  };

  const goToMyAccountScreen = () => {
    router.push({
      name: 'my-account',
    });
  };
</script>

<style scoped lang="scss">
  .main-header__notifications {
    display: flex;
    position: relative;
    &.circle-bell:after {
      display: block;
      position: absolute;
      top: 25%;
      right: 20%;
      border-radius: 50%;
      background: var(--color-red-500);
      width: 9px;
      height: 9px;
      content: '';
    }
  }
</style>
