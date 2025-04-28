<template>
  <div class="dashboard">
    <div class="dashboard-wrapper">
      <div class="welcome" v-if="userName">
        <!-- Afficher seulement si userName est disponible -->
        <i18n-t keypath="dashboard.welcome.title" tag="span" scope="global">
          <template #name>
            <b>{{ userName }}</b>
          </template>
        </i18n-t>
        <b class="space-name">{{ $t('dashboard.welcome.title-2') }}</b>
      </div>
      <!-- Vous pouvez ajouter ici d'autres composants ou informations du dashboard -->
    </div>
    <div class="right-column">
      <div
        v-if="errorNotifications.length > 0"
        class="warning-wrapper"
        @click.stop="onClickWarningWrapper"
        data-cy="dashboard-warnings"
      >
        <icon-base
          icon="icon-error"
          class="error-icon"
          color="var(--color-status-error)"
          :size="24"
        />
        <!-- Utiliser $n pour la pluralisation si configuré dans i18n -->
        <span
          v-html="
            $t('dashboard.error-count', { count: errorNotifications.length })
          "
        />
      </div>
      <div v-else class="no-warnings-placeholder" />
      <!-- Autres éléments de la colonne droite -->
    </div>
  </div>
</template>

<script setup lang="ts">
  // Ajout de lang="ts"
  import { computed } from 'vue';
  // Supprimer les imports inutilisés: onMounted, ref, reactBus, STATE
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';
  import { useUsersStore } from '@/stores/modules/users/user'; // Importer le store utilisateur
  import { IconBase } from '@/modules/common';
  // Importer i18n si $t n'est pas globalement disponible (normalement il l'est via le plugin)
  // import { useI18n } from 'vue-i18n';

  // --- Stores ---
  const notificationStore = useNotificationStore();
  const usersStore = useUsersStore(); // Initialiser le store utilisateur
  // const { t } = useI18n(); // Si nécessaire

  // --- Computed Properties ---
  const userName = computed(() => {
    // Accéder au nom via usersStore.currentUser
    return usersStore.currentUser?.name ?? ''; // Fallback à une chaîne vide
  });

  const errorNotifications = computed(
    // Utiliser directement la propriété du store si elle est un getter/computed
    () => notificationStore.getAllErrorNotifications // Assurez-vous que c'est bien un getter/computed
  );

  // --- Methods ---
  const onClickWarningWrapper = () => {
    notificationStore.setPersistentNotificationsVisible(true);
  };

  // --- Lifecycle Hooks ---
  // onMounted n'est plus nécessaire pour la logique retirée
  // onMounted(() => {
  //   // reactBus.emit(STATE.TEST_NOTIFICATION); // Logique retirée
  // });
</script>

<style lang="scss" scoped>
  .dashboard {
    display: flex;
    overflow: auto; // Permet le scroll si le contenu dépasse
    gap: 20px;
    padding: 32px;
    width: 100%;
    // justify-content: center; // Peut causer des problèmes si le contenu est large

    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      height: max-content; // S'adapte à la hauteur du contenu
      gap: 20px;
      flex-grow: 1; // Prend l'espace disponible
      max-width: 1300px; // Garder une largeur max
      min-width: 500px; // Garder une largeur min
      margin: 0 auto; // Centrer le wrapper principal

      .welcome {
        display: flex;
        align-items: center;
        flex-wrap: wrap; // Permet le retour à la ligne sur petits écrans
        gap: 0.5em; // Espace basé sur la taille de police

        & > span, // Cibler le span généré par i18n-t
        b {
          font-size: var(--heading-03);
          line-height: 1.2; // Améliorer l'espacement vertical
        }

        .space-name {
          color: var(--color-primary-500);
        }
      }
    }
  }

  .right-column {
    display: flex;
    position: sticky; // Garder la colonne visible au scroll
    top: 20px; // Espace par rapport au haut
    align-self: flex-start; // Aligner en haut du conteneur flex
    flex-shrink: 0;
    flex-direction: column;
    width: 300px; // Largeur fixe
    gap: 10px; // Espace entre les éléments de la colonne

    .warning-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // margin: 0 0 13px 0; // Remplacé par gap
      border: 1px solid var(--color-status-error);
      border-radius: 4px;
      background-color: var(--color-background-white);
      cursor: pointer;
      padding: 8px 12px;
      transition: background-color 0.2s ease; // Effet au survol

      &:hover {
        background-color: var(
          --color-neutral-100
        ); // Léger changement au survol
      }

      .error-icon {
        margin-right: 8px; // Augmenter l'espace
        flex-shrink: 0; // Empêcher l'icône de rétrécir
      }

      span {
        font-size: var(--paragraph-03);
        color: var(--color-text-secondary);
      }
    }

    .no-warnings-placeholder {
      // margin: 0 0 7px 0; // Remplacé par gap
      height: 42px; // Hauteur ajustée (hauteur warning-wrapper - padding - bordure)
      flex-shrink: 0;
    }
  }
</style>
