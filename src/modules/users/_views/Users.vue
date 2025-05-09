<template>
  <u-content-wrapper v-loading="loading" class="users -full-page">
    <u-list
      list-key="users"
      :loading="loading"
      :data="usersToDisplay"
      :default-sort="{ prop: 'firstName', order: 'ascending' }"
      :selectable="canWriteUser"
      :list-actions="listActions"
      :search-function="searchUser"
      entity-icon="icon-account"
      entity-label-key="users.list.header.available"
      @row-dblclick="editUser"
    >
      <template #header>
        <u-button type="primary" class="new-user-button" @click="newUser">
          {{ $t('users.new-user') }}
        </u-button>
      </template>

      <u-list-column
        column-key="commons.form.id"
        column-default-visibility="visible"
        :label="$t('commons.form.id')"
        sortable
        sort-prop="id"
      >
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </u-list-column>

      <u-list-column
        column-key="users.list.header.internal"
        column-default-visibility="visible"
        filterable
        filter-type="bool"
        filter-property="internal"
        :filter-config="{
          default: true,
          prompt: $t('users.list.header.internal'),
          trueLabel: $t('commons.yes'),
          falseLabel: $t('commons.no'),
        }"
        :label="$t('users.list.header.internal')"
        sortable
        sort-prop="internal"
      >
        <template #default="{ row }">
          <span>{{ row.internal ? $t('commons.yes') : $t('commons.no') }}</span>
        </template>
      </u-list-column>

      <u-list-column
        column-key="commons.form.email"
        column-default-visibility="visible"
        :label="$t('commons.form.email')"
        sortable
        sort-prop="email"
      >
        <template #default="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </u-list-column>

      <u-list-column
        column-key="commons.form.first-name"
        column-default-visibility="visible"
        :label="$t('commons.form.first-name')"
        sortable
        sort-prop="firstName"
      >
        <template #default="{ row }">
          <span>{{ row.firstName }}</span>
        </template>
      </u-list-column>

      <u-list-column
        column-key="commons.form.last-name"
        column-default-visibility="visible"
        :label="$t('commons.form.last-name')"
        sortable
        sort-prop="lastName"
      >
        <template #default="{ row }">
          <span>{{ row.lastName }}</span>
        </template>
      </u-list-column>

      <u-list-column
        column-key="commons.created_time"
        column-default-visibility="visible"
        :label="$t('commons.created_time')"
        sortable
        sort-prop="created_time"
        min-width="90px"
        filterable
        filter-type="daterange"
        filter-property="created_time"
        :filter-config="{ shortcuts: 'past', defaultEnd: new Date() }"
      >
        <template #default="{ row }">
          {{ $d(new Date(row.createdAt), 'middle') }}
        </template>
      </u-list-column>

      <u-list-column
        column-key="commons.updated_time"
        column-default-visibility="visible"
        :label="$t('commons.updated_time')"
        sortable
        sort-prop="updated_time"
        min-width="90px"
        filterable
        filter-type="daterange"
        filter-property="updated_time"
        :filter-config="{ shortcuts: 'past', defaultEnd: new Date() }"
      >
        <template #default="{ row }">
          {{ $d(new Date(row.updatedAt), 'middle') }}
        </template>
      </u-list-column>

      <u-list-column
        column-key="users.list.header.status"
        column-default-visibility="visible"
        :label="$t('users.list.header.status')"
        sortable
        sort-prop="isActive"
        filterable
        filter-type="bool"
        filter-property="isActive"
        :filter-config="{
          default: true,
          prompt: $t('users.list.header.status'),
          trueLabel: $t('commons.active'),
          falseLabel: $t('commons.inactive'),
        }"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <u-tag
            :icon="row.isActive ? 'icon-active' : 'icon-paused'"
            :background-color="row.isActive ? 'var(--color-green-100)' : 'var(--color-neutral-100)'"
            :color="row.isActive ? 'var(--color-green-700)' : 'var(--color-neutral-700)'"
            class="-list-tag"
          >
            {{ row.isActive ? $t('commons.active') : $t('commons.inactive') }}
          </u-tag>
        </template>
      </u-list-column>

      <u-list-column
        column-key="users.list.header.expiration"
        column-default-visibility="visible"
        :label="$t('users.list.header.expiration')"
        sortable
        sort-prop="permissionsExpireAt"
        min-width="150px"
        filterable
        filter-type="daterange"
        filter-property="permissionsExpireAt"
        :filter-config="{ shortcuts: 'around', defaultEnd: null }"
      >
        <template #default="{ row }">
          <span v-if="row.permissionsExpireAt">
            {{ $d(new Date(row.permissionsExpireAt), 'middle') }}
          </span>
          <span v-else>{{ $t('users.list.header.permanent') }}</span>
        </template>
      </u-list-column>

      <template #action="{ row }">
        <u-button
          type="tertiary"
          icon="icon-edit"
          size="small"
          class="button"
          :title="$t('commons.form.edit')"
          @click="editUser(row)"
        />
        <u-button
          type="delete"
          icon="icon-delete"
          size="small"
          class="button"
          :title="$t('commons.form.delete')"
          @click="confirmDelete([row])"
        />
      </template>
    </u-list>
  </u-content-wrapper>
