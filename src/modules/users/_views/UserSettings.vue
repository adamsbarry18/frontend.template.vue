<template>
  <div class="user-settings">
    <u-sections-with-menu v-if="user">
      <u-indexed-section :menu-title="$t('user.settings.personal-information')">
        <personal-info-form :user="user" :mode="mode" @update:user="onUserUpdate" @user-found="onUserFound" />
      </u-indexed-section>
      <u-indexed-section :menu-title="$t('user.settings.password')">
        <password-form
          :user="user"
          :mode="mode"
          @update:password="onPasswordUpdate"
          @validity-change="onPasswordValidityChange"
        />
      </u-indexed-section>
      <u-indexed-section v-if="mode === 'admin-edit'" :menu-title="$t('user.settings.administration')">
        <account-administration-card :user="user" :mode="mode" @delete="onDeleteAccount" />
      </u-indexed-section>
      <u-indexed-section
        v-if="mode === 'admin-edit' || mode === 'creation'"
        :menu-title="$t('user.settings.authorizations.title')"
      >
        <user-authorizations-form
          v-if="userAuthorizations"
          :authorizations="userAuthorizations"
          :can-edit="mode === 'admin-edit' || (mode === 'creation' && !foundUserInCreation)"
          @update:authorizations="onAuthorizationsUpdate"
        />
      </u-indexed-section>
      <template v-slot:menu-illustration>
        <img class="picture" src="@/assets/images/svg/user-settings.svg" alt="user-settings" />
      </template>
    </u-sections-with-menu>
    <u-action-button-bar v-else class="loading-placeholder">
      <p>Loading user data...</p>
    </u-action-button-bar>

    <u-action-button-bar class="validate-button" placement="mid">
      <u-button
        collapsable
        type="primary"
        icon="icon-validate"
        :icon-size="24"
        :disabled="!canSave"
        :loading="isSaving"
        round
        class="button"
        :title="$t('commons.form.save')"
        :label="$t('commons.form.save')"
        @click="save"
      />
    </u-action-button-bar>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { UButton, UActionButtonBar, UIndexedSection, USectionsWithMenu } from '@/modules/ui';
  import PersonalInfoForm from '../settings/PersonalInfoForm.vue';
  import AccountAdministrationCard from '../settings/AccountAdministrationCard.vue';
  import PasswordForm from '../settings/PasswordForm.vue';
  import UserAuthorizationsForm from '../settings/UserAuthorizationsForm.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotification } from '@/composables/notfication';
  import i18n from '@/i18n';
  import UserModel from '@/stores/modules/users/models/UserModel';
  import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';
  import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
  import { deepEqual } from '@/libs/utils/Object';
  import { useBreadcrumbStore } from '@/stores/modules/breadcrumb';

  const props = defineProps({
    mode: {
      type: String,
      required: true,
      validator: (value: string) => ['creation', 'admin-edit', 'user-edit'].includes(value),
    },
  });

  const route = useRoute();
  const router = useRouter();
  const { $successMsg, $errorMsg, $confirm } = useNotification();
  const usersStore = useUsersStore();
  const authorizationStore = useAuthorisationsStore();
  const breadcrumbStore = useBreadcrumbStore();
  const currentUser = computed(() => usersStore.currentUser);

  const user = ref<UserModel | null>(null);
  const originalUser = ref<UserModel | null>(null);
  const password = ref('');
  const isPersonalInfoValid = ref(true);
  const isPasswordFormValid = ref(true);
  const foundUserInCreation = ref<UserModel | null>(null);
  const isSaving = ref(false);
  const userAuthorizations = ref<{
    level: number;
    internal: boolean;
    permissions: Record<string, string[]> | null;
  } | null>(null);
  const originalAuthorizations = ref<{
    level: number;
    internal: boolean;
    permissions: Record<string, string[]> | null;
  } | null>(null);

  const userIdFromRouteOrCurrent = computed(() => {
    if (props.mode === 'creation') return null;
    if (props.mode === 'admin-edit' && route.params.id) {
      return parseInt(route.params.id as string);
    }
    if (props.mode === 'user-edit' && currentUser.value) {
      return currentUser.value.id;
    }
    return null;
  });

  const checkPersonalInfoValidity = (userToCheck: UserModel | null): boolean => {
    if (!userToCheck) return false;
    return (
      !!userToCheck.email?.trim() &&
      !!userToCheck.name?.trim() &&
      !!userToCheck.surname?.trim() &&
      UserModel.prototype.isValid.call(userToCheck)
    );
  };

  const isFormValid = computed(() => {
    if (!isPersonalInfoValid.value) return false;
    if (!isPasswordFormValid.value) return false;
    return true;
  });

  const isDirty = computed(() => {
    if (!user.value || !originalUser.value) {
      const dirtyInCreation =
        !!user.value?.email || !!user.value?.name || !!user.value?.surname || !!password.value;
      return dirtyInCreation;
    }

    const fieldsToCompare: (keyof UserModel)[] = ['email', 'name', 'surname', 'color'];
    for (const field of fieldsToCompare) {
      if (user.value[field] !== originalUser.value[field]) {
        return true;
      }
    }

    // Comparaison des autorisations (level, internal, permissions)
    if (props.mode === 'admin-edit' && !deepEqual(userAuthorizations.value, originalAuthorizations.value)) {
      return true;
    }

    const originalPrefs = originalUser.value.preferences ?? {};
    const currentPrefs = user.value.preferences ?? {};
    const originalLang = originalPrefs.language ?? null;
    const currentLang = currentPrefs.language ?? null;
    if (originalLang !== currentLang) {
      return true;
    }

    const originalTheme = originalPrefs.theme ?? null;
    const currentTheme = currentPrefs.theme ?? null;
    if (originalTheme !== currentTheme) {
      return true;
    }

    if (password.value !== '') {
      return true;
    }
    return false;
  });

  const canSave = computed(() => {
    if (isSaving.value) return false;

    if (props.mode === 'creation') {
      if (!foundUserInCreation.value) {
        return isFormValid.value && !!password.value;
      } else {
        return !!user.value?.id && !usersStore.getUserById(user.value.id);
      }
    }

    if (props.mode === 'admin-edit' || props.mode === 'user-edit') {
      return isFormValid.value && isDirty.value;
    }

    return false;
  });

  function onUserUpdate(updatedUser: UserModel) {
    user.value = updatedUser;
    isPersonalInfoValid.value = checkPersonalInfoValidity(user.value);
  }

  function onPasswordUpdate(newPassword: string) {
    password.value = newPassword;
  }

  function onPasswordValidityChange(isValid: boolean) {
    isPasswordFormValid.value = isValid;
  }

  async function onUserFound(foundUser: UserModel | null) {
    if (props.mode === 'creation') {
      foundUserInCreation.value = foundUser;
      if (foundUser) {
        user.value = foundUser.clone();
        isPersonalInfoValid.value = true;
        isPasswordFormValid.value = true;
        try {
          const authData = await authorizationStore.getUserAuthorisations(foundUser.id);
          if (authData) {
            userAuthorizations.value = {
              level: authData.level ?? foundUser.level,
              internal: authData.internal ?? foundUser.internal,
              permissions: authData.permissions ?? null,
            };
          } else {
            userAuthorizations.value = {
              level: foundUser.level,
              internal: foundUser.internal,
              permissions: foundUser.permissions ?? null,
            };
          }
          originalAuthorizations.value = userAuthorizations.value;
        } catch (authError) {
          console.error(`Failed to fetch authorizations for found user ${foundUser.id}:`, authError);
          userAuthorizations.value = {
            level: foundUser.level,
            internal: foundUser.internal,
            permissions: foundUser.permissions ?? null,
          };
          originalAuthorizations.value = userAuthorizations.value;
        }
      } else {
        const currentEmail = user.value?.email;
        const initialLevel = SecurityLevel.USER;
        const initialInternal = UserModel.isEmailInternal(currentEmail || '');
        const initialPermissions = null;

        user.value = new UserModel({
          email: currentEmail,
          level: initialLevel,
          internal: initialInternal,
          permissions: initialPermissions,
        });
        isPersonalInfoValid.value = checkPersonalInfoValidity(user.value);

        userAuthorizations.value = {
          level: initialLevel,
          internal: initialInternal,
          permissions: initialPermissions,
        };
        originalAuthorizations.value = userAuthorizations.value;
      }
    }
  }

  function onAuthorizationsUpdate(updatedAuths: {
    level: number;
    internal: boolean;
    permissions: Record<string, string[]> | null;
  }) {
    userAuthorizations.value = updatedAuths;
    if (user.value && props.mode === 'admin-edit') {
      user.value.level = updatedAuths.level;
      user.value.internal = updatedAuths.internal;
    }
  }

  async function loadUser() {
    const targetUserId = userIdFromRouteOrCurrent.value;
    userAuthorizations.value = null;
    originalAuthorizations.value = null;
    if (props.mode === 'creation') {
      const initialLevel = SecurityLevel.USER;
      const initialInternal = false;
      const initialPermissions = null;
      user.value = new UserModel({
        level: initialLevel,
        internal: initialInternal,
        permissions: initialPermissions,
        preferences: { language: 'fr' },
      });
      originalUser.value = null;
      isPersonalInfoValid.value = false;
      isPasswordFormValid.value = false;
      foundUserInCreation.value = null;

      userAuthorizations.value = {
        level: initialLevel,
        internal: initialInternal,
        permissions: initialPermissions,
      };
      originalAuthorizations.value = userAuthorizations.value;
    } else if (targetUserId) {
      let userFromStore = usersStore.getUserById(targetUserId);
      if (!userFromStore) {
        try {
          userFromStore = await usersStore.fetchUser(targetUserId);
        } catch (error) {
          console.error(`Failed to fetch user ${targetUserId}:`, error);
          $errorMsg(i18n.global.t('user.settings.load.error'));
          router.push({ name: 'users' });
          return;
        }
      }

      if (userFromStore) {
        user.value = userFromStore.clone();

        if (user.value.color === null) {
          user.value.color = usersStore.userColorFromId(user.value.id);
        }
        if (!user.value.preferences) {
          user.value.preferences = {};
        }
        if (!user.value.preferences.language) {
          user.value.setPreference('language', i18n.global.locale.value || 'fr');
        }

        originalUser.value = user.value.clone();
        isPersonalInfoValid.value = true;
        isPasswordFormValid.value = true;

        if (props.mode === 'admin-edit') {
          try {
            const authData = await authorizationStore.getUserAuthorisations(targetUserId);
            if (authData) {
              userAuthorizations.value = {
                level: authData.level ?? user.value.level,
                internal: user.value.internal,
                permissions: authData.authorisation ?? null,
              };
              originalAuthorizations.value = userAuthorizations.value;
            } else {
              userAuthorizations.value = {
                level: user.value.level,
                internal: user.value.internal,
                permissions: user.value.permissions ?? null,
              };
              originalAuthorizations.value = userAuthorizations.value;
            }
          } catch (authError) {
            console.error(`Failed to fetch authorizations for user ${targetUserId}:`, authError);
            $errorMsg(i18n.global.t('user.settings.load.auth-error'));
            userAuthorizations.value = {
              level: user.value.level,
              internal: user.value.internal,
              permissions: user.value.permissions ?? null,
            };
            originalAuthorizations.value = userAuthorizations.value;
          }
        }
      } else {
        console.error(`User with ID ${targetUserId} not found.`);
        $errorMsg(i18n.global.t('user.settings.load.error'));
        router.push({ name: 'users' });
      }
    } else if (props.mode === 'user-edit' && !currentUser.value) {
      if (usersStore.isAuthenticated) {
        $errorMsg(i18n.global.t('user.settings.load.error'));
        router.push({ name: 'login' });
      }
    }
    setBreadcrumb();
  }

  function setBreadcrumb() {
    if (!user.value && props.mode !== 'creation') return;

    let links = [];
    const userName = user.value?.fullName || i18n.global.t('breadcrumb.admin.new-user');

    if (props.mode === 'admin-edit') {
      links = [
        { label: i18n.global.t('breadcrumb.admin.users'), path: '/users' },
        { label: userName, path: '' },
      ];
    } else if (props.mode === 'creation') {
      links = [
        { label: i18n.global.t('breadcrumb.admin.users'), path: '/users' },
        { label: i18n.global.t('breadcrumb.admin.new-user'), path: '' },
      ];
    } else if (props.mode === 'user-edit') {
      links = [{ label: i18n.global.t('breadcrumb.my-account'), path: '' }];
    }
    breadcrumbStore.setBreadcrumb(links, userName);
  }

  async function save() {
    if (!canSave.value || !user.value) return;

    isSaving.value = true;
    let success = false;
    let newUserId: number | null = null;

    try {
      if (props.mode === 'creation') {
        if (foundUserInCreation.value && user.value.id) {
          success = await addExistingUser();
          newUserId = user.value.id;
        } else {
          newUserId = await createNewUser();
          success = !!newUserId;
        }
      } else {
        success = await editUser();
        newUserId = user.value.id;
      }

      if (success && newUserId) {
        const updatedUserFromStore = usersStore.getUserById(newUserId);
        if (updatedUserFromStore) {
          originalUser.value = updatedUserFromStore.clone();
          user.value = updatedUserFromStore.clone();
          if (userAuthorizations.value) {
            originalAuthorizations.value = userAuthorizations.value;
          }
          if (props.mode === 'admin-edit') {
            try {
              const freshAuthData = await authorizationStore.getUserAuthorisations(newUserId);
              if (freshAuthData) {
                userAuthorizations.value = {
                  level: freshAuthData.level ?? user.value.level,
                  internal: user.value.internal,
                  permissions: freshAuthData.authorisation ?? null,
                };
                originalAuthorizations.value = userAuthorizations.value;
              }
            } catch (refreshError) {
              console.error('Failed to refresh authorizations after save:', refreshError);
            }
          }
        }
        password.value = '';
        isPasswordFormValid.value = true;

        if (props.mode === 'creation' || props.mode === 'admin-edit') {
          router.push({ name: 'users' });
        } else if (props.mode === 'user-edit') {
          await loadUser();
        }
      }
    } catch (error) {
      console.error('Save operation failed:', error);
    } finally {
      isSaving.value = false;
    }
  }

  async function addExistingUser(): Promise<boolean> {
    if (!user.value?.id || !userAuthorizations.value) return false;

    try {
      await authorizationStore.updateUserAuthorization(user.value.id, {
        level: userAuthorizations.value.level,
        internal: userAuthorizations.value.internal,
        permissions: userAuthorizations.value.permissions,
      });

      $successMsg(i18n.global.t('users.add-existing.success'));
      await usersStore.fetchUser(user.value.id);
      return true;
    } catch (err) {
      console.error('Error adding existing user:', err);
      $errorMsg(i18n.global.t('users.add-existing.error'));
      return false;
    }
  }

  async function createNewUser(): Promise<number | null> {
    if (!user.value || !userAuthorizations.value || !password.value) return null;

    user.value.level = userAuthorizations.value.level;
    user.value.internal = userAuthorizations.value.internal;
    user.value.permissions = userAuthorizations.value.permissions;

    try {
      const userDataToSend = { ...user.value, password: password.value };
      const newUser = await usersStore.addUser(userDataToSend as UserModel);
      $successMsg(i18n.global.t('users.created.success'));
      return newUser.id;
    } catch (err: any) {
      console.error('Error creating new user:', err);
      const apiErrorMessage = err.message || i18n.global.t('users.created.error');
      $errorMsg(apiErrorMessage);
      return null;
    }
  }

  async function editUser(): Promise<boolean> {
    if (!user.value?.id || !originalUser.value) return false;

    let infoUpdateSuccess = false;
    let passwordUpdateSuccess = true;
    let authorizationUpdateSuccess = true;
    let preferencesUpdateSuccess = true;

    const originalPrefs = originalUser.value.preferences ?? {};
    const currentPrefs = user.value.preferences ?? {};
    const languageChanged = originalPrefs.language !== currentPrefs.language;
    const themeChanged = originalPrefs.theme !== currentPrefs.theme;
    const authorizationChanged =
      props.mode === 'admin-edit' && !deepEqual(userAuthorizations.value, originalAuthorizations.value);
    const passwordChanged = !!password.value;
    const userCloneForInfoCheck = user.value.clone();
    const originalUserCloneForInfoCheck = originalUser.value.clone();

    delete userCloneForInfoCheck.preferences;
    delete originalUserCloneForInfoCheck.preferences;

    try {
      const infoChanged = !deepEqual(userCloneForInfoCheck, originalUserCloneForInfoCheck);
      if (infoChanged) {
        await usersStore.updateUser(user.value);
      }
      infoUpdateSuccess = true;

      let wasCurrentUserPasswordUpdated = false;
      if (passwordChanged) {
        try {
          wasCurrentUserPasswordUpdated = await usersStore.updateUserPassword({
            user: user.value,
            password: password.value,
          });

          if (wasCurrentUserPasswordUpdated) {
            $successMsg(i18n.global.t('user.settings.update.password-success-logout'));
            passwordUpdateSuccess = true;

            await usersStore.logout();
            return true;
          } else {
            passwordUpdateSuccess = true;
          }
        } catch (pwdError) {
          console.error('Password update failed:', pwdError);
          $errorMsg(i18n.global.t('user.settings.update.password-error'));
          passwordUpdateSuccess = false;
        }
      }

      if (authorizationChanged && userAuthorizations.value) {
        try {
          await authorizationStore.updateUserAuthorization(user.value.id, {
            level: userAuthorizations.value.level,
            internal: userAuthorizations.value.internal,
            permissions: userAuthorizations.value.permissions,
          });
          originalAuthorizations.value = { ...userAuthorizations.value };
          if (user.value) {
            user.value.level = userAuthorizations.value.level;
            user.value.internal = userAuthorizations.value.internal;
            user.value.permissions = userAuthorizations.value.permissions;
          }
          authorizationUpdateSuccess = true;
        } catch (authError) {
          console.error('Authorization update failed:', authError);
          $errorMsg(i18n.global.t('user.settings.update.auth-error'));
          authorizationUpdateSuccess = false;
        }
      }

      const preferencePromises: Promise<void>[] = [];
      if (languageChanged) {
        preferencePromises.push(
          usersStore.setPreference({
            key: 'language',
            value: currentPrefs.language,
          })
        );
      }
      if (themeChanged) {
        preferencePromises.push(usersStore.setPreference({ key: 'theme', value: currentPrefs.theme }));
      }

      if (preferencePromises.length > 0) {
        try {
          await Promise.all(preferencePromises);
          preferencesUpdateSuccess = true;
        } catch (prefError) {
          console.error('Preferences update failed:', prefError);
          $errorMsg(i18n.global.t('user.settings.update.preferences-error'));
          preferencesUpdateSuccess = false;
        }
      }

      const overallSuccess =
        infoUpdateSuccess && passwordUpdateSuccess && authorizationUpdateSuccess && preferencesUpdateSuccess;

      if (overallSuccess) {
        if (
          infoChanged ||
          (passwordChanged && !wasCurrentUserPasswordUpdated) ||
          authorizationChanged ||
          languageChanged ||
          themeChanged
        ) {
          $successMsg(i18n.global.t('user.settings.updated.success'));
        }
      } else {
        if (
          passwordUpdateSuccess &&
          (infoUpdateSuccess || authorizationUpdateSuccess || preferencesUpdateSuccess)
        ) {
          $errorMsg(i18n.global.t('user.settings.updated.error-partial'));
        }
      }

      return overallSuccess;
    } catch (infoError) {
      console.error('User general info update error:', infoError);
      $errorMsg(i18n.global.t('user.settings.updated.error'));
      return false;
    }
  }

  async function onDeleteAccount() {
    if (!user.value) return;

    try {
      const result = await $confirm({
        message: i18n.global.t('user.delete.confirm', {
          user: user.value.fullName,
        }),
        title: i18n.global.t('confirm.delete'),
        confirmButtonText: i18n.global.t('commons.form.delete'),
        cancelButtonText: i18n.global.t('commons.form.cancel'),
        confirmButtonClass: '-warning',
        type: 'warning',
      });

      if (result) {
        await usersStore.deleteUser(user.value.id);

        $successMsg(i18n.global.t('user.delete.success', 1));
        router.push({ name: 'users' });
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      $errorMsg(i18n.global.t('user.delete.error'));
    }
  }

  watch(userIdFromRouteOrCurrent, async (newId, oldId) => {
    if (newId !== oldId && props.mode !== 'creation') {
      await loadUser();
    }
  });

  watch(
    () => props.mode,
    async (newMode, oldMode) => {
      if (newMode !== oldMode) {
        await loadUser();
      }
    }
  );

  onMounted(async () => {
    await loadUser();
  });
</script>

<style lang="scss">
  .user-settings {
    display: flex;
    background-color: var(--color-background-light);
    height: 100%;
    overflow: hidden;

    .card-content {
      .title {
        letter-spacing: 0.27px;
        font-size: var(--paragraph-01);
        font-weight: 800;
      }
    }

    .u-sections-with-menu {
      .scroller-menu-wrapper {
        margin-top: 40px;

        .scroller-menu {
          width: 290px;
        }
      }
    }
  }
</style>
