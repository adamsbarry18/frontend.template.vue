<template>
  <div
    class="menu-section"
    :class="{
      '-opened': isSectionOpened,
      '-extended': extendedNav,
    }"
  >
    <component
      :is="item?.isRoot ? 'a' : 'div'"
      class="item-entry"
      :class="{
        '-opened': isSectionOpened,
        '-active': isItemActive,
      }"
      :href="item?.isRoot ? generateLink(item) : undefined"
      @click.prevent="
        onItemClick();
        if (item?.isRoot) onMenuClick(item);
      "
    >
      <icon-base :icon="'icon-' + item?.icon" :color="itemColor" :size="24" />
      <transition name="slide-fade-horizontal">
        <span v-if="extendedNav" class="item-text">{{
          $t(`${type}.${item?.name}.title`)
        }}</span>
      </transition>
      <transition name="slide-fade-horizontal">
        <icon-base
          v-if="extendedNav && !item?.isRoot"
          class="arrow-icon"
          :class="{ '-opened': isSectionOpened }"
          icon="icon-arrow"
          color="var(--color-neutral-700)"
          :size="16"
        />
      </transition>
    </component>
    <transition
      name="slide-fade-vertical"
      @before-enter="emit('update:animating', true)"
      @after-enter="emit('update:animating', false)"
      @before-leave="emit('update:animating', true)"
      @after-leave="emit('update:animating', false)"
    >
      <div v-if="isSectionOpened && !item?.isRoot" class="sub-items-wrapper">
        <a
          v-for="sub in item?.subitem"
          :key="sub.name"
          class="sub-item-entry"
          :class="{
            '-active': isSubItemActive(sub),
            '-disabled': sub.disabled,
          }"
          :href="generateLink(sub)"
          @click.prevent="onMenuClick(sub)"
        >
          <icon-base
            :icon="'icon-' + sub.icon"
            :color="getSubItemColor(sub)"
            :size="20"
          />
          <transition name="slide-fade-horizontal">
            <span v-if="extendedNav" class="sub-item-text">
              {{
                sub.disabled
                  ? $t('commons.coming-soon')
                  : $t(`${type}.${item?.name}.${sub.name}.title`)
              }}
            </span>
          </transition>
        </a>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, PropType } from 'vue';
  import IconBase from '@/modules/common/icons/IconBase.vue';
  import { MenuItem } from '@/stores/menu/menu';

  const props = defineProps({
    type: {
      type: String,
      required: true,
      validator: (value: string) =>
        ['globals', 'univers', 'settings'].includes(value),
    },
    extendedNav: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object as () => MenuItem,
      required: true,
    },
    currentSection: {
      type: String,
      default: null,
    },
    currentItem: {
      type: String,
      default: null,
    },
    generateLink: {
      type: Function as PropType<(item: MenuItem) => string>,
      required: true,
    },
    animating: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['section-click', 'menu-click', 'update:animating']);

  const isSectionOpened = ref(false);

  const isItemActive = computed(() => {
    if (props.item?.isRoot) {
      return props.currentItem === props.item.name;
    }
    return props.item?.subitem?.some((subItem) => isSubItemActive(subItem));
  });

  const itemColor = computed(() => {
    return isItemActive.value
      ? 'var(--color-primary-600)'
      : 'var(--color-neutral-800)';
  });

  function getSubItemColor(subItem: MenuItem) {
    if (subItem?.disabled) {
      return 'var(--color-neutral-300)';
    }
    return isSubItemActive(subItem)
      ? 'var(--color-primary-600)'
      : 'var(--color-neutral-800)';
  }

  function isSubItemActive(subItem: MenuItem) {
    return (
      props.item?.name === props.currentSection &&
      subItem?.name === props.currentItem
    );
  }

  function onItemClick() {
    if (!props.item?.isRoot) {
      isSectionOpened.value = !isSectionOpened.value;
    }
    emit('section-click', props.item);
  }

  function openSection() {
    if (!props.item?.isRoot) {
      isSectionOpened.value = true;
    }
  }

  function closeSection() {
    if (!props.item?.isRoot) {
      isSectionOpened.value = false;
    }
  }

  function onMenuClick(item: MenuItem) {
    if (item?.disabled) {
      return;
    }
    emit('menu-click', item);
  }

  defineExpose({ openSection, closeSection });
</script>

<style lang="scss" scoped>
  .menu-section {
    width: 40px;
    margin-left: 12px;

    &.-opened {
      outline: 1px solid var(--color-neutral-300);
      border-radius: 4px;
    }

    &.-extended {
      width: calc(100% - 24px);
    }

    .item-entry {
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      gap: 8px;
      white-space: nowrap;
      transition: 0.1s ease-in-out;

      &:hover {
        background-color: var(--color-neutral-100);
      }

      &.-active {
        background-color: var(--color-primary-50);

        .item-text {
          color: var(--color-primary-600);
          font-weight: 700;
        }
      }

      &.-opened {
        border-end-start-radius: 0;
        border-end-end-radius: 0;

        &:not(.-active) {
          background-color: var(--color-neutral-100);
        }
      }

      .item-text {
        font-size: var(--paragraph-03);
      }

      .arrow-icon {
        margin-left: auto;
        transform: rotate(90deg);
        transition: 0.2s ease-in-out;

        &.-opened {
          transform: rotate(-90deg);
        }
      }
    }

    .sub-items-wrapper {
      background-color: var(--color-neutral-100);
      border-top: 1px solid var(--color-neutral-300);
      border-end-start-radius: 4px;
      border-end-end-radius: 4px;
      padding: 4px 0;

      .sub-item-entry {
        position: relative;
        display: flex;
        align-items: center;
        padding: 6px 8px;
        gap: 12px;
        white-space: nowrap;

        &.-active {
          .sub-item-text {
            font-weight: 700;
            color: var(--color-primary-600);
            height: 20px;
          }

          &::before {
            position: absolute;
            left: 0;
            background-color: var(--color-primary-600);
            width: 4px;
            content: '';
            height: 75%;
          }
        }

        .sub-item-text {
          font-size: var(--paragraph-03);
          height: 20px;
        }
      }
    }
  }
</style>

<style lang="scss">
  .slide-fade-horizontal-enter-active,
  .slide-fade-horizontal-leave-active {
    transition: all 0.2s ease;
  }

  .slide-fade-horizontal-enter,
  .slide-fade-horizontal-leave-to {
    transform: translateX(-15px);
    opacity: 0;
  }

  .slide-fade-vertical-enter-active,
  .slide-fade-vertical-leave-active {
    transition: all 0.3s ease;
    max-height: 500px; // Max possible height, must be over largest possible height
  }

  .slide-fade-vertical-enter,
  .slide-fade-vertical-leave-to {
    transform: translateY(-5px);
    opacity: 0;
    max-height: 0;
  }
</style>
