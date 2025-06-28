<template>
  <u-tooltip v-if="currentUser" class="user-info" tooltip-class="user-info-tooltip" placement="bottom-start">
    <u-color-initials
      :initial="userInitial"
      :color="userColor"
      class="user-initials -button-like"
      size="30"
      font-size="14"
    />
    <template v-slot:content>
      <div class="user-tooltip-content">
        <div class="user-profile-wrapper">
          <u-color-initials
            :initial="userInitial"
            :color="userColor"
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
          <div class="-button-like" datu-nav="user.view-account" @click="goToMyAccountScreen">
            <icon-base icon="icon-account" size="16" color="var(--color-neutral-800)" />
            <span>{{ $t('globals.account.title') }}</span>
          </div>
          <div class="-button-like" @click="goToLogout">
            <icon-base icon="icon-logout" size="16" color="var(--color-neutral-800)" />
            <span>{{ $t('globals.logout.title') }}</span>
          </div>
        </div>
      </div>
    </template>
  </u-tooltip>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { UTooltip, UColorInitials } from '@/modules/ui';
  import IconBase from '@/modules/ui/icons/IconBase.vue';

  const usersStore = useUsersStore();
  const router = useRouter();

  const { currentUser, getInitial: userInitial, email: userEmail } = storeToRefs(usersStore);

  const userName = computed(() => currentUser.value?.fullName ?? '');
  const userColor = computed(() => usersStore.userColorFromId(currentUser.value?.id ?? 0));

  const goToLogout = async () => {
    await usersStore.logout();
    router.push({ name: 'login' });
  };

  const goToMyAccountScreen = () => {
    if (currentUser.value?.id) {
      router.push({
        name: 'user-settings-edit',
      });
    } else {
      console.error('Cannot navigate to account screen: current user ID is missing.');
    }
  };
</script>

<style scoped lang="scss">
  .user-info {
    margin-left: 15px;
    cursor: pointer;
  }

  .user-tooltip-content {
    padding: 10px;
    min-width: 200px;

    .user-profile-wrapper {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid var(--color-neutral-200);

      .user-initials {
        margin-right: 10px;
      }

      .user-informations {
        display: flex;
        flex-direction: column;
        overflow: hidden;

        h3 {
          margin: 0;
          font-size: var(--paragraph-01);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: var(--paragraph-03);
          color: var(--color-neutral-600);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .user-action {
      display: flex;
      flex-direction: column;
      gap: 8px;

      div.-button-like {
        display: flex;
        align-items: center;
        padding: 5px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: var(--color-neutral-100);
        }

        .icon-base {
          margin-right: 8px;
        }

        span {
          font-size: var(--paragraph-02);
          color: var(--color-neutral-800);
        }
      }
    }
  }

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
