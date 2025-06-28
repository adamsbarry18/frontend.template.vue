<template>
  <header :class="['u-navbar', `-${type}`]">
    <el-container v-if="type === 'top'" class="container">
      <div v-if="!logo?.hidden" class="logo-container">
        <slot name="logo">
          <icon-base v-if="logo?.icon" :icon="logo.icon" :size="30" color="var(--el-color-primary)" />
          <span v-if="logo?.text" class="logo-text">{{ logo.text }}</span>
        </slot>
      </div>

      <nav class="desktop-nav">
        <el-menu mode="horizontal" :ellipsis="false" @select="handleNavSelect">
          <template v-for="item in leftItems" :key="item.id">
            <template v-if="!item.hidden">
              <el-menu-item v-if="item.type === 'link'" :index="item.id">
                <icon-base v-if="item.icon" :icon="item.icon" class="menu-icon" />
                <span>{{ item.label }}</span>
              </el-menu-item>
              <el-sub-menu v-else-if="item.type === 'submenu'" :index="item.id">
                <template #title>
                  <icon-base v-if="item.icon" :icon="item.icon" class="menu-icon" />
                  <span>{{ item.label }}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.id" :index="child.id">
                  <icon-base v-if="child.icon" :icon="child.icon" class="menu-icon" />
                  <span>{{ child.label }}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </template>
        </el-menu>
      </nav>

      <div class="actions-container">
        <template v-for="item in rightItems" :key="item.id">
          <template v-if="!item.hidden">
            <u-button
              type="primary"
              v-if="item.type === 'button'"
              :class="['action-item', `action-${item.id}`]"
              @click="handleActionClick(item.action)"
            >
              <icon-base v-if="item.icon" :icon="item.icon" class="action-icon" />
              <span v-if="item.label" class="action-label">{{ item.label }}</span>
            </u-button>
            <u-search-bar
              v-else-if="item.type === 'search'"
              v-bind="item.props"
              :overflow-side-show="item.props?.overflowSideShow"
              @search="handleActionClick(item.action, $event)"
              @update:model-value="handleActionClick(item.action + '-update', $event)"
              class="top-nav-search-bar"
            />
            <u-badge
              v-else-if="item.type === 'badge'"
              :icon="item.icon"
              :count="item.count"
              v-bind="item.props"
              @click="handleActionClick(item.action)"
              class="action-item"
            >
              <span v-if="item.label">{{ item.label }}</span>
            </u-badge>
          </template>
        </template>
        <el-button class="mobile-menu-btn" text :icon="Menu" @click="drawer = true" />
      </div>
    </el-container>

    <!-- Mobile Drawer for TopBar -->
    <el-drawer
      v-if="type === 'top'"
      v-model="drawer"
      title="Menu"
      direction="ttb"
      size="auto"
      class="mobile-drawer"
    >
      <el-menu @select="handleNavSelect">
        <template v-for="item in items" :key="item.id">
          <template v-if="!item.hidden">
            <el-menu-item v-if="item.type === 'link'" :index="item.id">
              <icon-base v-if="item.icon" :icon="item.icon" class="menu-icon" />
              <span>{{ item.label }}</span>
            </el-menu-item>
            <el-sub-menu v-else-if="item.type === 'submenu'" :index="item.id">
              <template #title>
                <icon-base v-if="item.icon" :icon="item.icon" class="menu-icon" />
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.id" :index="child.id">
                <icon-base v-if="child.icon" :icon="child.icon" class="menu-icon" />
                <span>{{ child.label }}</span>
              </el-menu-item>
            </el-sub-menu>
            <template v-else-if="item.type !== 'divider'">
              <!-- Render other types as menu items in mobile drawer -->
              <el-menu-item :index="item.id" @click="handleActionClick(item.action)">
                <icon-base v-if="item.icon" :icon="item.icon" class="menu-icon" />
                <span>{{ item.label }}</span>
              </el-menu-item>
            </template>
          </template>
        </template>
      </el-menu>
    </el-drawer>

    <!-- SideBar Content -->
    <div v-else-if="type === 'side'" class="sidebar-content">
      <div v-if="!logo?.hidden" class="logo-container">
        <slot name="logo">
          <icon-base v-if="logo?.icon" :icon="logo.icon" :size="30" color="var(--el-color-primary)" />
          <span v-if="logo?.text" class="logo-text">{{ logo.text }}</span>
        </slot>
      </div>
      <el-menu @select="handleNavSelect">
        <template v-for="item in items" :key="item.id">
          <template v-if="!item.hidden">
            <el-menu-item v-if="item.type === 'link'" :index="item.id">
              <icon-base v-if="item.icon" :icon="item.icon" class="menu-icon" />
              <span>{{ item.label }}</span>
            </el-menu-item>
            <el-sub-menu v-else-if="item.type === 'submenu'" :index="item.id">
              <template #title>
                <icon-base v-if="item.icon" :icon="item.icon" class="menu-icon" />
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.id" :index="child.id">
                <icon-base v-if="child.icon" :icon="child.icon" class="menu-icon" />
                <span>{{ child.label }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </template>
      </el-menu>
      <div class="sidebar-actions">
        <template v-for="item in sidebarActionItems" :key="item.id">
          <template v-if="!item.hidden">
            <u-button
              v-if="item.type === 'button'"
              v-bind="item.props"
              @click="handleActionClick(item.action)"
            >
              <icon-base v-if="item.icon" :icon="item.icon" />
              <span v-if="item.label">{{ item.label }}</span>
            </u-button>
            <u-search-bar
              v-else-if="item.type === 'search'"
              v-bind="item.props"
              @search="handleActionClick(item.action, $event)"
            />
            <el-badge
              v-else-if="item.type === 'badge'"
              :value="item.count"
              class="item-badge"
              :hidden="item.count === 0"
            >
              <u-button v-bind="item.props" @click="handleActionClick(item.action)">
                <icon-base v-if="item.icon" :icon="item.icon" />
                <span v-if="item.label">{{ item.label }}</span>
              </u-button>
            </el-badge>
          </template>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Menu } from '@element-plus/icons-vue';
  import { ElContainer, ElMenu, ElMenuItem, ElSubMenu, ElButton, ElBadge, ElDrawer } from 'element-plus';
  import { USearchBar, UButton, UBadge } from '@/modules/ui';
  import IconBase from '../icons/IconBase.vue';
  import { NavBarProps, NavItem } from './navbar.types';

  const props = withDefaults(defineProps<NavBarProps>(), {
    items: () => [],
    type: 'top',
    logo: () => ({ hidden: false }),
  });

  const emit = defineEmits(['nav-select', 'action-click']); // Generic emit for navigation and actions

  const drawer = ref(false);

  const leftItems = computed(() =>
    props.items.filter(
      (item) => (item.align === 'left' || !item.align) && (item.type === 'link' || item.type === 'submenu')
    )
  );
  const rightItems = computed(() =>
    props.items.filter((item) => item.align === 'right' && item.type !== 'divider')
  );
  const sidebarActionItems = computed(() =>
    props.items.filter((item) => item.type !== 'link' && item.type !== 'submenu' && item.type !== 'divider')
  );

  const handleNavSelect = (index: string) => {
    const selectedItem = findItemById(props.items, index);
    if (selectedItem) {
      emit('nav-select', selectedItem.value ?? selectedItem.id);
    }

    if (props.type === 'top') {
      drawer.value = false;
    }
  };

  const handleActionClick = (action?: string, value?: any) => {
    if (action) {
      emit('action-click', action, value);
    }
  };

  // Helper function to find an item by id in a nested structure
  function findItemById(items: NavItem[], id: string): NavItem | undefined {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }
