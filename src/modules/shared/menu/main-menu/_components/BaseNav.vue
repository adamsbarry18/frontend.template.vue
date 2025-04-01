<template>
  <div class="base-nav" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div
      class="extend-arrow"
      :class="{ '-extended': isNavExtended }"
      @click="onExtendNavClick"
    >
      <icon-base
        class="arrow-icon"
        :class="{ '-extended': isNavExtended }"
        icon="icon-arrow"
        color="var(--color-neutral-800)"
        size="14"
      />
    </div>
    <div
      class="sections-wrapper"
      :class="{
        '-extended': isNavExtended,
        '-animating': areSectionsAnimating,
      }"
    >
      <nav-section
        v-for="item in globals"
        :key="item.name"
        class="globals-section"
        navType="globals"
        :item="item"
        :current-section="currentGroup"
        :current-item="currentItem"
        :generate-link="generateLink"
        :extended-nav="isNavExtended"
        @section-click="onSectionClick"
        @nav-click="onMenuClick"
      />
      <div class="separator" />
      <nav-section
        v-for="item in mainGroupsNav"
        :key="item.name"
        class="main-group-section"
        navType="groups-nav"
        :item="item"
        :current-section="currentGroup"
        :current-item="currentItem"
        :generate-link="generateLink"
        :extended-nav="isNavExtended"
        :animating="areSectionsAnimating"
        @update:animating="areSectionsAnimating = $event"
        @section-click="onSectionClick"
        @nav-click="onMenuClick"
      />
      <div class="separator" />
      <nav-section
        v-for="item in secondaryGroups"
        :key="item.name"
        class="secondary-group-section"
        navType="groups-nav"
        :item="item"
        :current-section="currentGroup"
        :current-item="currentItem"
        :generate-link="generateLink"
        :extended-nav="isNavExtended"
        :animating="areSectionsAnimating"
        @update:animating="areSectionsAnimating = $event"
        @section-click="onSectionClick"
        @nav-click="onMenuClick"
      />
      <div class="settings-section">
        <nav-section
          v-for="item in settings"
          :key="item.name"
          navType="settings"
          :item="item"
          :current-section="currentGroup"
          :current-item="currentItem"
          :generate-link="generateLink"
          :extended-nav="isNavExtended"
          :animating="areSectionsAnimating"
          @update:animating="areSectionsAnimating = $event"
          @section-click="onSectionClick"
          @nav-click="onMenuClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, PropType } from 'vue';
  import NavSection from './NavSection.vue';
  import { NavItem } from '@/stores/menu/nav';
  import IconBase from '@/modules/common/icons/IconBase.vue';

  interface Config {
    univers?: any[];
    settings?: any;
    globals?: any[];
  }

  const props = defineProps({
    config: {
      type: Object as () => Config,
      required: true,
    },
    currentGroup: {
      type: String,
      default: null,
    },
    currentItem: {
      type: String,
      default: null,
    },
    generateLink: {
      type: Function as PropType<(item: NavItem) => string>,
      required: true,
    },
  });

  const emit = defineEmits(['nav-click']);

  const isNavExtended = ref(false);
  const areSectionsAnimating = ref(false);
  const sections = ref<InstanceType<typeof NavSection>[]>([]);

  const universes = computed(() => props.config.univers || []);
  const mainGroupsNav = computed(() =>
    universes.value.filter((group) => group.isPrimary)
  );
  const secondaryGroups = computed(() =>
    universes.value.filter((group) => !group.isPrimary)
  );
  const settings = computed(() => props.config.settings || []);
  const globals = computed(() => props.config.globals || []);

  function openSection(item: any) {
    sections.value.forEach((sect) => {
      if (sect.item?.name === item.name) {
        sect.openSection();
      } else {
        sect.closeSection();
      }
    });
  }

  function onExtendNavClick() {
    isNavExtended.value = !isNavExtended.value;
  }

  function onMouseEnter() {
    isNavExtended.value = true;
  }

  function onMouseLeave() {
    isNavExtended.value = false;
  }

  function onSectionClick(item: any) {
    sections.value.forEach((sect) => {
      if (sect.item?.name !== item.name) {
        sect.closeSection();
      }
    });
    openSection(item);
  }

  function onMenuClick(item: any) {
    if (!item?.disabled) {
      emit('nav-click', item);
      isNavExtended.value = false;
    }
  }

  watch(
    () => props.config,
    () => onCurrentGroupChange(props.currentGroup),
    { deep: true }
  );

  watch(
    () => props.currentGroup,
    (newValue) => onCurrentGroupChange(newValue)
  );

  function onCurrentGroupChange(value: string | null | undefined) {
    if (value === 'global') {
      sections.value.forEach((sect) => sect.closeSection());
    } else if (value) {
      openSection({ name: value });
    }
  }

  onMounted(() => {
    if (props.currentGroup) {
      onCurrentGroupChange(props.currentGroup);
    }
  });
</script>

<style scoped lang="scss">
  .base-nav {
    --extended-nav-width: 290px;
    --transition-duration: 0.2s;
    position: relative;
    height: 100%;
    width: 100%;

    .extend-arrow {
      --extend-arrow-width: 22px;
      top: 22px;
      right: calc(var(--extend-arrow-width) * -1);
      position: absolute;
      z-index: 999;
      display: flex;
      align-items: center;
      height: 44px;
      width: var(--extend-arrow-width);
      background-color: var(--color-white);
      border-top-right-radius: var(--extend-arrow-width);
      border-bottom-right-radius: var(--extend-arrow-width);
      box-shadow: var(--box-shadow-xl);
      transition: right ease var(--transition-duration);
      cursor: pointer;

      &.-extended {
        right: calc(
          (
              var(--extended-nav-width) - var(--base-nav-width) +
                var(--extend-arrow-width)
            ) *
            -1
        );
      }

      .arrow-icon {
        margin-left: 2px;

        &.-extended {
          transform: rotate(180deg);
        }
      }
    }

    .sections-wrapper {
      position: absolute;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      width: 100%;
      top: 0;
      bottom: 0;
      padding: 24px 0;
      gap: 4px;
      border-right: 1px solid var(--color-neutral-300);
      background-color: var(--color-white);
      transition: width ease var(--transition-duration);

      &.-extended {
        width: var(--extended-nav-width);
        box-shadow: var(--box-shadow-xl);
      }

      &.-animating {
        overflow-y: hidden;
      }

      .separator {
        margin: 0 12px;
        border-top: 1px solid var(--color-neutral-300);
      }

      .settings-section {
        margin-top: auto;
      }
    }
  }
</style>
