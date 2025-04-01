<template>
  <div class="u-breadcrumb">
    <div v-if="currentGroupInfo" class="u-breadcrumb-item-wrapper">
      <div class="u-breadcrumb-item univers-item">
        <icon-base
          :icon="`icon-${currentGroupInfo.icon}`"
          :color="currentGroupInfo.color"
          size="24"
        />
        <span>{{ $t(`groups-nav.${currentGroupInfo.name}.title`) }}</span>
      </div>
    </div>
    <div v-else-if="settingsInfo" class="u-breadcrumb-item-wrapper">
      <div class="u-breadcrumb-item univers-item">
        <icon-base
          :icon="`icon-${settingsInfo.icon}`"
          :color="settingsInfo.color"
          size="24"
        />
        <span>{{ $t(`settings.${settingsInfo.name}.title`) }}</span>
      </div>
    </div>
    <div
      v-for="(link, index) in links"
      :key="link.path + index"
      :title="link.label"
      class="u-breadcrumb-item-wrapper"
    >
      <icon-base icon="icon-arrow" color="var(--color-neutral-400)" size="12" />
      <router-link
        class="u-breadcrumb-item"
        :to="{ path: formatPath(link.path), query: { breadcrumb: 'true' } }"
        :class="{
          '-button-like': index !== links.length - 1,
          '-last': index === links.length - 1 && !editable,
        }"
      >
        <icon-base
          v-if="link.icon"
          :icon="link.icon"
          :title="link.label"
          class="breadcrumb-icon -button-like"
          color="var(--color-neutral-700)"
          size="22"
        />
        <span v-if="!link.icon || link.showIconLabel">{{ link.label }}</span>
      </router-link>
    </div>
    <div v-if="editable" class="u-breadcrumb-item-wrapper -editable">
      <icon-base icon="icon-arrow" color="var(--color-neutral-400)" size="12" />
      <el-input
        :value="value"
        :placeholder="$t(placeholder)"
        class="breadcrumb-input"
        @input="onInput"
      />
      <icon-base
        icon="icon-edit"
        class="breadcrumb-icon-edit"
        color="#000000"
        size="20"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useNavStore } from '@/stores/menu/nav';
  import IconBase from '@/modules/common/icons/IconBase.vue';
  import { ElInput } from 'element-plus';

  // Définition des types pour les props
  interface Link {
    path: string;
    label: string;
    icon?: string;
    showIconLabel?: boolean;
  }

  withDefaults(
    defineProps<{
      links: Link[];
      editable?: boolean;
      placeholder?: string;
      value?: string;
    }>(),
    {
      editable: false,
      placeholder: 'breadcrumb.default-placeholder',
    }
  );

  // Définition des événements émis
  const emit = defineEmits(['input']);

  // Accès au store Pinia
  const navStore = useNavStore();

  // Propriétés calculées basées sur le store
  const currentGroupInfo = computed(() => navStore.currentGroupInfo);
  const currentItem = computed(() => navStore.currentItem);
  const settings = computed(() => navStore.availableSettings);

  // Propriété calculée pour settingsInfo
  const settingsInfo = computed(() => {
    const univers = settings.value
      .map((u) => u.children.map((s) => ({ ...s, universe: u })))
      .flat(2)
      .filter((i) => !!i);
    return univers.find((u) => u.activesStates.includes(currentItem.value))
      ?.universe;
  });

  // Gestion de l'événement input
  const onInput = (value: string) => {
    emit('input', value);
  };

  const formatPath = (path: string) => {
    return null;
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
      margin-top: 4px;
      min-width: 40px;
      overflow: hidden;
      & > svg {
        margin: 0 6px;
      }
      &.-editable {
        .el-input {
          width: 185px;
          .el-input__inner {
            border: none;
            border-bottom: 1px solid var(--color-neutral-300);
            border-radius: 0;
            background-color: var(--color-white);
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
          & > * {
            fill: var(--color-neutral-500);
          }
        }
      }
      .u-breadcrumb-item {
        display: flex;
        align-items: center;
        max-width: 15vw;
        overflow: hidden;
        & > span {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: var(--paragraph-03);
        }
        &:not(.-last) {
          &:hover:not(.univers-item) {
            color: var(--color-neutral-300);
          }
        }
        &.-button-like {
          text-decoration: underline;
          color: var(--color-neutral-800);
        }
        &.-last {
          color: var(--color-neutral-400);
          pointer-events: none;
        }
        &.univers-item {
          color: var(--color-neutral-400);
          pointer-events: none;
          svg {
            margin-right: 4px;
          }
        }
      }
    }
  }
</style>
