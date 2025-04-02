<template>
  <u-content-wrapper v-loading="loading" class="users -full-page">
    <u-list
      list-key="users"
      :loading="loading"
      :data="filteredUsers"
      :default-sort="{ prop: 'name', order: 'ascending' }"
      :selectable="isUserAllowed('user', 'write')"
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
        sort-prop="name"
      >
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </u-list-column>

      <u-list-column
        column-key="commons.form.last-name"
        column-default-visibility="visible"
        :label="$t('commons.form.last-name')"
        sortable
        sort-prop="surname"
      >
        <template #default="{ row }">
          <span>{{ row.surname }}</span>
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
          {{ $d(new Date(row.created_time), 'middle') }}
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
          {{ $d(new Date(row.updated_time), 'middle') }}
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
  import UContentWrapper from '@/modules/common/layout/UContentWrapper.vue';
  import UList from '@/modules/common/data/UList.vue';
  import UListColumn from '@/modules/common/data/UListColumn.vue';
  import UButton from '@/modules/common/basic/UButton.vue';
  import { useNotification } from '@/composables/notfication';
  import { useUsersStore } from '@/stores/users/user';
  import { usersList } from '../../../../_resources/stories/_data/users-list';
  // import { useAuthorisationsStore } from '@/stores/modules/authorisations/authorisations';
  import i18n from '@/i18n';

  const loading = ref(true);
  const usersStore = useUsersStore();

  const { $errorMsg, $successMsg, $msgbox, $notification } = useNotification();

  const router = useRouter();

  const users = ref([]);

  /* Pour l'exemple, nous utilisons usersStore.getAll comme liste d'utilisateurs
  const users = ref([]);
  usersStore.getAll().then((res: any[]) => {
    users.value = res;
  });

  */

  // On suppose qu'une fonction globale ou store permet de savoir si l'utilisateur courant a la permission
  function isUserAllowed(resource: string, action: string): boolean {
    // Remplacer par votre logique réelle
    return true;
  }

  const filteredUsers = computed(() =>
    users.value.filter((user: any) => {
      const authorisation = user;
      return !!authorisation && authorisation.level > 0;
    })
  );

  // Actions listées dans le header du UList
  const listActions = computed(() => [
    {
      label: i18n.global.t('commons.form.edit'),
      icon: 'icon-edit',
      onClick: (user: any) => editUser(user),
    },
    {
      label: i18n.global.t('commons.form.delete'),
      icon: 'icon-delete',
      multiTarget: true,
      onClick: (users: any[]) => confirmDelete(users),
    },
  ]);

  // Méthode de recherche dans la liste des utilisateurs
  function searchUser(user: any, searchInput: string): boolean {
    const lower = searchInput.toLowerCase();
    return (
      user.name.toLowerCase().includes(lower) ||
      user.surname.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower)
    );
  }

  // Méthodes d'action
  function editUser(user: any) {
    // Redirige vers la page d'édition de l'utilisateur
    // Remplacer par la route et la logique réelles
    router.push({ name: 'user-settings', params: { id: user.id } });
  }

  function newUser() {
    // Redirige vers la page de création d'un nouvel utilisateur
    // Remplacer par la route réelle
    console.log('new user');
    router.push(`/new-user`);
  }

  async function confirmDelete(users) {
    const msgboxNodes = [];
    msgboxNodes.push(
      h(
        'p',
        { class: 'msgbox-text' },
        i18n.global.t('users.delete.modal.deleted', users.length > 1 ? 2 : 1)
      )
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

      const promises = users
        .map
        /*async (user) =>
          await authorisationsStore.deleteAuthorisation({
            userId: user.id,
          })*/
        ();

      await Promise.all(promises);
      $successMsg(i18n.global.t('user.delete.success', promises.length));
    } catch (err) {
      if (!err || (err.toString() !== 'cancel' && err.toString() !== 'close')) {
        $errorMsg(i18n.global.t('user.deleted.error'));
      }
    }
  }
  onMounted(async () => {
    if (
      router.currentRoute.value.params.newUser &&
      router.currentRoute.value.params.newUser === 'success'
    ) {
      $notification.notify({
        title: i18n.global.t('notify.success'),
        message: i18n.global.t('users.created.text'),
        type: 'success',
      });
    }
    users.value = usersList;
    // await usersStore.getAll();
    loading.value = false;
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
