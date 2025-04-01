<template>
  <u-content-wrapper>
    <div class="not-found-page">
      <div class="instructions">
        <h2>{{ $t('not-found.404.page.title') }}</h2>
        <p>{{ $t('not-found.404.page.content') }}</p>
        <u-button type="primary" @click="redirect">
          {{ $t('not-found.404.page.back') }}
        </u-button>
      </div>
      <img class="picture" src="@/assets/images/svg/404.svg" alt="404" />
    </div>
  </u-content-wrapper>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import UButton from '@/modules/common/basic/UButton.vue';
  import UContentWrapper from '@/modules/common/layout/UContentWrapper.vue';

  const router = useRouter();
  function redirect() {
    router.push({ name: 'dashboard' });
  }
</script>

<style scoped lang="scss">
  .not-found-page {
    display: flex;
    justify-content: flex-start;
    height: 100%;
    .instructions {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      z-index: 2;
      margin-left: 15vw;
      width: 315px;
      h2 {
        font-size: 80px;
      }
      p {
        margin: 16px 0;
        line-height: 1.5;
      }
    }
    .picture {
      position: absolute;
      right: 0;
      bottom: 0;
      max-width: 55vw;
    }
  }
</style>
