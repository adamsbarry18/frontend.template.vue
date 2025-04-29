<template>
  <div id="app" :data-lang="$i18n.locale">
    <!-- Indicateur de chargement initial -->
    <div v-if="!authCheckCompleted" class="initial-loading">
      <!-- Vous pouvez mettre ici un spinner ou un message de chargement -->
      Chargement de l'application...
    </div>

    <!-- Contenu de l'application une fois l'authentification vérifiée -->
    <template v-else>
      <main-header v-if="isAuthenticated" />
      <div class="app-wrapper" :class="{ login: !isAuthenticated }">
        <main-nav v-if="isAuthenticated" />
        <div class="main-content" :class="{ login: !isAuthenticated }">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <transition name="notification">
            <notification-panel v-show="notificationVisible" />
          </transition>
          <global-help-button v-if="isAuthenticated" />
          <!-- AdBlocker check div (gardé de l'original) -->
          <div
            ref="adBlockerDiv"
            class="ad-banner ad-button"
            style="
              display: block;
              padding: 0 !important;
              height: 1px;
              width: 1px;
              opacity: 0;n 
            "
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watchEffect } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import i18n from '@/i18n';
  import { initializeDateLocale } from '@/libs/utils/Date';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';
  import { useNotification } from './composables/notfication';
  import { storageService } from '@/libs/utils/StorageService'; // Importer le service

  // Import des composants UI (gardés de l'original, ajustez si nécessaire)
  import MainHeader from '@/modules/shared/menu/main-header/MainHeader.vue';
  import MainNav from '@/modules/shared/menu/main-menu/MainNav.vue';
  import NotificationPanel from '@/modules/shared/notification/NotificationPanel.vue';
  import GlobalHelpButton from '@/modules/app/_components/GlobalHelpButton.vue';

  const { $message } = useNotification();
  const usersStore = useUsersStore();
  const notificationStore = useNotificationStore();
  const router = useRouter();
  const route = useRoute();

  // --- State ---
  const adBlockerDiv = ref<HTMLDivElement | null>(null);
  // Remplacer isAppReady par l'état de vérification de l'auth du store
  const authCheckCompleted = computed(() => usersStore.authStatusChecked);
  const isAuthenticated = computed(() => usersStore.isAuthenticated); // Utiliser le getter du store

  // --- Computed ---
  const notificationVisible = computed(
    () => notificationStore.persistentNotificationsVisible
  );

  // Routes publiques qui ne nécessitent pas d'authentification
  const PUBLIC_ROUTES = [
    'login',
    'password-forgot',
    'password-reset',
    'send-email',
  ]; // Ajoutez d'autres routes publiques si nécessaire

  // --- Watchers ---
  watchEffect(() => {
    // Ne rien faire tant que la vérification initiale n'est pas terminée
    if (!authCheckCompleted.value) {
      return;
    }

    const currentRouteName = typeof route.name === 'string' ? route.name : '';
    const isPublicRoute = PUBLIC_ROUTES.includes(currentRouteName);

    console.log(
      `Auth Check Completed: ${authCheckCompleted.value}, Is Authenticated: ${isAuthenticated.value}, Current Route: ${route.path}, Is Public: ${isPublicRoute}`
    );

    if (!isAuthenticated.value && !isPublicRoute) {
      // Si non authentifié et pas sur une route publique, rediriger vers login
      console.log('Redirecting to login...');
      router.push({ name: 'login', query: { redirect: route.fullPath } }); // Garde la redirection en query
    } else if (isAuthenticated.value && currentRouteName === 'login') {
      // Si authentifié et sur la page de login, rediriger vers le dashboard
      console.log('Redirecting to dashboard...');
      router.push({ name: 'dashboard' }); // Ou la route par défaut après login
    }
  });

  // --- Methods ---
  const checkAdBlocker = () => {
    // Utilise un délai plus court pour la détection initiale
    setTimeout(() => {
      if (
        adBlockerDiv.value?.offsetParent === null ||
        adBlockerDiv.value?.offsetHeight === 0 ||
        getComputedStyle(adBlockerDiv.value).display === 'none'
      ) {
        console.warn('AdBlocker detected!');
        $message({
          customClass: 'orange-warning',
          type: 'warning',
          duration: 0, // Rendre persistant jusqu'à fermeture manuelle
          showClose: true,
          message: i18n.global.t('adblocker.detected'),
        });
      } else {
        console.log('No AdBlocker detected.');
      }
      // Cache le div après vérification pour ne pas interférer avec le layout
      if (adBlockerDiv.value) {
        adBlockerDiv.value.style.display = 'none';
      }
    }, 2000); // Délai réduit pour une détection plus rapide
  };

  // --- Lifecycle Hooks ---
  onMounted(async () => {
    console.log('App.vue onMounted: Initializing...');

    // 1. Initialiser la locale (langue et date)
    // 1. Initialiser la locale (langue et date) en utilisant storageService
    const storedLang = storageService.getLanguage(); // Utiliser le service
    const defaultLang = 'fr';
    const langToUse: 'en' | 'fr' =
      storedLang === 'en' || storedLang === 'fr' ? storedLang : defaultLang;

    initializeDateLocale(langToUse);
    i18n.global.locale.value = langToUse; // Plus besoin de cast
    console.log(`Language set to: ${langToUse}`);

    // 2. Vérifier AdBlocker (après un délai)
    // L'initialisation de l'authentification est maintenant gérée dans router.beforeEach
    checkAdBlocker();

    console.log(
      'App.vue onMounted: Initialization complete (Auth check deferred to router).'
    );
  });
