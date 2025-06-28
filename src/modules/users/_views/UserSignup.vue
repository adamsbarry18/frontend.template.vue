<template>
  <div class="user-signup-page-wrapper">
    <div class="signup-hero-banner">
      <img src="@/assets/images/stock_app_hero.jpg" alt="StockMaster Signup" class="hero-image" />
    </div>
    <div class="signup-content-wrapper">
      <u-card class="signup-form-card">
        <template #title>
          <div class="card-header-logo-centered">
            <img src="@/assets/images/logo_stock_app.png" alt="Logo" class="company-logo-signup-centered" />
            <h1 class="signup-main-title">{{ $t('user.signup.title') }}</h1>
          </div>
        </template>
        <personal-info-form v-if="user" :user="user" mode="signup" @update:user="onUserUpdate" />
        <password-form
          v-if="user"
          :user="user"
          mode="signup"
          @update:password="onPasswordUpdate"
          @validity-change="onPasswordValidityChange"
        />
        <div class="signup-buttons">
          <u-button
            type="primary"
            icon="icon-validate"
            :icon-size="24"
            :disabled="!canSignup"
            :loading="isSigningUp"
            class="button signup-button"
            :title="$t('user.signup.button')"
            :label="$t('user.signup.button')"
            @click="signup"
            >{{ $t('user.signup.button') }}</u-button
          >
          <div class="or-divider-signup">
            <span>{{ $t('login.or') }}</span>
          </div>
          <u-button
            class="google-signup-button signup-button"
            type="secondary"
            data-cy="google-signup-button"
            @click="handleGoogleSignup"
          >
            <img
              src="@/assets/images/svg/google-color-icon.svg"
              alt="Google logo"
              class="google-logo-signup"
            />
            {{ $t('user.signup.google-signup') }}
          </u-button>
        </div>
        <div class="existing-account-link">
          <router-link :to="{ name: 'login' }">{{ $t('user.signup.already-have-account') }}</router-link>
        </div>
      </u-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { UButton, UCard } from '@/modules/ui';
  import PersonalInfoForm from '../settings/PersonalInfoForm.vue';
  import PasswordForm from '../settings/PasswordForm.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotification } from '@/composables/notfication';
  import i18n from '@/i18n';
  import UserModel from '@/stores/modules/users/models/UserModel';
  import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
  import { useBreadcrumbStore } from '@/stores/modules/breadcrumb';

  const router = useRouter();
  const { $successMsg, $errorMsg } = useNotification();
  const usersStore = useUsersStore();
  const breadcrumbStore = useBreadcrumbStore();

  const user = ref<UserModel>(
    new UserModel({
      level: SecurityLevel.USER,
      internal: false,
      permissions: null,
      isActive: true,
      preferences: { language: i18n.global.locale.value || 'fr' },
    })
  );
  const password = ref('');
  const isPersonalInfoValid = ref(false);
  const isPasswordFormValid = ref(false);
  const isSigningUp = ref(false);

  onMounted(() => {
    breadcrumbStore.setBreadcrumb(
      [{ label: i18n.global.t('user.signup.title'), path: '' }],
      i18n.global.t('user.signup.title')
    );
  });

  const checkPersonalInfoValidity = (userToCheck: UserModel): boolean => {
    return (
      !!userToCheck.email?.trim() &&
      !!userToCheck.firstName?.trim() &&
      !!userToCheck.lastName?.trim() &&
      UserModel.prototype.isValid.call(userToCheck)
    );
  };

  const onUserUpdate = (updatedUser: UserModel) => {
    user.value = updatedUser;
    isPersonalInfoValid.value = checkPersonalInfoValidity(user.value);
  };

  const onPasswordUpdate = (newPassword: string) => {
    password.value = newPassword;
  };

  const onPasswordValidityChange = (isValid: boolean) => {
    isPasswordFormValid.value = isValid;
  };

  const canSignup = computed(() => {
    return isPersonalInfoValid.value && isPasswordFormValid.value && !!password.value && !isSigningUp.value;
  });

  async function signup() {
    if (!canSignup.value) return;

    isSigningUp.value = true;

    const userDataToSend: Partial<UserModel> = {
      email: user.value.email,
      password: password.value,
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      level: SecurityLevel.USER,
      internal: UserModel.isEmailInternal(user.value.email || ''),
      color: user.value.color,
      preferences: user.value.preferences || { language: 'fr' },
      permissions: null,
      permissionsExpireAt: null,
      isActive: true,
    };

    try {
      await usersStore.addUser(userDataToSend);
      $successMsg(i18n.global.t('user.signup.success'));
      if (userDataToSend.email) {
        await usersStore.login({ email: userDataToSend.email, password: password.value });
      }
      router.push({ name: 'dashboard' });
    } catch (err: any) {
      console.error('Error during signup:', err);
      const apiErrorMessage = err.message || i18n.global.t('user.signup.error');
      $errorMsg(apiErrorMessage);
    } finally {
      isSigningUp.value = false;
    }
  }

  function handleGoogleSignup() {
    usersStore.initiateGoogleLogin();
  }
</script>

<style lang="scss" scoped>
  .user-signup-page-wrapper {
    min-height: 100vh;
    background-color: var(--color-background-page);
    padding: 0;
  }

  .signup-hero-banner {
    width: 100%;
    height: 200px;
    overflow: hidden;
    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .signup-content-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .signup-form-card {
    width: 100%;
    max-width: 800px;
    border: none;
    box-shadow: var(--shadow-3);
    background-color: var(--color-background-white);
    border-radius: var(--radius-04);
    margin-top: 20px;

    .card-header-logo-centered {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 0;
      margin-bottom: 20px;
      gap: 20px;

      .company-logo-signup-centered {
        max-height: 80px;
        max-width: auto;
        width: auto;
      }

      .signup-main-title {
        margin: 0;
      }
    }

    :deep(.card-title-wrapper) {
      background-color: transparent;
      border-bottom: none;
      padding: 0;
    }

    :deep(.personal-info-form .global-card-title),
    :deep(.personal-info-form .header),
    :deep(.password-form .header) {
      display: none;
    }
    :deep(.password-form .info) {
      display: none;
    }

    .signup-buttons {
      display: flex;
      margin-top: 25px;
      .signup-button {
        flex: 1;
        padding: 8px 16px;
        font-size: var(--paragraph-01);
        justify-content: center;
      }
      .google-signup-button {
        margin-bottom: 0;
      }
    }

    .or-divider-signup {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--color-text-secondary);
      font-size: var(--paragraph-02);
      margin: 10px 0;
      span {
        padding: 0 10px;
      }
      &::before,
      &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--color-border-neutral);
      }
    }

    .google-signup-button {
      .google-logo-signup {
        height: 20px;
        width: auto;
      }
    }

    .existing-account-link {
      text-align: center;
      margin-top: 20px;
      font-size: var(--paragraph-02);
      a {
        color: var(--color-primary-500);
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  @media screen and (max-width: 900px) {
    .signup-content-wrapper {
      padding: 10px;
    }
    .signup-form-card {
      max-width: none;
    }
  }

  @media screen and (max-width: 480px) {
    .signup-form-card {
      .signup-main-title {
        font-size: var(--heading-03);
      }
      .signup-buttons {
        flex-direction: column;
        gap: 15px;
      }
    }
  }
</style>
