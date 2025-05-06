<template>
  <home class="password-forgot" v-loading="isLoading">
    <h1>
      {{
        !isFinished
          ? $t('login.forgot-password.title')
          : $t('login.forgot-password.email-sent-title')
      }}
    </h1>

    <form
      v-if="!isFinished"
      @submit.prevent="onSubmit"
      data-cy="forgot-password-form"
    >
      <p
        class="instructions"
        v-html="$t('login.forgot-password.instructions', { email: email })"
      />
      <u-form-input
        v-model="email"
        :label="$t('login.email.label')"
        :placeholder="$t('login.email.placeholder')"
        input-name="email"
        autocomplete="email"
        :validator="emailValidator"
        data-cy="forgot-password-email-input"
        :disabled="isLoading"
      />
      <div class="form-action">
        <u-button
          type="primary"
          :disabled="!canSubmit || isLoading"
          data-cy="forgot-password-submit-button"
        >
          {{ $t('login.forgot-password.submit-button') }}
        </u-button>
        <u-button
          type="tertiary"
          size="small"
          @click="goBack"
          :disabled="isLoading"
          data-cy="forgot-password-back-button"
        >
          {{ $t('commons.form.back') }}
        </u-button>
      </div>
    </form>

    <div
      v-else
      class="confirmation-message"
      data-cy="forgot-password-confirmation"
    >
      <p
        v-html="$t('login.forgot-password.confirmation-text', { email: email })"
      ></p>
      <u-button
        type="primary"
        @click="goToLogin"
        data-cy="forgot-password-back-to-login"
      >
        {{ $t('login.forgot-password.back-to-login') }}
      </u-button>
    </div>
  </home>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import Home from '@/modules/login/_components/Home.vue';
  import { UFormInput, UButton } from '@/modules/ui';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotification } from '@/composables/notfication';
  import { isValidEmail } from '@/libs/utils/String';
  import i18n from '@/i18n';

  const router = useRouter();
  const usersStore = useUsersStore();
  const { $errorMsg } = useNotification();

  // --- State ---
  const email = ref('');
  const isFinished = ref(false);
  const isLoading = ref(false);

  // --- Validation ---
  type ValidatorFn = (value: string) => string | null;

  const emailValidator: ValidatorFn = (value) => {
    if (!value || value.trim().length === 0) {
      return i18n.global.t('login.email.required');
    }
    if (!isValidEmail(value)) {
      return i18n.global.t('login.valid.email');
    }
    return null;
  };

  // --- Computed ---
  const canSubmit = computed(() => {
    return !emailValidator(email.value) && !isLoading.value;
  });

  // --- Methods ---
  async function onSubmit() {
    if (!canSubmit.value) return;

    isLoading.value = true;
    isFinished.value = false;
    try {
      console.log(`Requesting password reset for: ${email.value}`);
      await usersStore.resetPassword({ email: email.value });
      console.log('Password reset request successful.');
      isFinished.value = true;
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      const errorCode =
        error?.response?.data?.data?.code || error?.message || 'UNKNOWN_ERROR';
      $errorMsg(
        i18n.global.t(
          `login.error.${errorCode}`,
          i18n.global.t('login.forgot-password.error-generic')
        )
      );
    } finally {
      isLoading.value = false;
    }
  }

  function goBack() {
    router.back();
  }

  function goToLogin() {
    router.push({ name: 'login' });
  }
</script>

<style lang="scss" scoped>
  .password-forgot {
    :deep(.u-form-input) {
      margin-bottom: 24px;
      min-width: 350px;
      width: 100%;
    }
    .instructions {
      margin-bottom: 25px;
      color: var(--color-text-secondary);
      text-align: center;
      font-size: var(--paragraph-02);
    }
    .form-action {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 25px;
      gap: 15px;
    }
    .confirmation-message {
      text-align: center;
      margin-top: 20px;
      p {
        margin-bottom: 30px;
        color: var(--color-text-primary);
        font-size: var(--paragraph-01);
        line-height: 1.5;
      }
    }
  }
</style>
