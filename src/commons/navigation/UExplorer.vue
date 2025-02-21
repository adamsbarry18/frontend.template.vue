<template>
  <div v-if="show" ref="popper" class="u-explorer u-popper">
    <div x-arrow />
    <div class="content">
      <div class="header">
        <icon-base
          v-if="currentItem"
          icon="icon-arrow-back"
          :title="
            $t('commons.explorer.backtofolder', {
              item: currentItem.parentLabel,
            })
          "
          class="item-arrow -button-like"
          color="var(--color-white)"
          :size="20"
          @click="onBack"
        />
        <span class="title">
          {{ currentItem ? currentItem.label : $t('commons.explorer.root') }}
        </span>
        <icon-base
          icon="icon-close"
          class="item-arrow -button-like"
          color="var(--color-white)"
          :title="$t('commons.explorer.close')"
          :size="12"
          @click="hide"
        />
      </div>
      <div class="list">
        <div v-if="loading" />
        <template v-else-if="list.length > 0">
          <div
            v-for="item in list"
            :key="item.id"
            class="item"
            :class="{
              '-disabled': item.disabled && selectedItem !== item,
              '-selected': selectedItem && selectedItem.id === item.id,
            }"
            :title="item.label"
            @click="onItemClick(item)"
            @dblclick="onItemBrowse(item)"
          >
            <icon-base
              :icon="item.icon"
              class="item-icon"
              color="var(--color-neutral-700)"
              :size="20"
            />
            <span class="item-label">{{ item.label }}</span>
            <icon-base
              v-if="!item.disabled"
              :title="$t('commons.explorer.gotofolder', { item: item.label })"
              icon="icon-arrow"
              class="item-arrow -button-like"
              color="var(--color-neutral-800)"
              :size="16"
              @click="onItemBrowse(item)"
            />
          </div>
        </template>
        <p v-else class="list-empty">
          {{ $t('commons.explorer.empty') }}
        </p>
      </div>
      <div class="footer">
        <u-button
          class="confirm-button"
          type="primary"
          :disabled="!selectedItem || selectedItem.unselectable"
          @click="onChoose"
        >
          {{ buttonLabel }}
        </u-button>
      </div>
    </div>
    <u-shortcutSubscriber @shortcut-trigger="hide" />
  </div>
</template>

<script setup lang="ts">
  import { ref, PropType } from 'vue';
  import UButton from '@/commons/basic/UButton.vue';
  import IconBase from '@/commons/icones/IconBase.vue';
  import UShortcutSubscriber from '@/commons/others/UShortcutSubscriber.vue';
  import i18n from '@/i18n';

  // Définition de l'interface pour les éléments de l'explorateur
  interface ExplorerItem {
    id: string | number;
    label: string;
    icon: string;
    disabled?: boolean;
    unselectable?: boolean;
    parentLabel?: string;
  }

  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array as PropType<ExplorerItem[]>,
      required: true,
    },
    title: {
      type: String,
      default: 'Title',
    },
    buttonLabel: {
      type: String,
      default: i18n.global.t('commons.form.confirm'),
    },
  });

  // Déclaration des événements émis avec typage
  const emit = defineEmits<{
    (e: 'back'): void;
    (e: 'choose', item: ExplorerItem | null): void;
    (e: 'browse', item: ExplorerItem): void;
    (e: 'hide'): void;
  }>();

  // Variables réactives locales
  const currentItem = ref<ExplorerItem | null>(null);
  const selectedItem = ref<ExplorerItem | null>(null);
  const show = ref<boolean>(true);
  const popper = ref<HTMLElement | null>(null);

  // Méthodes
  function onBack(): void {
    emit('back');
  }

  function onChoose(): void {
    emit('choose', selectedItem.value);
    hide();
  }

  function onItemClick(item: ExplorerItem): void {
    if (!item.disabled) {
      selectedItem.value = item;
    }
  }

  function onItemBrowse(item: ExplorerItem): void {
    if (!item.disabled) {
      emit('browse', item);
    }
  }

  function hide(): void {
    show.value = false;
    emit('hide');
  }
  function showExplorer(
    reference: HTMLElement,
    current: ExplorerItem | null = null
  ): void {
    setCurrentItem(current);
    selectedItem.value = null;
    showPopper(reference);
  }
  function setCurrentItem(current: ExplorerItem | null): void {
    currentItem.value = current;
    selectedItem.value = current && current.disabled ? null : current;
  }
  function showPopper(reference: HTMLElement): void {
    show.value = true;
  }

  defineExpose({
    showExplorer,
  });
</script>

<style lang="scss">
  .u-explorer {
    margin-top: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 10px 1px rgba(47, 50, 76, 0.2);
    width: 310px;
    height: 300px;

    &.u-popper[x-placement^='bottom'] [x-arrow]::after {
      border-bottom-color: var(--color-neutral-800);
    }

    .content {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: stretch;
      width: 100%;
      height: 100%;

      .header {
        display: flex;
        flex-basis: 45px;
        flex-shrink: 0;
        flex-wrap: nowrap;
        align-items: center;
        background-color: var(--color-neutral-800);
        padding: 0 9px;

        .title {
          flex-grow: 1;
          color: var(--color-white);
          font-size: var(--paragraph-03);
          font-weight: 700;
        }
        .-button-like {
          margin: 0 5px;
        }
      }

      .list {
        flex-grow: 1;
        background-color: var(--color-background-white);
        overflow-y: auto;

        .u-loader {
          padding-top: 0;
          padding-bottom: 0;
          text-align: center;
        }

        .list-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-neutral-400);
          font-size: var(--paragraph-03);
        }

        .item {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          cursor: pointer;
          padding: 0 9px;
          height: 36px;

          &:hover {
            background-color: var(--color-neutral-100);
            .item-arrow {
              opacity: 1;
            }
          }

          &.-selected {
            background-color: var(--color-neutral-100);
          }

          &.-disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          .item-icon {
            margin: 0 5px;
            width: 20px;
          }
          .item-label {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: var(--paragraph-03);
          }
          .item-arrow {
            opacity: 0;
            padding: 3px;
            width: 22px;
            height: 22px;
            &:hover {
              border-radius: 3px;
              background: var(--color-neutral-300);
            }
          }
        }
      }

      .footer {
        flex-basis: 54px;
        flex-shrink: 0;
        border-top: 2px solid var(--color-neutral-100);
        background-color: var(--color-background-white);
        padding: 8px 14px;
        text-align: right;
      }
    }
  }
</style>
