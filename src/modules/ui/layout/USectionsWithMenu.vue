<template>
  <div class="u-sections-with-menu">
    <div class="scroller-menu-wrapper" @wheel="onMenuScroll">
      <div class="scroller-menu">
        <div
          v-for="item in menuItems"
          :key="item"
          class="scroller-menu-item -button-like"
          :class="{ '-active': isItemActive(item) }"
          @click="scrollTo(item)"
        >
          <span class="item-label">
            {{ item }}
          </span>
        </div>
      </div>
      <div class="menu-illustration">
        <slot name="menu-illustration" />
      </div>
    </div>
    <div ref="sectionsDiv" class="sections" @scroll="onScroll">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  /* global NodeJS */
  import { ref, reactive, computed, onMounted, onUnmounted, useSlots } from 'vue';

  // Références et états réactifs
  const sectionsDiv = ref<HTMLElement | null>(null);
  const sectionComponents = ref<any[]>([]);
  const intersectionRatio = reactive<Record<string, number>>({});
  const clickedSection = ref<string | null>(null);
  const scrollHandlerDisabled = ref(false);
  const scrollDisablerTimeout = ref<NodeJS.Timeout | null>(null);

  // Gestion des slots
  const slots = useSlots();

  // Propriétés calculées
  const menuItems = computed(() => sectionComponents.value.map((section) => getMenuTitle(section)));

  // Fonctions utilitaires
  function fetchSections() {
    if (!slots.default) {
      return [];
    }

    return slots
      .default()
      .filter((vnode) => !!vnode.type && !!(vnode.props as any)?.menuTitle)
      .map((vnode) => vnode.component)
      .filter((component) => !!component); // Filtrer les composants valides
  }

  function getMenuTitle(component: any): string {
    return component?.props?.menuTitle || '';
  }

  function isItemActive(item: string): boolean {
    if (clickedSection.value === item) {
      return true;
    }
    if (clickedSection.value !== null) {
      return false;
    }

    if (intersectionRatio[item] === 0) {
      return false;
    }

    const itemIndex = menuItems.value.indexOf(item);
    const previousItem = itemIndex > 0 ? menuItems.value[itemIndex - 1] : null;
    const nextItem = itemIndex + 1 < menuItems.value.length ? menuItems.value[itemIndex + 1] : null;

    if (intersectionRatio[item] === 1 && (nextItem === null || intersectionRatio[nextItem] < 1)) {
      return true;
    }

    if (previousItem && intersectionRatio[previousItem] === 1) {
      return false;
    }

    return nextItem === null || intersectionRatio[nextItem] === 0;
  }

  function scrollTo(item: string) {
    const section = sectionComponents.value.find((s) => getMenuTitle(s) === item);
    if (section) {
      section.$el.scrollIntoView({ behavior: 'smooth' });
      clickedSection.value = getMenuTitle(section);
      scrollHandlerDisabled.value = true;
      if (scrollDisablerTimeout.value) {
        clearTimeout(scrollDisablerTimeout.value);
      }
      scrollDisablerTimeout.value = setTimeout(() => {
        scrollHandlerDisabled.value = false;
      }, 1000);
    }
  }

  function onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop === 0) {
      clickedSection.value =
        sectionComponents.value.length > 0 ? getMenuTitle(sectionComponents.value[0]) : null;
    } else if (!scrollHandlerDisabled.value) {
      clickedSection.value = null;
    }
  }

  function onMenuScroll(event: WheelEvent) {
    const value = event.deltaY > 0 ? Math.max(event.deltaY, 50) : Math.min(event.deltaY, -50);
    if (sectionsDiv.value) {
      sectionsDiv.value.scrollTop += value * 2;
    }
  }

  // Gestion du cycle de vie
  onMounted(() => {
    sectionComponents.value = fetchSections();

    sectionComponents.value.forEach((section, index) => {
      intersectionRatio[getMenuTitle(section)] = index === 0 ? 1 : 0;
      const handler = (value: number) => {
        intersectionRatio[getMenuTitle(section)] = value;
      };
      section.$on('intersection-ratio', handler);

      // Stocker les écouteurs pour nettoyage futur
      eventListeners.push({ section, handler });
    });

    clickedSection.value =
      sectionComponents.value.length > 0 ? getMenuTitle(sectionComponents.value[0]) : null;
  });

  // Nettoyage des écouteurs
  const eventListeners: { section: any; handler: (value: number) => void }[] = [];

  onUnmounted(() => {
    eventListeners.forEach(({ section, handler }) => {
      section.$off('intersection-ratio', handler);
    });
    if (scrollDisablerTimeout.value) {
      clearTimeout(scrollDisablerTimeout.value);
    }
  });
</script>

<style lang="scss" scoped>
  .u-sections-with-menu {
    display: flex;
    width: 100%;
    overflow: hidden;

    .scroller-menu-wrapper {
      flex-grow: 1;
      margin-right: 20px;
      min-width: 290px;
      text-align: right;

      .scroller-menu {
        display: inline-block;
        border-radius: 4px;
        box-shadow: 0 0 5px 0 rgba(205, 210, 223, 0.5);
        background-color: var(--color-white);
        overflow: hidden;

        .scroller-menu-item {
          display: flex;
          align-items: center;
          border-top: 1px solid var(--color-input-border);
          padding-left: 20px;
          height: 48px;
          color: var(--color-neutral-800);
          filter: none;

          &:first-child {
            border-top: transparent;
          }

          &.-active {
            border-left: 8px solid var(--color-primary-500);
            padding: 12px;
            font-weight: 700;
          }
        }
      }

      .menu-illustration {
        margin-top: 32px;
      }
    }

    .sections {
      flex-grow: 1;
      padding: 20px 0 140px 0;
      height: 100%;
      overflow-y: auto;
      scroll-behavior: smooth;
    }
  }
</style>
