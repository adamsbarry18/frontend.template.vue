<template>
  <div class="user-settings">
    <u-sections-with-menu v-if="user">
      <u-indexed-section :menu-title="$t('user.settings.personal-information')">
        <personal-info-form
          :user="user"
          :mode="mode"
          @update:user="onUserUpdate"
          @user-found="onUserFound"
        />
      </u-indexed-section>
      <u-indexed-section :menu-title="$t('user.settings.password')">
        <password-form
          :user="user"
          :mode="mode"
          @update:password="onPasswordUpdate"
          @validity-change="onPasswordValidityChange"
        />
      </u-indexed-section>
      <u-indexed-section
        v-if="mode === 'admin-edit'"
        :menu-title="$t('user.settings.administration')"
      >
        <account-administration-card
          :user="user"
          :mode="mode"
          @delete="onDeleteAccount"
        />
      </u-indexed-section>
      <template v-slot:menu-illustration>
        <img
          class="picture"
          src="@/assets/images/svg/user-settings.svg"
          alt="user-settings"
        />
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
  import {
    UButton,
    UActionButtonBar,
    UIndexedSection,
    USectionsWithMenu,
  } from '@/modules/common';
  import PersonalInfoForm from '../settings/PersonalInfoForm.vue';
  import AccountAdministrationCard from '../settings/AccountAdministrationCard.vue';
  import PasswordForm from '../settings/PasswordForm.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { updateActiveLanguage } from '@/libs/utils/Language';
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
      validator: (value: string) =>
        ['creation', 'admin-edit', 'user-edit'].includes(value),
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
  const level = ref<number | null>(null);
  const isPersonalInfoValid = ref(true);
  const isPasswordFormValid = ref(true);
  const foundUserInCreation = ref<UserModel | null>(null);
  const isSaving = ref(false);

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

  const checkPersonalInfoValidity = (
    userToCheck: UserModel | null
  ): boolean => {
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
      return (
        !!user.value?.email ||
        !!user.value?.name ||
        !!user.value?.surname ||
        !!password.value
      );
    }

    let changed = false;
    const fieldsToCompare: (keyof UserModel)[] = [
      'email',
      'name',
      'surname',
      'color',
    ];
    for (const field of fieldsToCompare) {
      if (user.value[field] !== originalUser.value[field]) {
        changed = true;
        break;
      }
    }
    if (
      user.value.preferences?.language !==
      originalUser.value.preferences?.language
    ) {
      changed = true;
    }

    if (
      props.mode === 'admin-edit' &&
      level.value !== originalUser.value.level
    ) {
      changed = true;
    }

    if (password.value !== '') {
      changed = true;
    }

    return changed;
  });

  const canSave = computed(() => {
    if (isSaving.value) return false;

    if (props.mode === 'creation') {
      if (!foundUserInCreation.value) {
        return isFormValid.value && !!user.value?.email && !!password.value;
      } else {
        return (
          !!user.value?.id &&
          level.value !== null &&
          !usersStore.getUserById(user.value.id)
        );
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

  function onUserFound(foundUser: UserModel | null) {
    if (props.mode === 'creation') {
      foundUserInCreation.value = foundUser;
      if (foundUser) {
        user.value = foundUser.clone();
        level.value = foundUser.level ?? SecurityLevel.USER;
        isPersonalInfoValid.value = true;
        isPasswordFormValid.value = true;
      } else {
        const currentEmail = user.value?.email;
        user.value = new UserModel({ email: currentEmail });
        level.value = SecurityLevel.USER;
        isPersonalInfoValid.value = checkPersonalInfoValidity(user.value);
      }
    }
  }

  async function loadUser() {
    const targetUserId = userIdFromRouteOrCurrent.value;

    if (props.mode === 'creation') {
      user.value = new UserModel();
      originalUser.value = null;
      level.value = SecurityLevel.USER;
      isPersonalInfoValid.value = false;
      isPasswordFormValid.value = false;
      foundUserInCreation.value = null;
    } else if (targetUserId) {
      let userFromStore = usersStore.getUserById(targetUserId);
      if (!userFromStore) {
        try {
          console.log(`User ${targetUserId} not in store, fetching...`);
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
        originalUser.value = userFromStore.clone();
        level.value = user.value.level;
        if (user.value.color === null) {
          user.value.color = usersStore.userColorFromId(user.value.id);
        }
        if (!user.value.preferences) {
          user.value.preferences = {};
        }
        if (!user.value.preferences.language) {
          user.value.setPreference(
            'language',
            i18n.global.locale.value || 'fr'
          );
        }
        isPersonalInfoValid.value = true;
        isPasswordFormValid.value = true;
      } else {
        console.error(`User with ID ${targetUserId} not found.`);
        $errorMsg(i18n.global.t('user.settings.load.error'));
        router.push({ name: 'users' });
      }
    } else if (props.mode === 'user-edit' && !currentUser.value) {
      console.error('Cannot edit user settings: current user not available.');
      $errorMsg(i18n.global.t('user.settings.load.error'));
      router.push({ name: 'login' });
    }
    setBreadcrumb();
  }

  function setBreadcrumb() {
    if (!user.value && props.mode !== 'creation') return;

    let links = [];
    const userName =
      user.value?.fullName || i18n.global.t('breadcrumb.admin.new-user');

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
        }
        password.value = '';
        isPasswordFormValid.value = true;

        if (props.mode === 'creation') {
          router.push({
            name: 'user-settings-edit',
            params: { id: newUserId.toString() },
          });
        } else {
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
    if (!user.value?.id || level.value === null) return false;

    try {
      // const existingAuth = await authorizationStore.getUserAuthorisations(user.value.id);
      // if (existingAuth) {
      //    $errorMsg(i18n.global.t('users.add-existing.error-already-exists'));
      //    return false;
      // }

      await authorizationStore.updateUserAuthorization(user.value.id, {
        level: level.value,
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
    if (!user.value || level.value === null || !password.value) return null;

    try {
      user.value.level = level.value;
      const userDataToSend = { ...user.value, password: password.value };

      const newUser = await usersStore.addUser(userDataToSend as UserModel);
      $successMsg(i18n.global.t('users.created.success'));
      return newUser.id;
    } catch (err: any) {
      console.error('Error creating new user:', err);
      const apiErrorMessage =
        err.message || i18n.global.t('users.created.error');
      $errorMsg(apiErrorMessage);
      return null;
    }
  }

  async function editUser(): Promise<boolean> {
    if (!user.value?.id || !originalUser.value) return false;

    let updateSuccess = false;
    let passwordUpdateSuccess = true;
    let levelUpdateSuccess = true;

    try {
      const hasInfoChanged = !deepEqual(user.value, originalUser.value);

      if (hasInfoChanged) {
        await usersStore.updateUser(user.value);
      }
      updateSuccess = true;

      if (password.value) {
        try {
          await usersStore.updateUserPassword({
            user: user.value,
            password: password.value,
          });
          passwordUpdateSuccess = true;
        } catch (pwdError) {
          console.error('Password update failed:', pwdError);
          $errorMsg(i18n.global.t('user.settings.update.password-error'));
          passwordUpdateSuccess = false;
        }
      }

      if (
        props.mode === 'admin-edit' &&
        level.value !== null &&
        level.value !== originalUser.value.level
      ) {
        try {
          await authorizationStore.updateUserAuthorization(user.value.id, {
            level: level.value,
          });
          user.value.level = level.value;
          levelUpdateSuccess = true;
        } catch (levelError) {
          console.error('Level update failed:', levelError);
          $errorMsg(i18n.global.t('user.settings.update.level-error'));
          levelUpdateSuccess = false;
        }
      }

      const overallSuccess =
        updateSuccess && passwordUpdateSuccess && levelUpdateSuccess;

      if (overallSuccess) {
        $successMsg(i18n.global.t('user.settings.updated.success'));
        if (
          user.value.preferences?.language !==
            originalUser.value.preferences?.language &&
          currentUser.value?.id === user.value.id
        ) {
          updateActiveLanguage(user.value.preferences.language, true);
        }
      } else {
        if (!overallSuccess)
          $errorMsg(i18n.global.t('user.settings.updated.error-partial'));
      }

      return overallSuccess;
    } catch (err) {
      console.error('User update error:', err);
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
