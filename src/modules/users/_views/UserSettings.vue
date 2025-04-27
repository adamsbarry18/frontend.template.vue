<template>
  <div class="user-settings">
    <u-sections-with-menu v-if="user">
      <u-indexed-section :menu-title="$t('user.settings.personal-information')">
        <personal-info-form
          ref="personalInfoRef"
          :user="user"
          :mode="mode"
          @change="onPersonalInfoChange"
        />
      </u-indexed-section>
      <u-indexed-section :menu-title="$t('user.settings.password')">
        <password-form
          ref="pwdFormRef"
          :password="password"
          :user="user"
          :mode="mode"
          @change="onPasswordChange"
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
    <u-action-button-bar class="validate-button" placement="mid">
      <u-button
        collapsable
        type="primary"
        icon="icon-validate"
        :icon-size="24"
        :disabled="!canSave"
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

  // import { useAuthorisationsStore } from '@/stores/modules/authorisations/authorisations';
  import { useUsersStore } from '@/stores/modules/users/user';
  // import { useAppStore } from '@/stores/app';
  import { updateActiveLanguage } from '@/libs/utils/Language';
  import { useNotification } from '@/composables/notfication';
  import i18n from '@/i18n';

  const props = defineProps({
    // creation, admin-edit, user-edit
    mode: {
      type: String,
      required: true,
    },
  });

  // Setup composables
  const route = useRoute();
  const router = useRouter();
  const { $successMsg, $errorMsg, $confirm } = useNotification();

  // Store actions and state
  const usersStore = useUsersStore();
  // const authorisationsStore = useAuthorisationsStore();
  // const appStore = useAppStore();
  const currentUser = computed(() => usersStore.currentUser);

  // Component refs
  const personalInfoRef = ref<InstanceType<typeof PersonalInfoForm> | null>(
    null
  );
  const pwdFormRef = ref<InstanceType<typeof PasswordForm> | null>(null);

  // Reactive state
  const user = ref(null);
  const level = ref<number | null>(null);
  const password = ref('');
  const lastPassword = ref('');
  const refreshKey = ref(0);

  // Handler methods for child component changes
  const onPersonalInfoChange = (updatedUser) => {
    user.value = updatedUser;
  };

  const onPasswordChange = (newPassword) => {
    password.value = newPassword;
  };

  // Other methods and computed properties remain the same
  // ...

  // Computed properties
  const userId = ref(1);
  /*const userId = computed(() => {
    return route.params.id
      ? parseInt(route.params.id as string)
      : currentUser.value.id;
  });*/

  const isFormValid = computed(() => {
    if (props.mode === 'creation' && user.value?.id) {
      return personalInfoRef.value?.canSave || false;
    }
    return (
      (personalInfoRef.value?.canSave && pwdFormRef.value?.canSave) || false
    );
  });

  const canCreateUser = computed(() => {
    return user.value && user.value.isValid();
  });

  const isUserAlreadyRegistered = computed(() => {
    if (!user.value?.id) return false;
    return !!usersStore.getUser(user.value.id);
  });

  const isDirty = computed(() => {
    if (!user.value?.id) {
      return true;
    }

    if (props.mode === 'admin-edit' && level.value !== user.value.level) {
      return true;
    }

    if (
      ['admin-edit', 'user-edit'].includes(props.mode) &&
      password.value !== ''
    ) {
      return true;
    }

    return (
      JSON.stringify(usersStore.getUser(user.value.id)) !==
      JSON.stringify(user.value)
    );
  });

  const canSave = computed(() => {
    if (!isFormValid.value) {
      return false;
    }

    if (!canCreateUser.value) {
      return false;
    }

    if (
      ['creation', 'admin-edit'].includes(props.mode) &&
      level.value === null
    ) {
      return false;
    }

    if (props.mode === 'creation') {
      if (user.value?.id) {
        return !isUserAlreadyRegistered.value;
      }
      return true;
    }

    return isDirty.value;
  });

  /* Watchers
  watch(userId, async () => {
    await loadUser();
    setBreadcrumb();
  });*/

  watch(
    props,
    async (newProps) => {
      if (newProps.mode !== props.mode) {
        await loadUser();
        setBreadcrumb();
      }
    },
    { deep: true }
  );

  watch(
    [user, password, level],
    () => {
      refreshKey.value++;
    },
    { deep: true }
  );

  // Methods
  async function loadUser() {
    await usersStore.getAll();

    if (props.mode === 'creation') {
      user.value = { level: 2 };
    } else {
      const userFromStore = usersStore.getUser(userId.value);
      user.value = userFromStore ? userFromStore : null;
    }

    if (user.value && user.value.color === null) {
      user.value.color = usersStore.userColorFromId(
        user.value.id ? user.value.id : Date.now()
      );
    }

    level.value = user.value?.level || 2;
  }

  function setBreadcrumb() {
    if (!user.value) return;

    let links = [];

    if (props.mode === 'admin-edit') {
      links = [
        {
          label: i18n.global.t('breadcrumb.admin.users'),
          path: '/users',
        },
        {
          label: user.value.fullName,
          path: '',
        },
      ];
    } else if (props.mode === 'creation') {
      links = [
        {
          label: i18n.global.t('breadcrumb.admin.users'),
          path: '/users',
        },
        {
          label: i18n.global.t('breadcrumb.admin.new-user'),
          path: '',
        },
      ];
    } else if (props.mode === 'user-edit') {
      links = [
        {
          label: i18n.global.t('breadcrumb.my-account'),
          path: '',
        },
      ];
    }

    // appStore.setBreadcrumb({ links });
  }

  async function save() {
    if (!canSave.value || !user.value) return;

    let id: number | null = null;

    if (props.mode === 'creation') {
      if (user.value.id) {
        id = await addExistingUser();
      } else {
        id = await createNewUser();
      }
    } else {
      await editUser();
    }

    if (id) {
      router.push({
        name: 'user-settings',
        params: { id },
      });
    }
  }

  async function addExistingUser() {
    if (!user.value || level.value === null) return null;

    try {
      /*await authorisationsStore.addUserLevel({
          userId: user.value.id,
          level: level.value,
        });*/

      $successMsg(i18n.global.t('users.created.text'));
      return user.value.id;
    } catch (err) {
      $errorMsg(i18n.global.t('users.created.text.error'));
      return null;
    }
  }

  async function createNewUser(): Promise<number | null> {
    if (!user.value || level.value === null) return null;

    try {
      user.value.level = level.value;
      await usersStore.addUser({
        ...user.value,
        password: password.value,
      });
      password.value = '';
      $successMsg(i18n.global.t('users.created.text'));
      return user.value.id;
    } catch (err) {
      $errorMsg(i18n.global.t('users.created.text.error'));
      return null;
    }
  }

  async function editUser() {
    if (!user.value) return;

    try {
      const oldUser = usersStore.getUser(user.value.id);
      const oldLang = oldUser?.language;

      if (props.mode === 'user-edit') {
        await usersStore.updateUser(user.value);
      } else if (
        props.mode === 'admin-edit' &&
        level.value !== user.value.level
      ) {
        /*await authorisationsStore.updateLevel({
            userId: user.value.id,
            level: level.value as number,
          });*/
        user.value.level = level.value as number;
      }

      if (password.value !== '') {
        await usersStore.updateUserPassword({
          user: user.value,
          password: password.value,
        });

        if (currentUser.value.id === user.value.id) {
          localStorage.setItem('keepPassword', JSON.stringify(password.value));
        }

        lastPassword.value = password.value;
      }

      $successMsg(i18n.global.t('user.settings.updated.success'));

      if (
        oldLang !== user.value.language &&
        currentUser.value.id === user.value.id
      ) {
        updateActiveLanguage(user.value.language, true);
      }
    } catch (err) {
      console.error('User update error', err);
      $errorMsg(i18n.global.t('user.settings.updated.error'));
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
        /*await authorisationsStore.deleteUser({
            userId: user.value.id,
          });*/

        $successMsg(i18n.global.t('user.delete.success', 1));

        router.push({
          name: 'users',
        });
      }
    } catch (err) {
      $errorMsg(i18n.global.t('user.delete.error'));
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    await loadUser();
    setBreadcrumb();
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
