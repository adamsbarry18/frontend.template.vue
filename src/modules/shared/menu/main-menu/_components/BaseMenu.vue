<template>
  <div class="base-menu" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
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
        :size="14"
      />
    </div>
    <div
      class="sections-wrapper"
      :class="{
        '-extended': isNavExtended,
        '-animating': areSectionsAnimating,
      }"
    >
      <menu-section
        v-for="item in globals"
        :key="item.name"
        ref="section"
        class="globals-section"
        type="globals"
        :item="item"
        :current-section="currentUniverse"
        :current-item="currentItem"
        :generate-link="generateLink"
        :extended-nav="isNavExtended"
        @section-click="onSectionClick"
        @menu-click="onMenuClick"
      />
      <div class="separator" />
      <menu-section
        v-for="item in mainUniverses"
        :key="item.name"
        ref="section"
        class="main-universe-section"
        type="univers"
        :item="item"
        :current-section="currentUniverse"
        :current-item="currentItem"
        :generate-link="generateLink"
        :extended-nav="isNavExtended"
        :animating="areSectionsAnimating"
        @update:animating="areSectionsAnimating = $event"
        @section-click="onSectionClick"
        @menu-click="onMenuClick"
      />
      <div class="separator" />
      <menu-section
        v-for="item in secondaryUniverses"
        :key="item.name"
        ref="section"
        class="secondary-universe-section"
        type="univers"
        :item="item"
        :current-section="currentUniverse"
        :current-item="currentItem"
        :generate-link="generateLink"
        :extended-nav="isNavExtended"
        :animating="areSectionsAnimating"
        @update:animating="areSectionsAnimating = $event"
        @section-click="onSectionClick"
        @menu-click="onMenuClick"
      />
      <div class="settings-section">
        <menu-section
          v-for="item in settings"
          :key="item.name"
          ref="section"
          type="settings"
          :item="item"
          :current-section="currentUniverse"
          :current-item="currentItem"
          :generate-link="generateLink"
          :extended-nav="isNavExtended"
          :animating="areSectionsAnimating"
          @update:animating="areSectionsAnimating = $event"
          @section-click="onSectionClick"
          @menu-click="onMenuClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, PropType } from 'vue';
  import MenuSection from './MenuSection.vue';

  const props = defineProps({
    config: {
      type: Object,
      required: true,
    },
    currentUniverse: {
      type: String,
      default: null,
    },
    currentItem: {
      type: String,
      default: null,
    },
    generateLink: {
      type: Function as PropType<(item: any) => string>,
      required: true,
    },
  });

  const emit = defineEmits(['menu-click']);

  const isNavExtended = ref(false);
  const areSectionsAnimating = ref(false);
  const section = ref<InstanceType<typeof MenuSection>[]>([]);

  const universes = computed(() => (props.config as any)?.univers || []);
  const mainUniverses = computed(() =>
    universes.value.filter((universe) => universe.isMainFeature)
  );
  const secondaryUniverses = computed(() =>
    universes.value.filter((universe) => !universe.isMainFeature)
  );
  const settings = computed(() => (props.config as any)?.settings || []);
  const globals = computed(() => (props.config as any)?.globals || []);

  function openSection(item) {
    // Open one section and close others
    section.value?.forEach((sect) => {
      if (sect.item?.name === item.name) {
        sect.openSection();
      } else {
        sect.closeSection();
      }
    });
  }

  function onExtendNavClick() {
    isNavExtended.value = !isNavExtended.value;
    console.log('Extend nav clicked');
  }

  function onMouseEnter() {
    isNavExtended.value = true;
  }

  function onMouseLeave() {
    isNavExtended.value = false;
  }

  function onSectionClick(item) {
    // Close other sections when one section is opened
    section.value?.forEach((sect) => {
      if (sect.item?.name !== item.name) {
        sect.closeSection();
      }
    });
  }

  function onMenuClick(item) {
    if (!item?.disabled) {
      emit('menu-click', item);
      console.log('Menu item clicked:', item.name);
      isNavExtended.value = false;
    }
  }

  function onConfigChanged() {
    onCurrentUniverseChange(props.currentUniverse);
  }

  function onCurrentUniverseChange(value: string | null | undefined) {
    if (value === 'global') {
      section.value?.forEach((sect) => sect.closeSection());
    } else if (value) {
      openSection({ name: value });
    }
  }

  watch(
    () => props.config,
    () => onConfigChanged(),
    { deep: true }
  );

  watch(
    () => props.currentUniverse,
    (newValue) => onCurrentUniverseChange(newValue)
  );

  onMounted(() => {
    if (props.currentUniverse) {
      onCurrentUniverseChange(props.currentUniverse);
    }
  });
</script>

<style scoped lang="scss">
  .base-menu {
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
