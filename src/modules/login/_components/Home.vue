<template>
  <div class="unconnected-home">
    <transition name="slide-fade">
      <u-card v-if="show" class="box-card login-home-card">
        <template #title>
          <div class="header-ucard-slot">
            <div class="logo-wrapper">
              <img class="header-logo" src="@/assets/images/logo_stock_app.png" />
            </div>
          </div>
        </template>
        <div class="content-slot-wrapper">
          <slot />
        </div>
      </u-card>
    </transition>
    <div class="home-logo">
      <img src="@/assets/images/stock_app_hero.jpg" alt="E-commerce" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UCard } from '@/modules/ui';
  import { onMounted, ref } from 'vue';

  const show = ref(false);
  onMounted(() => {
    show.value = true;
  });
</script>

<style scoped lang="scss">
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }

  .unconnected-home {
    display: grid;
    grid-template-columns: 60% 40%;
    align-items: center;
    background: var(--color-background-white);
    width: 100%;
    height: 100%;

    .login-home-card {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: center;
      border: none;
      box-shadow: none;
      background-color: transparent;

      :deep(.card-title-wrapper) {
        background-color: transparent;
        border-bottom: none;
        padding: 0;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .header-ucard-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding-top: 20px;
        .logo-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          .header-logo {
            max-width: 300px;
          }
        }
      }

      :deep(.card-content) {
        padding: 2rem 3rem;
        width: 550px;
        display: flex;
        justify-content: center;
      }
    }

    .home-logo {
      height: 100%;
      overflow: hidden;

      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      @media screen and (max-width: 1080px) {
        display: none;
      }
    }
    @media screen and (max-width: 1080px) {
      grid-template-columns: 1fr;
    }
  }
</style>

<style lang="scss">
  .unconnected-home {
    .el-form-item__content {
      display: flex;
      justify-content: center;
      margin: 0 !important;
    }
  }
</style>
