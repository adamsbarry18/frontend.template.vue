<template>
  <home class="password-forgot">
    <template #title>
      <h1>
        {{
          !isFinished
            ? $t('login.forgot-password.title')
            : $t('login.forgot-password.email')
        }}
      </h1>
    </template>
    <form v-if="!isFinished" @submit.prevent="onSubmit">
      <u-form-input
        v-model:modelValue="email"
        :label="$t('login.email.label')"
        :placeholder="$t('login.email.placeholder')"
        input-name="username"
        autocomplete="email"
        :validator="emailValidator"
      />
      <div class="form-action">
        <u-button type="tertiary" size="small">
          {{ $t('commons.form.back') }}
        </u-button>
        <u-button type="primary" :disabled="!canSubmit">
          {{ $t('commons.form.confirm') }}
        </u-button>
      </div>
    </form>
  </home>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import Home from '@/modules/login/_components/Home.vue';
  import UFormInput from '@/modules/common/forms/UFormInput.vue';
  import UButton from '@/modules/common/basic/UButton.vue';
  import { useUsersStore } from '@/stores/users/user';
  import { useNotification } from '@/composables/notfication';
  import { isValidEmail } from '@/libs/utils/String';
  import i18n from '@/i18n';

  const usersStore = useUsersStore();
  const { $errorMsg } = useNotification();

  const email = ref('');
  const isFinished = ref(false);

  const canSubmit = computed(() => {
    return !emailValidator(email.value);
  });

  function emailValidator(value: string): string | null {
    if (!value || value.trim().length === 0) {
      return i18n.global.t('login.email.required');
    }
    if (!isValidEmail(value)) {
      return i18n.global.t('login.valid.email');
    }
    return null;
  }

  async function onSubmit() {
    try {
      await usersStore.resetPassword({ email: email.value });
      isFinished.value = true;
    } catch (error) {
      $errorMsg(i18n.global.t('login.bad.credentials'));
    }
  }

  onMounted(() => {
    isFinished.value = false;
  });
</script>

<style lang="scss" scoped>
  .password-forgot {
    :deep(.a-form-input) {
      margin-bottom: 24px;
      min-width: 350px;
    }
    .form-action {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      text-align: center;
      gap: 20px;
      a {
        text-decoration: underline;
      }
    }
  }
</style>
