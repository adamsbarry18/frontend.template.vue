<template>
  <div class="u-confirm-list">
    <u-help-button v-if="$slots.help">
      <slot name="help" />
    </u-help-button>
    <template v-if="errorList.length > 0">
      <p class="list-title">
        {{ errorListTitle }}
      </p>
      <ul>
        <li v-for="item in errorList" :key="item.label">
          <icon-base v-if="icon" :size="24" :icon="icon" color="var(--color-neutral-500)" />
          <span class="item-label">{{ item.label }}</span>
          <u-info v-if="item.reason">
            <span> {{ item.reason }}</span>
          </u-info>
        </li>
      </ul>
      <p class="error-list-info">
        {{ $t('commons.confirm.error-list.info') }}
      </p>
    </template>
    <template v-if="list.length > 0">
      <p class="list-title">
        {{ listTitle }}
      </p>
      <ul>
        <li v-for="item in list" :key="item">
          <icon-base v-if="icon" :size="24" :icon="icon" color="var(--color-neutral-500)" />
          <span class="item-label">{{ item }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
  import i18n from '@/i18n';
  import { computed, PropType } from 'vue';
  import { UInfo, UHelpButton } from '@/modules/ui';
  import IconBase from '@/modules/ui/icons/IconBase.vue';

  const props = defineProps({
    list: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    listTitle: {
      type: String,
      default: () => i18n.global.t('commons.confirm.list.title'),
    },
    icon: {
      type: String,
    },
    errorList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    errorListTitle: {
      type: String,
      default: () => i18n.global.t('commons.confirm.error-list.title'),
    },
  });

  const defaultOptions = computed(() => ({
    title: i18n.global.t('commons.confirm.delete'),
    showCancelButton: true,
    confirmButtonText:
      props.list.length === 0 ? i18n.global.t('commons.form.ok') : i18n.global.t('commons.form.delete'),
    confirmButtonClass: props.list.length === 0 ? '' : '-warning',
    cancelButtonText: i18n.global.t('commons.form.cancel'),
  }));

  defineExpose({
    defaultOptions,
  });
</script>

<style lang="scss" scoped>
  .u-confirm-list {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    & > .u-help-button {
      position: absolute;
      top: -48px;
      right: -24px;
    }
    .list-title {
      margin: 12px 0;
      font-weight: bold;
    }
    .error-list-info {
      color: var(--color-neutral-500);
    }
    ul {
      margin: 12px 0;
      border-radius: 4px;
      background-color: var(--color-background-light);
      padding: 0;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      li {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        width: 100%;
        list-style: none;
        &:not(:last-child) {
          border-bottom: 1px solid var(--color-neutral-300);
        }
        & .item-label {
          flex-grow: 1;
          margin-left: 8px;
          text-align: left;
        }
      }
    }
  }
</style>
