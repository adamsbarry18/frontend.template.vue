<template>
  <div class="unconnected-home">
    <transition name="slide-fade">
      <el-card v-if="show" class="box-card">
        <template v-slot:header>
          <div class="header">
            <div class="logo-wrapper">
              <img
                class="header-logo"
                src="@/assets/images/logo_mabarry_title.jpg"
              />
            </div>
          </div>
        </template>
        <div>
          <slot />
        </div>
      </el-card>
    </transition>
    <div class="home-logo">
      <img src="@/assets/images/logo_mabarry.jpg" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElCard } from 'element-plus';
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

    .box-card {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: center;
      border: none;
      box-shadow: none;

      .el-card__header {
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          .logo-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .header-logo {
            max-width: 300px;
          }
        }
      }

      .el-card__body {
        padding: 2rem 3rem;
        width: 550px;

        .el-form-item__label {
          width: 50%;
        }
      }
    }

    .header {
      justify-content: center;

      .title {
        padding-left: 0;
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
