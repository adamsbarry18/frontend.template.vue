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
  <!-- Optionnel: Afficher quelque chose si pas d'utilisateur (ex: bouton login) -->
  <!-- <div v-else>...</div> -->
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { UTooltip, UColorInitials, IconBase } from '@/modules/ui';

  // Accès au store et au router
  const usersStore = useUsersStore();
  const router = useRouter();

  // Obtenir des références réactives depuis le store users
  const { currentUser, getInitial: userInitial, email: userEmail } = storeToRefs(usersStore);

  // Propriétés calculées basées sur currentUser du store
  const userName = computed(() => currentUser.value?.fullName ?? ''); // Utiliser fullName pour nom complet
  const userColor = computed(() => usersStore.userColorFromId(currentUser.value?.id ?? 0)); // Obtenir la couleur

  // Méthodes de navigation
  const goToLogout = async () => {
    await usersStore.logout();
    router.push({ name: 'login' });
  };

  const goToMyAccountScreen = () => {
    // Assurez-vous que la route 'user-settings-edit' existe et prend l'ID en paramètre
    // Ou utilisez une route dédiée comme 'my-account' si elle existe.
    if (currentUser.value?.id) {
      // Redirige vers la page d'édition de l'utilisateur courant
      // Note: 'user-settings-edit' est utilisé dans nav.ts pour 'account'
      router.push({
        name: 'user-settings-edit', // Utiliser le nom de route cohérent
        // Ne pas passer de paramètre 'id', car la route /account/settings n'en a pas.
        // Le composant UserSettings récupère l'ID du currentUser depuis le store en mode 'user-edit'.
      });
    } else {
      console.error('Cannot navigate to account screen: current user ID is missing.');
      // Optionnel: rediriger vers login si l'ID manque pour une raison quelconque
      // goToLogout();
    }
  };
</script>

<style scoped lang="scss">
  // Styles pour user-info et user-info-tooltip (à adapter/créer si nécessaire)
  .user-info {
    margin-left: 15px; // Espacement par rapport à l'élément précédent
    cursor: pointer;
  }

  .user-tooltip-content {
    padding: 10px;
    min-width: 200px; // Donner une largeur minimale au tooltip

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
        overflow: hidden; // Empêcher le texte de déborder

        h3 {
          margin: 0;
          font-size: var(--paragraph-01); // Ajuster la taille
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: var(--paragraph-03); // Ajuster la taille
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
      gap: 8px; // Espace entre les actions

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
          font-size: var(--paragraph-02); // Ajuster la taille
          color: var(--color-neutral-800);
        }
      }
    }
  }

  // Styles pour .main-header__notifications (semble hors contexte ici, peut-être à déplacer)
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
