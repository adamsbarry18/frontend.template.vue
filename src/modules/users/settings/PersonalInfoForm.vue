<template>
  <div class="personal-info-form">
    <div class="global-card-title">
      <icon-base
        class="icon"
        icon="icon-users"
        :color="'var(--color-neutral-800)'"
        size="24"
      />
      <h3>
        {{ $t('globals.account.title') }}
      </h3>
    </div>
    <div class="user-infos">
      <div class="header">
        <h4>{{ $t('user.settings.personal-information') }}</h4>
        <transition name="fade">
          <div>
            <span class="internal">{{ $t('users.list.header.internal') }}</span>
          </div>
        </transition>
      </div>
      <div class="user-infos-layout">
        <div v-if="user.color" class="wrapper-color">
          <u-color-initials
            :color="user.color"
            :initial="userInitial"
            class="-button-like"
            size="80"
            font-size="35"
          />
          <u-color-picker
            v-model="user.color"
            :disabled="mode === 'admin-edit' || isAddingUser"
          />
        </div>
        <div class="form">
          <u-form-input
            v-model="user.email"
            :loading="loading"
            :error="emailValidationError"
            :disabled="mode !== 'creation'"
            :label="$t('commons.form.email')"
            placeholder="example@domain"
            @change="onEmailChange"
            @blur="touchField('email')"
          />
          <template v-if="mode === 'creation'">
            <transition name="fade" mode="out-in">
              <u-alert-card v-if="isUserInternal" key="3" type="info">
                <p>
                  <span v-html="$t('user.settings.info.user-internal')" />
                </p>
              </u-alert-card>
            </transition>
          </template>
          <u-form-input
            v-model="user.name"
            :error="
              fieldsTouched.name && !validation.name.valid
                ? $t('error.required-field')
                : false
            "
            :disabled="mode === 'admin-edit' || isAddingUser"
            :label="$t('commons.form.first-name')"
            placeholder="John"
            @change="onChange"
            @blur="touchField('name')"
          />
          <u-form-input
            v-model="user.surname"
            :error="
              fieldsTouched.surname && !validation.surname.valid
                ? $t('error.required-field')
                : false
            "
            :disabled="mode === 'admin-edit' || isAddingUser"
            :label="$t('commons.form.name')"
            placeholder="Doe"
            @change="onChange"
            @blur="touchField('surname')"
          />
          <u-radio
            v-model="user.language"
            button
            :options="languageOptions"
            :disabled="mode === 'admin-edit' || isAddingUser"
            datu-nav="user-settings-language-radio"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, reactive } from 'vue';
  import {
    IconBase,
    UColorInitials,
    UFormInput,
    UColorPicker,
    URadio,
    UAlertCard,
  } from '@/modules/common';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { debounce } from '@/libs/utils/Debounce';
  import { isValidEmail } from '@/libs/utils/String';
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
  });

  const loading = ref(false);
  const emailChangeDebouncer = ref(null);
  const errorType = ref(null);
  const emit = defineEmits(['change']);

  // Field touched states
  const fieldsTouched = reactive({
    email: false,
    name: false,
    surname: false,
  });

  // Touch field function
  function touchField(fieldName) {
    fieldsTouched[fieldName] = true;
  }

  // Custom validation implementation
  const validation = reactive({
    email: computed(() => ({
      valid: validateEmail(props.user.email),
      required: !!props.user.email?.trim(),
    })),
    name: computed(() => ({
      valid: !!props.user.name?.trim(),
    })),
    surname: computed(() => ({
      valid: !!props.user.surname?.trim(),
    })),
  });

  // Validation functions
  function validateEmail(email) {
    return !!email?.trim() && isValidEmail(email);
  }

  const isFormValid = computed(() => {
    return (
      validation.email.valid &&
      validation.name.valid &&
      validation.surname.valid
    );
  });

  // Accès au store Pinia
  const usersStore = useUsersStore();

  // Propriétés calculées
  const userInitial = computed(() => {
    return props.user?.name
      ? props.user.name.substring(0, 1).toUpperCase()
      : '-';
  });

  const languageOptions = computed(() => [
    { value: 'fr', label: i18n.global.t('commons.lang.fr') },
    { value: 'en', label: i18n.global.t('commons.lang.en') },
  ]);

  const doesUserExist = computed(() => props.user.id !== null);

  const isUserInternal = computed(() => {
    // UserModel.isEmailInternal(props.user.email) && $isInternal
    return props.user.email;
  });

  const isAddingUser = computed(
    () => props.mode === 'creation' && props.user.id !== null
  );

  const canSave = computed(() => isFormValid.value && errorType.value === null);

  const emailValidationError = computed(() => {
    if (!fieldsTouched.email) return false;
    if (!validation.email.required)
      return i18n.global.t('error.required-field');
    if (!validation.email.valid) return i18n.global.t('login.valid.email');
    return false;
  });

  // Méthodes
  const onChange = () => {
    emit('change', props.user);
  };

  const autoCompleteUser = async (email) => {
    const userData = await usersStore.searchUserFromEmail({ email });
    if (userData !== null) {
      const newUser: any = userData;
      if (newUser.color === null) {
        newUser.color = usersStore.userColorFromId(
          newUser.id ? newUser.id : Date.now()
        );
      }
      emit('change', newUser);
    } else {
      if (props.user.id !== null) {
        props.user.reset();
      }
      onChange();
    }
  };

  const onEmailChange = (email) => {
    if (props.mode === 'creation' && validation.email.valid) {
      if (!emailChangeDebouncer.value) {
        emailChangeDebouncer.value = debounce(async (email) => {
          loading.value = true;
          await autoCompleteUser(email);
          loading.value = false;
        }, 350);
      }
      if (validation.email.required) {
        emailChangeDebouncer.value(email);
      } else {
        errorType.value = null;
      }
    }
  };

  watch(
    () => props.user.email,
    (newEmail) => {
      onEmailChange(newEmail);
    }
  );
  defineExpose({ canSave });
</script>

<style lang="scss">
  .personal-info-form {
    .global-card-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--color-input-border);
      padding-bottom: 12px;

      .icon {
        margin-right: 8px;
      }
    }

    .user-infos {
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 30px;
        height: 62px;

        .internal {
          padding-left: 5px;
          font-size: var(--paragraph-03);
          font-weight: 500;
        }
      }

      .user-infos-layout {
        display: flex;
        flex-direction: row;

        .wrapper-color {
          display: inline-block;
          position: relative;
          padding-right: 40px;

          .u-color-picker {
            position: absolute;
            top: 55px;
            left: 50px;
          }
        }

        .form {
          width: 80%;

          .u-radio {
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .u-form-input {
            margin-bottom: 15px;
          }
        }
      }
    }
  }
</style>