</template>

<script setup lang="ts">
  import { ref, computed, h, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { UContentWrapper, UButton, UListColumn, UList, UTag } from '@/modules/ui';
  import { useNotification } from '@/composables/notfication';
  import { useUsersStore } from '@/stores/modules/users/user';
  import UserModel from '@/stores/modules/users/models/UserModel';
  import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';
  import i18n from '@/i18n';

  const loading = ref(true);
  const usersStore = useUsersStore();
  const authorisationsStore = useAuthorisationsStore();
  const { $errorMsg, $successMsg, $msgbox, $notification } = useNotification();
  const router = useRouter();

  const usersToDisplay = computed<UserModel[]>(() => {
    return usersStore.getAllUsers || [];
  });

  const canWriteUser = computed(() => authorisationsStore.isUserAllowed('user', 'write'));

  const listActions = computed(() => [
    {
      label: i18n.global.t('commons.form.edit'),
      icon: 'icon-edit',
      disabled: !canWriteUser.value,
      onClick: (user: UserModel) => editUser(user),
    },
    {
      label: i18n.global.t('commons.form.delete'),
      icon: 'icon-delete',
      multiTarget: true,
      disabled: !canWriteUser.value,
      onClick: (users: UserModel[]) => confirmDelete(users),
    },
  ]);

  function searchUser(user: UserModel, searchInput: string): boolean {
    const lower = searchInput.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(lower) ||
      user.lastName?.toLowerCase().includes(lower) ||
      user.email?.toLowerCase().includes(lower)
    );
  }

  function editUser(user: UserModel) {
    router.push({
      name: 'admin-user-settings-edit',
      params: { id: user.id.toString() },
    });
  }

  function newUser() {
    router.push({ name: 'user-settings-creation' });
  }

  async function confirmDelete(users: UserModel[]) {
    const msgboxNodes = [];
    msgboxNodes.push(
      h('p', { class: 'msgbox-text' }, i18n.global.t('users.delete.modal.deleted', users.length))
    );
    msgboxNodes.push(
      h(
        'ul',
        { class: 'msgbox-delete' },
        users.map((user) => h('li', null, `${user.fullName}`))
      )
    );

    try {
      await $msgbox({
        title: i18n.global.t('confirm.delete'),
        message: h('div', { class: 'msgbox-dialog-list' }, msgboxNodes),
        showCancelButton: true,
        confirmButtonText: i18n.global.t('commons.form.delete'),
        confirmButtonClass: '-warning',
        cancelButtonText: i18n.global.t('commons.form.cancel'),
      });

      const promises = users.map(async (user) => {
        await usersStore.deleteUser(user.id);
      });

      await Promise.all(promises);

      $successMsg(i18n.global.t('user.delete.success', promises.length));
    } catch (err) {
      if (err && err !== 'cancel' && err !== 'close') {
        console.error('Error deleting user(s):', err);
        $errorMsg(i18n.global.t('user.delete.error'));
      }
    }
  }

  onMounted(async () => {
    if (router.currentRoute.value.params.newUser && router.currentRoute.value.params.newUser === 'success') {
      $notification.notify({
        title: i18n.global.t('notify.success'),
        message: i18n.global.t('users.created.text'),
        type: 'success',
      });
    }
    try {
      await usersStore.ensureUsersFetched();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      $errorMsg(i18n.global.t('users.fetch.error'));
    } finally {
      loading.value = false;
    }
  });
</script>

<style lang="scss" scoped>
  .users {
    height: 100%;
    .u-list {
      .u-list-actions {
        .button {
          margin: 0 7px;
        }
      }
    }
  }
</style>
