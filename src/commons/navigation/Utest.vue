<template>
  <div class="u-tabs">
    <div class="u-tabs-header" :class="mode">
      <slot name="header" />
      <div ref="tabs" class="u-tabs-header-list" :class="mode">
        <span v-if="hasInitialSpacing && mode === 'classic'" class="space" />
        <u-tab-title
          v-for="tab in tabs"
          v-show="tabVisibilityFunction(tab.index)"
          :key="tab.index"
          :mode="mode"
          :style="getTabStyle(tab)"
          :class="[
            `${index}` === `${tab.index}` ? '-active' : '-inactive',
            tab.class,
            tab.disabled ? '-disabled' : '',
            tab.error ? '-error' : '',
          ]"
          :datu-nav="dataNav ? `${dataNav}.${tab.index}` : null"
          @click.native="handleTabSelect(tab)"
        >
          <icon-base
            v-if="tab.icon"
            class="tab-icon"
            size="24"
            :icon="tab.icon"
            :color="
              mode !== 'classic' && `${index}` === `${tab.index}`
                ? 'var(--color-primary-600)'
                : 'var(--color-neutral-500)'
            "
          />
          <span>{{ tab.label }}</span>
          <slot name="tab-action" :tab-index="tab.index" />
        </u-tab-title>
        <div
          v-if="
            $slots['header-actions'] && (mode === 'classic' || mode === 'new')
          "
          class="header-actions"
        >
          <slot name="header-actions" />
        </div>
      </div>
    </div>
    <div class="u-tabs-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    watch,
    computed,
    onMounted,
    reactive,
    useSlots,
    onUpdated,
  } from 'vue';
  import type { PropType, Ref } from 'vue';
  import UTabTitle from '@/commons/navigation/UTabTitle.vue';
  import IconBase from '@/commons/icones/IconBase.vue';

  type TabMode = 'classic' | 'new' | 'compagny';
  type TabIndex = string | number;

  interface Tab {
    index: TabIndex;
    label: string;
    color?: string;
    class?: string;
    icon?: string;
    error?: boolean;
    disabled?: boolean;
  }

  const props = defineProps({
    activeIndex: {
      type: [String, Number],
      default: null,
    },
    hasInitialSpacing: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String as PropType<TabMode>,
      default: 'classic',
      validator: (value: string) =>
        ['classic', 'new', 'compagny'].includes(value),
    },
    tabVisibilityFunction: {
      type: Function,
      default: () => true,
    },
    dataNav: {
      type: String,
      default: null,
    },
  });
  const index = ref(props.activeIndex);
  const tabs = reactive([] as Tab[]);
  const emit = defineEmits(['change', 'update:activeIndex']);
  const slots = useSlots();

  // Watch handlers
  watch(
    () => props.activeIndex,
    (value) => {
      index.value = value;
      displayActiveTab();
    }
  );

  watch(index, (value) => {
    emit('change', value);
    emit('update:activeIndex', value);
  });

  // Methods
  const handleTabSelect = (tab: Tab) => {
    if (!tab.disabled) {
      index.value = tab.index;
      displayActiveTab();
    }
  };

  const getChildren = () => {
    const defaultSlot = slots[0] || [];
    return defaultSlot
      .filter(
        (child) => child.el && typeof child.el.getAttribute === 'function'
      )
      .map((child) => child.el);
  };

  const isTabDirty = (newTabs: Tab[]) => {
    if (newTabs.length !== tabs.length) {
      return true;
    }

    return newTabs.some((tab, i) =>
      Object.keys(tab).some(
        (key) => tab[key as keyof Tab] !== tabs[i][key as keyof Tab]
      )
    );
  };

  const refreshTabs = () => {
    const newTabs: Tab[] = [];
    for (const child of getChildren()) {
      const tab: Tab = {
        index: child.getAttribute('index'),
        label: child.getAttribute('label'),
        color: child.getAttribute('color'),
        class: child.getAttribute('tab-class-name'),
        icon: child.getAttribute('icon'),
        error: child.getAttribute('error') === 'true',
        disabled: child.getAttribute('disabled') === 'true',
      };
      newTabs.push(tab);
    }

    if (isTabDirty(newTabs)) {
      tabs.splice(0, tabs.length, ...newTabs);
    }

    displayActiveTab();
  };

  const displayActiveTab = () => {
    for (const child of getChildren()) {
      const tabIndex = child.getAttribute('index');
      if (tabIndex !== null && `${tabIndex}` === `${index.value}`) {
        child.classList.add('-active');
        child.classList.remove('-inactive');
      } else {
        child.classList.add('-inactive');
        child.classList.remove('-active');
      }
    }
  };

  const getTabStyle = (tab: Tab) => {
    return tab.color ? { backgroundColor: tab.color } : {};
  };

  // Lifecycle hooks
  onMounted(() => {
    refreshTabs();
  });

  onUpdated(() => {
    refreshTabs();
  });
</script>

<style lang="scss">
  .u-tabs {
    border: none;

    .u-tabs-header {
      background: var(--color-background-white);
      width: 100%;

      &.compagny {
        border-radius: 4px;
        border: 1px solid var(--color-neutral-300);
      }

      .u-tabs-header-list {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
        width: 100%;

        &.classic,
        &.new {
          .space {
            background: var(--color-background-white);
            display: block;
            height: auto;
            width: 30px;
          }

          .header-actions {
            align-items: center;
            display: flex;
            flex-grow: 1;
            justify-content: space-between;
          }
        }

        &.new,
        &.compagny {
          border-bottom: 1px solid var(--color-input-border);
        }

        &.compagny {
          padding: 0 20px;
          border-bottom: 0;
        }
      }
    }

    .u-tabs-content {
      flex: 1;
      padding-top: 20px;
      overflow-y: auto;
      overflow-x: hidden;

      .-inactive {
        display: none;
      }
    }
  }
</style>
