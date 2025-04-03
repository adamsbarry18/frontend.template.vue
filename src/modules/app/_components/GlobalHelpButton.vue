<template>
  <div
    class="global-help-button"
    :class="{ '-big': isBig, '-offset': hasOffset }"
    @click="showContextualMenu"
  >
    <span>?</span>
    <u-contextual-menu ref="contextualMenu" :list="contextualMenuItems" />
  </div>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import UContextualMenu from '@/modules/common/navigation/UContextualMenu.vue';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useRouter } from 'vue-router';

  const emits = defineEmits(['open-contextual']);
  const router = useRouter();
  const usersStore = useUsersStore();
  const contextualMenu = ref<InstanceType<typeof UContextualMenu> | null>(null);

  const isConnected = computed(() => usersStore.isConnected);
  const isLoggingOut = computed(() => usersStore.isLoggingOut);

  const hasOffset = computed(() => {
    return [
      'activate.create-campaigns',
      'activate.campaigns-action',
      'activate.campaigns-wizard',
    ].includes(router.currentRoute.value.name as string);
  });

  const isBig = computed(() => {
    return ['dashboard'].includes(router.currentRoute.value.name as string);
  });

  const contextualMenuItems = computed(() => [
    {
      label: 'new',
      icon: 'icon-add',
      onClick: () => {
        console.log('new');
      },
    },
    {
      label: 'documentation',
      icon: 'icon-info',
      onClick: () => {
        console.log('documentation');
      },
    },
  ]);

  const showContextualMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    contextualMenu.value?.showMenu({ x: rect.left - 5, y: rect.top + 30 });
    emits('open-contextual');
  };
</script>

<style lang="scss">
  .global-help-button {
    display: flex;
    position: absolute;
    right: 12px;
    bottom: 12px;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 50%;
    background: var(--color-blue-500);
    cursor: pointer;
    width: 28px;
    height: 28px;

    & > span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: var(--color-white);
      font-size: var(--subheading);
      font-weight: bold;
    }

    & > .a-pulser {
      --color-pulser: var(--color-green-500);
      position: absolute;
      top: 0;
      right: 0;
    }

    .a-contextual-menu {
      .cm-ul {
        box-shadow:
          var(--box-shadow-xl),
          0px -2px 10px 1px rgba(43, 77, 111, 0.1);

        li {
          max-width: none;
        }

        .cm-left {
          margin: 4px 12px;
          padding: 0 12px;
        }
      }

      .cm-ul-1 {
        padding: 8px 0;
      }

      .item-wrapper {
        &:hover {
          border-radius: 4px;
          background-color: var(--color-neutral-100);
        }
      }
    }

    &.-big {
      right: 32px;
      transition: 0.1s ease-in-out;
      width: 40px;
      height: 40px;
      color: var(--color-white);

      & > span {
        font-size: var(--subheading);
      }
    }

    &.-offset {
      right: 8px;
      bottom: 8px;
    }
  }

  #launcher {
    bottom: -300px !important;
  }
</style>
