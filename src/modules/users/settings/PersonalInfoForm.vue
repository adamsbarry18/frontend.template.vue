<template>
  <div class="personal-info-form">
    <div class="global-card-title">
      <icon-base class="icon" icon="icon-users" :color="'var(--color-neutral-800)'" size="24" />
      <h3>
        {{ mode === 'creation' ? $t('breadcrumb.admin.new-user') : $t('globals.account.title') }}
      </h3>
    </div>
    <div class="user-infos">
      <div class="header">
        <h4>{{ $t('user.settings.personal-information') }}</h4>
        <transition name="fade">
          <div v-if="localUser?.internal">
            <span class="internal">{{ $t('users.list.header.internal') }}</span>
          </div>
        </transition>
      </div>
      <div class="user-infos-layout">
        <div v-if="localUser?.color" class="wrapper-color">
          <u-color-initials
            :color="localUser.color"
            :initial="userInitial"
            class="-button-like"
            size="80"
            font-size="35"
          />
          <u-color-picker
            :model-value="localUser.color"
            :disabled="isFieldDisabled"
            @update:model-value="updateField('color', $event)"
          />
        </div>
        <div class="form">
          <u-form-input
            :model-value="localUser?.email"
            :loading="isSearchingUser"
            :error="emailValidationError"
            :disabled="mode !== 'creation'"
            :label="$t('commons.form.email')"
            placeholder="example@domain"
            @update:model-value="handleEmailInput"
            @blur="touchField('email')"
          />
          <template v-if="mode === 'creation'">
            <transition name="fade" mode="out-in">
              <u-alert-card v-if="doesUserExist" key="user-exists" type="info">
                <p>
                  {{ $t('user.settings.info.user-exists') }}
                </p>
              </u-alert-card>
              <u-alert-card v-else-if="isUserInternal" key="user-internal" type="info">
                <p>
                  <span v-html="$t('user.settings.info.user-internal')" />
                </p>
              </u-alert-card>
            </transition>
          </template>
          <u-form-input
            :model-value="localUser?.surname"
            :error="surnameValidationError"
            :disabled="isFieldDisabled"
            :label="$t('commons.form.name')"
            placeholder="Doe"
            @update:model-value="updateField('surname', $event)"
            @blur="touchField('surname')"
          />
          <u-form-input
            :model-value="localUser?.name"
            :error="nameValidationError"
            :disabled="isFieldDisabled"
            :label="$t('commons.form.first-name')"
            placeholder="John"
            @update:model-value="updateField('name', $event)"
            @blur="touchField('name')"
          />
        </div>
      </div>
    </div>
    <div class="preferences-section">
      <h4>{{ $t('user.settings.preferences.title') }}</h4>
      <div class="preferences-layout">
        <div class="form">
          <div class="preference-item">
            <label class="el-form-item__label">{{ $t('user.settings.preferences.language') }}</label>
            <u-radio
              :model-value="localUser?.preferences?.language"
              :options="languageOptions"
              :disabled="isFieldDisabled"
              @update:model-value="updatePreference('language', $event)"
            />
          </div>
          <theme-selector
            :model-value="localUser?.preferences?.theme"
            :disabled="isFieldDisabled"
            @update:model-value="updatePreference('theme', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, reactive } from 'vue';
  import { IconBase, UColorInitials, UFormInput, UColorPicker, URadio, UAlertCard } from '@/modules/ui';
  import ThemeSelector from './ThemeSelector.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { debounce } from '@/libs/utils/Debounce';
  import { isValidEmail } from '@/libs/utils/String';
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

  const emit = defineEmits(['update:user', 'user-found']);

  const usersStore = useUsersStore();

  const localUser = ref<UserModel | null>(null);
  const isSearchingUser = ref(false);
  const searchDebounce = ref<ReturnType<typeof debounce> | null>(null);

  const fieldsTouched = reactive({
    email: false,
    name: false,
    surname: false,
  });

  // --- Computed Properties ---

  const userInitial = computed(() => {
    return localUser.value?.name ? localUser.value.name.substring(0, 1).toUpperCase() : '-';
  });

  const languageOptions = computed(() => [
    { value: 'fr', label: i18n.global.t('commons.lang.fr') },
    { value: 'en', label: i18n.global.t('commons.lang.en') },
  ]);

  const doesUserExist = computed(() => {
    if (props.mode !== 'creation' || !localUser.value?.id) return false;
    return !!usersStore.getUserById(localUser.value.id);
  });

  const isUserInternal = computed(() => {
    return localUser.value?.email ? UserModel.isEmailInternal(localUser.value.email) : false;
  });

  const isFieldDisabled = computed(() => {
    if (props.mode === 'creation' && doesUserExist.value) {
      return true;
    }
    return false;
  });

  // --- Validation ---

  function validateEmail(email: string | undefined | null): boolean {
    return !!email?.trim() && isValidEmail(email);
  }

  const emailValidationError = computed(() => {
    if (!fieldsTouched.email) return false;
    const email = localUser.value?.email;
    if (!email?.trim()) return i18n.global.t('error.required-field');
    if (!validateEmail(email)) return i18n.global.t('login.valid.email');
    return false;
  });

  const nameValidationError = computed(() => {
    if (!fieldsTouched.name) return false;
    if (!localUser.value?.name?.trim()) return i18n.global.t('error.required-field');
    return false;
  });

  const surnameValidationError = computed(() => {
    if (!fieldsTouched.surname) return false;
    if (!localUser.value?.surname?.trim()) return i18n.global.t('error.required-field');
    return false;
  });

  // --- Methods ---

  function touchField(fieldName: keyof typeof fieldsTouched) {
    fieldsTouched[fieldName] = true;
  }

  function updateField<K extends keyof UserModel>(field: K, value: UserModel[K]) {
    if (localUser.value && localUser.value[field] !== value) {
      const updatedUser = localUser.value.clone();
      updatedUser[field] = value;
      localUser.value = updatedUser;
      emit('update:user', updatedUser);
    }
  }

  function updatePreference(
    key: string, // Use string type directly for the key
    value: any // Keep 'any' for the value from the event
  ) {
    if (localUser.value) {
      const updatedUser = localUser.value.clone();
      updatedUser.setPreference(key, value);
      localUser.value = updatedUser;
      emit('update:user', updatedUser);
    }
  }

  async function searchAndCompleteUser(email: string) {
    if (!validateEmail(email)) {
      isSearchingUser.value = false;
      if (localUser.value?.id && props.mode === 'creation') {
        const freshUser = new UserModel({ email: localUser.value.email });
        localUser.value = freshUser;
        emit('update:user', freshUser);
        emit('user-found', null);
      }
      return;
    }

    isSearchingUser.value = true;
    try {
      const foundUser = await usersStore.searchUser(email);
      if (foundUser) {
        const userToEmit = foundUser.clone();
        if (!userToEmit.color) {
          userToEmit.color = usersStore.userColorFromId(userToEmit.id);
        }
        localUser.value = userToEmit;
        emit('update:user', userToEmit);
        emit('user-found', userToEmit);
      } else {
        if (localUser.value?.id) {
          const freshUser = new UserModel({ email: localUser.value.email });
          localUser.value = freshUser;
          emit('update:user', freshUser);
          emit('user-found', null);
        } else {
          updateField('email', email);
          emit('user-found', null);
        }
      }
    } catch (error) {
      console.error('Error searching user:', error);
      emit('user-found', null);
      if (localUser.value?.id) {
        const freshUser = new UserModel({ email: localUser.value.email });
        localUser.value = freshUser;
        emit('update:user', freshUser);
      }
    } finally {
      isSearchingUser.value = false;
    }
  }

  function handleEmailInput(email: string) {
    if (localUser.value) {
      localUser.value.email = email;
    } else {
      localUser.value = new UserModel({ email });
    }
    emit('update:user', localUser.value.clone());

    if (props.mode === 'creation') {
      if (!searchDebounce.value) {
        searchDebounce.value = debounce(searchAndCompleteUser, 400);
      }
      if (validateEmail(email)) {
        searchDebounce.value(email);
      } else {
        if (searchDebounce.value && typeof (searchDebounce.value as any).cancel === 'function') {
          (searchDebounce.value as any).cancel();
        }
        isSearchingUser.value = false;
        if (localUser.value?.id) {
          const freshUser = new UserModel({ email: localUser.value.email });
          localUser.value = freshUser;
          emit('update:user', freshUser);
          emit('user-found', null);
        }
      }
    }
  }

  // --- Watchers ---

  watch(
    () => props.user,
    (newUser) => {
      if (newUser) {
        localUser.value = newUser.clone();
      } else {
        localUser.value = null;
      }
      Object.keys(fieldsTouched).forEach((key) => {
        fieldsTouched[key as keyof typeof fieldsTouched] = false;
      });
    },
    { immediate: true, deep: true }
  );
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
        min-height: 62px;

        .internal {
          padding-left: 5px;
          font-size: var(--paragraph-03);
          font-weight: 500;
          color: var(--color-info-text);
          background-color: var(--color-info-bg);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      .user-infos-layout {
        display: flex;
        flex-direction: row;
        gap: 40px;

        .wrapper-color {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;

          .u-color-picker {
            margin-top: 10px;
          }
        }

        .form {
          flex-grow: 1;

          .u-radio {
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .u-form-input {
            margin-bottom: 15px;
          }

          .u-alert-card {
            margin-bottom: 15px;
          }
        }
      }
    }

    .preferences-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--color-input-border);

      h4 {
        margin-bottom: 20px;
      }

      .preferences-layout {
        display: flex;
        flex-direction: column;

        .form {
          flex-grow: 1;

          .preference-item {
            margin-bottom: 15px;

            .el-form-item__label {
              color: var(--color-text-secondary);
              font-size: var(--paragraph-02);
              line-height: 20px;
              margin-bottom: 4px;
              display: block;
            }
            .u-radio {
              margin-top: 0;
            }
          }
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