</script>

<style lang="scss">
  /* Styles existants */
  .notification-enter-active,
  .notification-leave-active {
    transition: transform 0.5s ease; /* Utiliser ease pour une transition plus douce */
  }

  .notification-enter-from, /* Remplacer .notification-enter par enter-from */
.notification-leave-to {
    transform: translateX(100%); /* Assurer que ça sort complètement */
  }

  /* Style pour le chargement initial */
  .initial-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: var(
      --color-neutral-100
    ); /* Ou une autre couleur de fond */
    font-size: var(--paragraph-01);
    color: var(--color-text-primary);
  }

  /* Transition pour le contenu principal */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: var(
      --color-neutral-100
    ); /* Appliquer la couleur de fond au body */
    min-height: 100vh; /* Assurer que le body prend toute la hauteur */

    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }

    & .el-loading-mask {
      z-index: 900;
      background-color: rgba(
        255,
        255,
        255,
        0.8
      ); /* Fond légèrement transparent */
    }

    .el-loading-spinner .path {
      stroke: var(--color-primary-500);
    }

    /* Necessary for angular */
    .angular * {
      font-family: 'Roboto', sans-serif;
      font-size: var(--paragraph-03);
      line-height: inherit;
    }

    hr {
      border: none; /* Reset border */
      border-top: 1px solid var(--color-neutral-300);
      margin: 1rem 0; /* Ajouter un peu d'espace */
    }

    &.konami-code {
      background-color: black;

      @keyframes konami {
        0% {
          transform: scale(1) rotate(0deg);
        }
        100% {
          transform: scale(0) rotate(720deg);
        }
      }

      #app {
        transform-origin: center center;
        animation: konami 3s ease-in-out;
        animation-fill-mode: forwards;
      }
    }

    #app {
      --header-height: 60px;
      // Both top and bottom stonly banners can be displayed simultaneously
      --stonly-banner-height: calc(
        var(
            --stonly-banner-top-sticky-margin,
            var(--stonly-banner-top-margin, 0px)
          ) +
          var(--stonly-banner-bottom-margin, 0px)
      );
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 100vh; /* Assurer que #app prend toute la hauteur */

      // AngularJs: bootstrap override el-theme
      .collapse {
        display: inherit;
      }

      .app-wrapper {
        display: flex;
        flex-direction: row;
        flex-grow: 1; /* Permet au wrapper de prendre l'espace restant */
        width: 100%;
        /* Calcul de hauteur retiré, géré par flex-grow */

        &.login {
          /* Pas de hauteur spécifique nécessaire si le body a min-height: 100vh */
        }

        .main-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1; /* Prend l'espace restant */
          background-color: var(
            --color-neutral-100
          ); /* Fond du contenu principal */
          /* max-height retiré, overflow gère le défilement */
          overflow-y: auto; /* Activer le défilement si nécessaire */
          position: relative; /* Pour positionner les éléments flottants comme le bouton d'aide */

          &.login {
            /* Pas de hauteur spécifique nécessaire */
          }
        }
      }
    }

    .orange-warning {
      background-color: var(--color-status-warning);
      color: var(--color-white); /* Couleur de texte par défaut */
      z-index: 1000; /* Assurer qu'il est au-dessus */

      .el-message__content {
        color: var(--color-white); /* Spécifier la couleur ici aussi */
        font-weight: 500;
      }

      .el-message__closeBtn {
        color: var(--color-white);
        &:hover {
          background-color: rgba(0, 0, 0, 0.1); /* Léger fond au survol */
        }
      }

      .el-icon-warning {
        color: var(--color-white);
      }
    }
  }
</style>
