<template>
  <div
    class="nav-section"
    :class="{ '-opened': isSectionOpened, '-extended': extendedNav }"
  >
    <component
      :is="item?.isRoot ? 'a' : 'div'"
      class="item-entry"
      :class="{ '-opened': isSectionOpened, '-active': isItemActive }"
      :href="item?.isRoot ? generateLink(item) : undefined"
      @click.prevent="handleClick"
    >
      <icon-base :icon="`icon-${item?.icon}`" :color="itemColor" size="24" />
      <transition name="slide-fade-horizontal">
        <span v-if="extendedNav" class="item-text">
          {{ t(`${navType}.${item?.name}.title`) }}
        </span>
      </transition>
      <transition name="slide-fade-horizontal">
        <icon-base
          v-if="extendedNav && !item?.isRoot"
          class="arrow-icon"
          :class="{ '-opened': isSectionOpened }"
          icon="icon-arrow"
          color="var(--color-neutral-700)"
          size="16"
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
          v-for="child in item?.children"
          :key="child.name"
          class="sub-item-entry"
          :class="{
            '-active': isSubItemActive(child),
            '-disabled': child.disabled,
          }"
          :href="generateLink(child)"
          @click.prevent="onChildClick(child)"
        >
          <icon-base
            :icon="`icon-${child.icon}`"
            :color="getSubItemColor(child)"
            size="20"
          />
          <transition name="slide-fade-horizontal">
            <span v-if="extendedNav" class="sub-item-text">
              {{
                child.disabled
                  ? t('commons.coming-soon')
                  : t(`${navType}.${item?.name}.${child.name}.title`)
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
  import { useI18n } from 'vue-i18n';
  import IconBase from '@/modules/common/icons/IconBase.vue';
  import type { NavItem } from '@/stores/menu/nav';

  const props = defineProps({
    navType: {
      type: String,
      required: true,
      validator: (value: string) =>
        ['globals', 'groups-nav', 'settings'].includes(value),
    },
    extendedNav: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object as () => NavItem,
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
      type: Function as PropType<(item: NavItem) => string>,
      required: true,
    },
    animating: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['section-click', 'nav-click', 'update:animating']);
  const { t } = useI18n();

  const isSectionOpened = ref(false);

  const isItemActive = computed(() => {
    if (props.item?.isRoot) {
      return props.currentItem === props.item.name;
    }
    return props.item?.children?.some((child) => isSubItemActive(child));
  });

  const itemColor = computed(() =>
    isItemActive.value ? 'var(--color-primary-600)' : 'var(--color-neutral-800)'
  );

  function isSubItemActive(child: NavItem): boolean {
    return (
      props.item?.name === props.currentSection &&
      child?.name === props.currentItem
    );
  }

  function getSubItemColor(child: NavItem): string {
    if (child?.disabled) return 'var(--color-neutral-300)';
    return isSubItemActive(child)
      ? 'var(--color-primary-600)'
      : 'var(--color-neutral-800)';
  }

  function handleClick() {
    if (props.item?.isRoot) {
      emit('nav-click', props.item);
    } else {
      isSectionOpened.value = !isSectionOpened.value;
      emit('section-click', props.item);
    }
  }

  function onChildClick(child: NavItem) {
    if (child.disabled) return;
    emit('nav-click', child);
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
  defineExpose({ openSection, closeSection });
</script>

<style lang="scss" scoped>
  .nav-section {
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
