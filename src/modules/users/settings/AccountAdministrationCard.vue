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
  import { PropType } from 'vue';
  import UButton from '@/modules/common/basic/UButton.vue';

  defineProps({
    user: {
      type: Object as PropType<any>,
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
