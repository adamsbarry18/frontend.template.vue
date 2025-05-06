<template>
  <div class="password-form">
    <div class="header">
      <h4>{{ $t('user.settings.password') }}</h4>
      <span v-if="mode !== 'creation'" class="edit-btn" @click="toggleInputDisplay">
        <p v-if="!showInputs">{{ $t('user.settings.edit-password') }}</p>
        <icon-base
          v-else-if="showInputs && !localOldPassword && !localNewPassword"
          icon="icon-cross"
          color="var(--color-neutral-700)"
          size="28"
          :title="$t('commons.form.cancel')"
        />
      </span>
    </div>
    <transition name="slide">
      <div v-if="mode === 'creation' || showInputs">
        <span v-if="mode === 'creation' && !user?.id" class="info">
          {{ $t('user.settings.create-info') }}
        </span>
        <span v-else-if="mode === 'creation' && user?.id" class="info">
          {{ $t('user.settings.password-no-action') }}
        </span>
        <span v-else-if="mode !== 'creation'" class="info">{{ $t('user.settings.update-info') }}</span>

        <u-password-input
          v-if="mode === 'user-edit'"
          v-model="localOldPassword"
          class="old-pwd"
          :error="oldPasswordValidationError"
          :label="$t('user.settings.current-password')"
          autocomplete="current-password"
          @blur="touchField('oldPassword')"
          @update:model-value="handlePasswordChange"
        />

        <u-password-input
          v-if="!(mode === 'creation' && user?.id)"
          v-model="localNewPassword"
          :error="newPasswordValidationError"
          :label="mode === 'creation' ? $t('user.settings.password') : $t('user.settings.new-password')"
          :rules="passwordRules"
          autocomplete="new-password"
          progress
          @blur="touchField('newPassword')"
          @update:model-value="handlePasswordChange"
        />
        <password-security-indicators
          v-if="!(mode === 'creation' && user?.id)"
          :indicators="passwordIndicators"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, reactive } from 'vue';
  import { UPasswordInput, IconBase } from '@/modules/ui';
  import PasswordSecurityIndicators from '../_components/PasswordSecurityIndicators.vue';
  import { passwordRules, getPasswordIndicators, isPasswordSecure } from '@/libs/utils/Security';
  import i18n from '@/i18n';
  import UserModel from '@/stores/modules/users/models/UserModel';

  const props = defineProps({
    user: {
      type: Object as () => UserModel | null,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      validator: (value: string) => ['creation', 'admin-edit', 'user-edit'].includes(value),
    },
  });

  const emit = defineEmits(['update:password', 'validity-change']);

  // --- State ---
  const localOldPassword = ref('');
  const localNewPassword = ref('');
  const showInputs = ref(props.mode === 'creation');

  const fieldsTouched = reactive({
    oldPassword: false,
    newPassword: false,
  });

  // --- Computed Properties ---

  const passwordIndicators = computed(() => {
    const indicators = getPasswordIndicators(localNewPassword.value);
    return {
      $dirty: fieldsTouched.newPassword,
      ...indicators,
    };
  });

  // --- Validation ---

  function touchField(fieldName: keyof typeof fieldsTouched) {
    fieldsTouched[fieldName] = true;
    emit('validity-change', isFormSectionValid.value);
  }

  const isOldPasswordRequired = computed(() => props.mode === 'user-edit' && showInputs.value);

  const oldPasswordValidationError = computed(() => {
    if (!isOldPasswordRequired.value || !fieldsTouched.oldPassword) return false;
    if (!localOldPassword.value.trim()) return i18n.global.t('error.required-field');
    return false;
  });

  const isNewPasswordRequired = computed(() => {
    if (props.mode === 'creation' && !props.user?.id) return true;
    if (['admin-edit', 'user-edit'].includes(props.mode) && showInputs.value && localNewPassword.value)
      return true;
    if (props.mode === 'user-edit' && showInputs.value && localOldPassword.value) return true;

    return false;
  });

  const newPasswordValidationError = computed(() => {
    if (!isNewPasswordRequired.value || !fieldsTouched.newPassword) return false;

    const newPass = localNewPassword.value;

    if (!newPass.trim()) return i18n.global.t('error.required-field');

    if (!isPasswordSecure(newPass)) {
      return i18n.global.t('error.password-complexity');
    }

    if (props.mode === 'user-edit' && localOldPassword.value && newPass === localOldPassword.value) {
      return i18n.global.t('error.password-must-differ');
    }

    return false;
  });

  const isFormSectionValid = computed(() => {
    if (props.mode !== 'creation' && !showInputs.value) {
      return true;
    }

    if (props.mode === 'creation' && props.user?.id) {
      return true;
    }

    const hasOldPasswordError = isOldPasswordRequired.value && !!oldPasswordValidationError.value;
    const hasNewPasswordError = isNewPasswordRequired.value && !!newPasswordValidationError.value;

    return !hasOldPasswordError && !hasNewPasswordError;
  });

  // --- Methods ---

  function toggleInputDisplay() {
    showInputs.value = !showInputs.value;
    if (!showInputs.value) {
      localOldPassword.value = '';
      localNewPassword.value = '';
      fieldsTouched.oldPassword = false;
      fieldsTouched.newPassword = false;
      emit('update:password', '');
    }
    emit('validity-change', isFormSectionValid.value);
  }

  function handlePasswordChange() {
    if (isFormSectionValid.value && localNewPassword.value) {
      emit('update:password', localNewPassword.value);
    } else if (!localNewPassword.value && !localOldPassword.value && props.mode !== 'creation') {
      emit('update:password', '');
    }
    emit('validity-change', isFormSectionValid.value);
  }

  // --- Watchers ---

  watch(
    () => props.mode,
    (newMode) => {
      showInputs.value = newMode === 'creation' && !props.user?.id;
      localOldPassword.value = '';
      localNewPassword.value = '';
      fieldsTouched.oldPassword = false;
      fieldsTouched.newPassword = false;
      emit('update:password', '');
      emit('validity-change', isFormSectionValid.value);
    }
  );

  watch(
    () => props.user?.id,
    (newId, oldId) => {
      if (props.mode === 'creation') {
        showInputs.value = !newId;
        if (!oldId && newId) {
          localNewPassword.value = '';
          fieldsTouched.newPassword = false;
          emit('update:password', '');
          emit('validity-change', isFormSectionValid.value);
        }
      }
    }
  );

  emit('validity-change', isFormSectionValid.value);
</script>

<style lang="scss">
  .password-form {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h4 {
        margin: 0;
      }
      .edit-btn {
        cursor: pointer;
        text-decoration: underline;
        color: var(--color-primary-base);
        display: flex;
        align-items: center;
        gap: 4px;
        p {
          margin: 0;
        }
      }
    }
    .info {
      display: block;
      padding-bottom: 20px;
      font-size: var(--paragraph-03);
      color: var(--color-neutral-700);
    }
    .old-pwd {
      margin-bottom: 20px;
    }
    .u-password-input {
      margin-bottom: 5px;
    }
    .password-security-indicators {
      margin-bottom: 15px;
    }
  }

  .slide-enter-active {
    transition: all 0.3s ease-out;
    max-height: 200px;
    overflow: hidden;
  }
  .slide-leave-active {
    transition: all 0.3s ease-in;
    max-height: 200px;
    overflow: hidden;
  }
  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
</style>
