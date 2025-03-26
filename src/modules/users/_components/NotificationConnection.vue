<template>
  <div class="notification-connection">
    <strong>Titre</strong>
    <p>Description</p>
    <u-button type="primary" @click="clickHandler"> Button </u-button>
  </div>
</template>

<script setup lang="ts">
  import UButton from '@/modules/common/basic/UButton.vue';

  defineProps({
    notificationId: {
      type: String,
    },
  });
  const clickHandler = () => {
    console.log('click');
  };
</script>

<style lang="scss" scoped>
  .notification-connection {
    display: flex;
    flex-direction: column;
    width: 100%;

    strong,
    p {
      margin-bottom: 12px;
    }
  }
</style>
