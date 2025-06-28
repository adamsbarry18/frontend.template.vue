<template>
  <div class="u-breadcrumb">
    <div
      v-for="(link, index) in links"
      :key="link.path + '-' + link.label + '-' + index"
      :title="link.label"
      class="u-breadcrumb-item-wrapper"
    >
      <icon-base v-if="index > 0" icon="icon-arrow" color="var(--color-neutral-400)" size="12" />

      <router-link
        v-if="link.path && !(index === links.length - 1 && !editable)"
        class="u-breadcrumb-item -button-like"
        :to="{ path: link.path }"
      >
        <icon-base
          v-if="link.icon"
          :icon="link.icon"
          :title="link.label"
          class="breadcrumb-icon"
          color="var(--color-neutral-700)"
          size="22"
        />
        <span v-if="!link.icon || link.showIconLabel">{{ link.label }}</span>
      </router-link>

      <div v-else class="u-breadcrumb-item" :class="{ '-last': index === links.length - 1 && !editable }">
        <icon-base
          v-if="link.icon"
          :icon="link.icon"
          :title="link.label"
          class="breadcrumb-icon"
          color="var(--color-neutral-700)"
          size="22"
        />
        <span v-if="!link.icon || link.showIconLabel">{{ link.label }}</span>
      </div>
    </div>

    <div v-if="editable && links.length > 0" class="u-breadcrumb-item-wrapper -editable">
      <icon-base icon="icon-arrow" color="var(--color-neutral-400)" size="12" />
      <el-input
        :model-value="value"
        :placeholder="$t(placeholder)"
        class="breadcrumb-input"
        @update:model-value="onInput"
      />
      <icon-base icon="icon-edit" class="breadcrumb-icon-edit" color="var(--color-neutral-500)" size="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import IconBase from '@/modules/ui/icons/IconBase.vue';
  import { ElInput } from 'element-plus';
  import { useBreadcrumbStore } from '@/stores/modules/breadcrumb';

  interface Link {
    path?: string;
    label: string;
    icon?: string;
    showIconLabel?: boolean;
  }

  // Props are implicitly used by withDefaults and the template
  withDefaults(
    defineProps<{
      links: Link[];
      editable?: boolean;
      placeholder?: string;
      value?: string | null;
    }>(),
    {
      editable: false,
      placeholder: 'breadcrumb.default-placeholder',
      value: null,
    }
  );

  const breadcrumbStore = useBreadcrumbStore();

  // onInput is used in the template by @update:model-value
  const onInput = (newValue: string) => {
    breadcrumbStore.setBreadcrumbValue(newValue);
  };
</script>

<style lang="scss">
  .u-breadcrumb {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    min-width: 0;

    .u-breadcrumb-item-wrapper {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      min-width: 0;

      & > .icon-base {
        margin: 0 6px;
        flex-shrink: 0;
      }

      &.-editable {
        min-width: auto;
        overflow: visible;

        .el-input {
          width: 185px;
          margin-left: 6px;

          .el-input__wrapper {
            box-shadow: none !important;
            background-color: transparent;
            padding: 0;
            border-bottom: 1px solid var(--color-neutral-300);
            border-radius: 0;
          }
          .el-input__inner {
            border: none;
            background-color: transparent;
            padding: 0;
            height: 20px;
            line-height: 20px;
            color: var(--color-neutral-700);
            font-size: var(--paragraph-03);
            &::placeholder {
              color: var(--color-neutral-400);
            }
          }
        }
        .breadcrumb-icon-edit {
          margin-left: 4px;
          flex-shrink: 0;
          & > * {
            fill: var(--color-neutral-500);
          }
        }
      }

      .u-breadcrumb-item {
        display: flex;
        align-items: center;
        max-width: 25vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: var(--paragraph-03);

        .breadcrumb-icon {
          margin-right: 4px;
          flex-shrink: 0;
        }

        & > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &.-button-like {
          text-decoration: none;
          color: var(--color-neutral-800);
          cursor: pointer;
          &:hover {
            text-decoration: underline;
            color: var(--color-primary-base);
          }
        }

        &.-last {
          color: var(--color-neutral-700);
          pointer-events: none;
          font-weight: 500;
        }
      }
    }
  }
</style>