</script>

<style lang="scss" scoped>
  .u-navbar {
    &.-top {
      background-color: var(--color-background-white);
      box-shadow: var(--box-shadow-s);
      padding: 0 20px;
      width: 100%;
      position: sticky;
      top: 0;
      z-index: 1020;

      .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .logo-container {
        display: flex;
        align-items: center;
        @media (max-width: 767px) {
          display: none;
        }

        :deep(a) {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }

        :deep(img) {
          height: 40px;
          margin-right: 10px;
        }

        :deep(span) {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--el-text-color-primary);
        }
      }

      .desktop-nav {
        display: none;
        @media (min-width: 768px) {
          display: flex;
          .el-menu--horizontal {
            border-bottom: none;
            & > .el-menu-item,
            & > .el-sub-menu {
              color: var(--el-text-color-regular);
              &:hover,
              &:focus,
              &.is-active {
                color: var(--color-primary-500);
                border-bottom-color: var(--color-primary-500);
              }
            }
          }
        }
      }

      .actions-container {
        display: flex;
        align-items: center;
        gap: 16px;

        .action-item {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s ease-in-out;

          .action-icon {
            margin-right: 4px;
            width: 20px;
            height: 20px;
          }

          .action-label {
            font-size: var(--el-font-size-base);
          }
        }

        .item-badge {
          margin-right: 8px;
        }

        .mobile-menu-btn {
          display: inline-flex;
          @media (min-width: 768px) {
            display: none;
          }
        }
      }

      .mobile-drawer {
        .el-menu-item,
        .el-sub-menu__title {
          justify-content: center;
          .menu-icon {
            margin-right: 8px;
          }
        }
      }
    }

    &.-side {
      background-color: var(--color-white);
      box-shadow: var(--box-shadow-s);
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: auto;

      .logo-container {
        margin-bottom: 20px;
        .logo-text {
          font-size: 1.2rem;
          font-weight: bold;
          margin-left: 8px;
          color: var(--color-text-primary);
        }
      }

      .el-menu {
        border-right: none;
        width: 100%;

        .el-menu-item,
        .el-sub-menu__title {
          .menu-icon {
            margin-right: 8px;
          }
        }
      }

      .sidebar-actions {
        margin-top: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        align-items: center;

        .action-item {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: var(--el-text-color-regular);
          transition: color 0.2s ease-in-out;
          padding: 4px 8px;
          border-radius: 4px;

          &:hover {
            color: var(--color-primary-500);
            background-color: var(--color-neutral-100);
          }

          &:hover {
            color: var(--color-primary-500);
          }

          .action-icon {
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }

          .action-label {
            font-size: var(--el-font-size-base);
          }
        }
      }
    }

    .menu-icon {
      max-width: 20px;
      max-height: 20px;
    }
  }
</style>
