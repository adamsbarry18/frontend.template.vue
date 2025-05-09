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
      <u-button
        collapsable
        type="tertiary"
        icon="icon-arrow-back"
        :icon-size="24"
        round
        class="button"
        :title="$t('commons.form.back')"
        :label="$t('commons.form.back')"
        @click="goBack"
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

  // --- Types for User Authorizations ---
  interface UserAuthorizationsData {
    level: SecurityLevel;
    internal: boolean;
    permissions: Record<string, string[]> | null;
    isActive: boolean;
    permissionsExpireAt: Date | null;
  }

  // Type for the data structure returned by authorizationStore.getUserAuthorisations
  interface ApiUserAuthDataFromStore {
    authorisation: Record<string, string[]> | null;
    expire: string | null;
    level: SecurityLevel;
    isActive: boolean;
  }

  interface BreadcrumbLink {
    label: string;
    path: string;
  }

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

  const user = ref<UserModel | null>(null);
  const originalUser = ref<UserModel | null>(null);
  const password = ref('');
  const isPersonalInfoValid = ref(true);
  const isPasswordFormValid = ref(true);
  const foundUserInCreation = ref<UserModel | null>(null);
  const isSaving = ref(false);
  const userAuthorizations = ref<UserAuthorizationsData | null>(null);
  const originalAuthorizations = ref<UserAuthorizationsData | null>(null);

  const currentUser = computed(() => usersStore.currentUser);

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
      !!userToCheck.firstName?.trim() &&
      !!userToCheck.lastName?.trim() &&
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
        !!user.value?.email || !!user.value?.firstName || !!user.value?.lastName || !!password.value;
      return dirtyInCreation;
    }

    const fieldsToCompare: (keyof UserModel)[] = ['email', 'firstName', 'lastName', 'color'];
    for (const field of fieldsToCompare) {
      if (user.value[field] !== originalUser.value[field]) {
        return true;
      }
    }

    if (props.mode === 'admin-edit' && !deepEqual(userAuthorizations.value, originalAuthorizations.value)) {
      return true;
    }

    if (!deepEqual(user.value.preferences, originalUser.value.preferences)) {
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

  // --- Helper Functions for User Authorizations ---
  function mapAuthDataToUserAuthorizations(
    userModel: UserModel,
    authDataFromStore?: ApiUserAuthDataFromStore | null
  ): UserAuthorizationsData {
    if (authDataFromStore) {
      return {
        level: authDataFromStore.level,
        internal: userModel.internal,
        permissions: authDataFromStore.authorisation ?? null,
        isActive: authDataFromStore.isActive,
        permissionsExpireAt: authDataFromStore.expire ? new Date(authDataFromStore.expire) : null,
      };
    }
    // Fallback to UserModel data if no specific authDataFromStore
    return {
      level: userModel.level,
      internal: userModel.internal,
      permissions: userModel.permissions ?? null,
      isActive: userModel.isActive,
      permissionsExpireAt: userModel.permissionsExpireAt,
    };
  }

  function getInitialUserAuthorizations(email?: string | null): UserAuthorizationsData {
    const initialLevel = SecurityLevel.USER;
    const initialInternal = email ? UserModel.isEmailInternal(email) : false;
    const initialPermissions = null;
    return {
      level: initialLevel,
      internal: initialInternal,
      permissions: initialPermissions,
      isActive: true,
      permissionsExpireAt: null,
    };
  }

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
          const authDataFromApi = await authorizationStore.getUserAuthorisations(foundUser.id);
          userAuthorizations.value = mapAuthDataToUserAuthorizations(foundUser, authDataFromApi);
        } catch (authError) {
          console.error(`Failed to fetch authorizations for found user ${foundUser.id}:`, authError);
          userAuthorizations.value = mapAuthDataToUserAuthorizations(foundUser); // Fallback to user model data
        }
        originalAuthorizations.value = userAuthorizations.value ? { ...userAuthorizations.value } : null;
      } else {
        const currentEmail = user.value?.email;
        userAuthorizations.value = getInitialUserAuthorizations(currentEmail);
        originalAuthorizations.value = userAuthorizations.value ? { ...userAuthorizations.value } : null;

        user.value = new UserModel({
          email: currentEmail,
          level: userAuthorizations.value.level,
          internal: userAuthorizations.value.internal,
          permissions: userAuthorizations.value.permissions,
          preferences: { language: 'fr' },
        });
        isPersonalInfoValid.value = checkPersonalInfoValidity(user.value);
      }
    }
  }

  function onAuthorizationsUpdate(updatedAuths: UserAuthorizationsData) {
    userAuthorizations.value = updatedAuths;
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

      userAuthorizations.value = getInitialUserAuthorizations();
      originalAuthorizations.value = userAuthorizations.value ? { ...userAuthorizations.value } : null;
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
            const authDataFromApi = await authorizationStore.getUserAuthorisations(targetUserId);
            if (user.value) {
              userAuthorizations.value = mapAuthDataToUserAuthorizations(user.value, authDataFromApi);
            } else {
              console.error('User model is null when trying to load admin-edit authorizations');
              userAuthorizations.value = null;
            }
          } catch (authError) {
            console.error(`Failed to fetch authorizations for user ${targetUserId}:`, authError);
            $errorMsg(i18n.global.t('user.settings.load.auth-error'));
            if (user.value) {
              userAuthorizations.value = mapAuthDataToUserAuthorizations(user.value); // Fallback
            } else {
              userAuthorizations.value = null;
            }
          }
          originalAuthorizations.value = userAuthorizations.value ? { ...userAuthorizations.value } : null;
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

  function goBack() {
    router.back();
  }

  function setBreadcrumb() {
    if (!user.value && props.mode !== 'creation') return;

    let links: BreadcrumbLink[] = [];
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
            originalAuthorizations.value = { ...userAuthorizations.value };
          }

          if (props.mode === 'admin-edit' && user.value && newUserId) {
            try {
              const freshAuthData = await authorizationStore.getUserAuthorisations(newUserId);
              userAuthorizations.value = mapAuthDataToUserAuthorizations(user.value, freshAuthData);
              originalAuthorizations.value = userAuthorizations.value
                ? {
                    ...userAuthorizations.value,
                  }
                : null;
            } catch (refreshError) {
              console.error('Failed to refresh authorizations after save:', refreshError);
              if (user.value) {
                userAuthorizations.value = mapAuthDataToUserAuthorizations(user.value);
                originalAuthorizations.value = userAuthorizations.value
                  ? {
                      ...userAuthorizations.value,
                    }
                  : null;
              }
            }
          }
        }
        password.value = '';
        isPasswordFormValid.value = true;

        if (props.mode === 'creation') {
          router.push({ name: 'users' });
        } else if (props.mode === 'admin-edit') {
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
      await authorizationStore.updateUserStatus(user.value.id, {
        isActive: userAuthorizations.value.isActive,
        expire: userAuthorizations.value.permissionsExpireAt?.toISOString() ?? null, // Convert Date to ISO string or null
        level: userAuthorizations.value.level,
      });

      if (!deepEqual(userAuthorizations.value.permissions, originalAuthorizations.value?.permissions)) {
        await authorizationStore.updateUserAuthorization(user.value.id, {
          permissions: userAuthorizations.value.permissions,
        });
      }

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
    user.value.isActive = userAuthorizations.value.isActive;
    user.value.permissionsExpireAt = userAuthorizations.value.permissionsExpireAt;

    try {
      const userDataToSend: Partial<UserModel> = {
        email: user.value.email,
        password: password.value,
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        level: user.value.level,
        internal: user.value.internal,
        color: user.value.color,
        preferences: user.value.preferences,
        permissions: user.value.permissions,
        permissionsExpireAt: user.value.permissionsExpireAt,
        isActive: user.value.isActive,
      };

      const newUser = await usersStore.addUser(userDataToSend);
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

    const infoFieldsToCheck: (keyof UserModel)[] = ['email', 'firstName', 'lastName', 'color'];
    const infoChanged = infoFieldsToCheck.some((field) => user.value![field] !== originalUser.value![field]);

    try {
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
          await authorizationStore.updateUserStatus(user.value.id, {
            isActive: userAuthorizations.value.isActive,
            expire: userAuthorizations.value.permissionsExpireAt?.toISOString() ?? null,
            level: userAuthorizations.value.level,
          });

          if (!deepEqual(userAuthorizations.value.permissions, originalAuthorizations.value?.permissions)) {
            await authorizationStore.updateUserAuthorization(user.value.id, {
              permissions: userAuthorizations.value.permissions,
            });
          }

          originalAuthorizations.value = { ...userAuthorizations.value };
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
