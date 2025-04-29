<template>
  <div class="account-administration-card">
    <div class="header">
      <h3>{{ $t('user.settings.administration') }}</h3>
      <u-button type="warning" @click="onDeleteAccount">
        {{ $t('user.settings.delete-account') }}
      </u-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UButton } from '@/modules/common';
  import UserModel from '@/stores/modules/users/models/UserModel';

  defineProps({
    user: {
      type: Object as () => UserModel | null,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits<{ (e: 'delete'): void }>();

  function onDeleteAccount() {
    emit('delete');
  }
</script>

<style lang="scss">
  .account-administration-card {
    padding: 4px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
