<template>
  <div class="password-form">
    <div class="header">
      <h4>{{ $t('user.settings.password') }}</h4>
      <span
        v-if="mode !== 'creation'"
        class="edit-btn"
        @click="toggleInputDisplay"
      >
        <p v-if="!showInputs">{{ $t('user.settings.edit-password') }}</p>
        <icon-base
          v-else-if="oldPassword === '' && input === ''"
          icon="icon-cross"
          color="var(--color-neutral-700)"
          size="28"
        />
      </span>
    </div>
    <transition name="slide">
      <div v-if="mode === 'creation' || showInputs">
        <span v-if="mode === 'creation' && user.id === null" class="info">
          {{ $t('user.settings.create-info') }}
        </span>
        <span v-else-if="mode === 'creation' && user.id !== null" class="info">
          {{ $t('user.settings.password-no-action') }}
        </span>
        <span v-else class="info">{{ $t('user.settings.update-info') }}</span>
        <u-password-input
          v-if="mode === 'user-edit'"
          v-model="oldPassword"
          class="old-pwd"
          :error="oldPasswordValidationError"
          :label="$t('user.settings.current-password')"
          autocomplete="current-password"
          @change="onOldPasswordChange"
          @blur="touchField('oldPassword')"
        />
        <u-password-input
          v-if="mode !== 'creation' || user.id === null"
          v-model="input"
          :error="
            fieldsTouched.input && !validation.input.valid
              ? $t('error.required-field')
              : false
          "
          :label="
            mode === 'creation'
              ? $t('user.settings.password')
              : $t('user.settings.new-password')
          "
          :rules="passwordRules"
          autocomplete="new-password"
          progress
          @change="onChange"
          @blur="touchField('input')"
        />
        <password-security-indicators :indicators="passwordIndicators" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, reactive } from 'vue';
  import { UPasswordInput, IconBase } from '@/modules/common';
  import PasswordSecurityIndicators from '../_components/PasswordSecurityIndicators.vue';
  import {
    passwordRules,
    getPasswordIndicators,
    isPasswordSecure,
  } from '@/libs/utils/Security';
  import i18n from '@/i18n';

  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });

  const oldPassword = ref('');
  const input = ref('');
  const showInputs = ref(false);

  // Field touched states
  const fieldsTouched = reactive({
    oldPassword: false,
    input: false,
  });

  function touchField(field) {
    fieldsTouched[field] = true;
  }

  // Custom validation implementation
  const validation = reactive({
    oldPassword: computed(() => ({
      valid: validateOldPassword(),
      required: !!oldPassword.value?.trim(),
      isOldPasswordValid: validateOldPasswordCorrect(),
    })),
    input: computed(() => ({
      valid: validatePassword(),
      required: !!input.value?.trim(),
      diff: input.value !== oldPassword.value,
    })),
  });

  // Password indicators for the PasswordSecurityIndicators component
  const passwordIndicators = computed(() => {
    const indicators = getPasswordIndicators(input.value);
    return {
      $dirty: fieldsTouched.input,
      ...indicators,
    };
  });

  // Validation functions
  function validateOldPassword() {
    return !!oldPassword.value?.trim() && validateOldPasswordCorrect();
  }

  function validateOldPasswordCorrect() {
    if (props.mode !== 'user-edit' || !oldPassword.value) return true;
    try {
      const currentPassword = window.localStorage.keepPassword.replace(
        /"/g,
        ''
      );
      return oldPassword.value === currentPassword;
    } catch (error) {
      return false;
    }
  }

  function validatePassword() {
    if (
      (props.mode === 'user-edit' && !validateOldPassword()) ||
      !input.value?.trim()
    ) {
      return false;
    }

    // Check if input is different from oldPassword when in user-edit mode
    if (props.mode === 'user-edit' && input.value === oldPassword.value) {
      return false;
    }

    // Use the provided isPasswordSecure function to validate the password
    return isPasswordSecure(input.value);
  }

  const isFormValid = computed(() => {
    if (props.mode === 'user-edit' && showInputs.value) {
      return validation.oldPassword.valid && validation.input.valid;
    }

    if (
      (props.mode === 'creation' && props.user.id === null) ||
      (props.mode === 'admin-edit' && showInputs.value)
    ) {
      return validation.input.valid;
    }

    return true;
  });

  // Propriétés calculées
  const oldPasswordValidationError = computed(() => {
    if (!fieldsTouched.oldPassword) return false;
    if (!validation.oldPassword.required)
      return i18n.global.t('error.required-field');
    if (!validation.oldPassword.isOldPasswordValid)
      return i18n.global.t('error.wrong-password');
    return false;
  });

  const canSave = computed(() => isFormValid.value);

  // Watchers
  watch(
    () => props.password,
    (val) => {
      input.value = val;
    }
  );

  // Méthodes
  const emit = defineEmits(['change']);

  function onChange() {
    if (props.mode === 'user-edit' && !validation.oldPassword.valid) {
      emit('change', '');
    } else {
      emit('change', input.value);
    }
  }

  function onOldPasswordChange() {
    if (!validation.oldPassword.valid) {
      emit('change', '');
    } else {
      emit('change', input.value);
    }
  }

  function toggleInputDisplay() {
    showInputs.value = !showInputs.value;
  }

  // Initialisation au montage
  onMounted(() => {
    input.value = props.password ? props.password : '';
  });

  defineExpose({ canSave });
</script>

<style lang="scss">
  .password-form {
    .header {
      display: flex;
      justify-content: space-between;
      h3 {
        padding-bottom: 4px;
      }
      .edit-btn {
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .info {
      display: block;
      padding-bottom: 20px;
    }
    .old-pwd {
      margin-bottom: 20px;
    }
  }

  .slide-enter-active {
    animation: slide-in 0.2s;
  }
  .slide-leave-active {
    animation: slide-in 0.2s reverse;
  }
  @keyframes slide-in {
    0% {
      transform: translateY(-40px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>
