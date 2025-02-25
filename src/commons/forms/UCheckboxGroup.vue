<template>
  <div class="u-checkbox-group" :class="{ '-column': direction === 'column' }">
    <div
      v-for="option in options"
      :key="option.value"
      class="option-button"
      :class="{
        '-selected': input.includes(option.value),
        '-menu-open': option === contextualMenuOption,
      }"
      @click="toggleValue(option.value)"
    >
      <div class="option-checkbox" />
      <icon-base
        v-if="option.icon"
        class="option-icon"
        :size="24"
        :icon="option.icon"
        :color="option.color || 'var(--color-neutral-800)'"
        :rich="true"
      />
      <span class="option-label -text-ellipsis" :title="option.label">
        {{ option.label }}
      </span>
      <div
        v-if="option.contextualMenu"
        class="contextual-menu"
        @click.stop="openContextualMenu(option)"
      >
        <icon-base
          icon="icon-contextual-menu"
          :size="24"
          color="var(--color-neutral-800)"
        />
      </div>
    </div>
    <u-contextualMenu
      ref="contextualMenu"
      :list="contextualMenuOptions"
      @close="onContextualMenuClosed"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { PropType } from 'vue';
  import UContextualMenu from '@/commons/navigation/UContextualMenu.vue';
  import IconBase from '@/commons/icons/IconBase.vue';

  interface MenuItem {
    label: string;
    icon?: string;
    contextualMenu?: MenuItem[];
    hasPulser?: boolean;
    onClick?: (event: MouseEvent) => void;
  }

  // Props du composant
  const props = defineProps({
    modelValue: { type: Array as PropType<any[]> },
    options: { type: Array as PropType<any[]>, required: true },
    direction: { type: String, default: 'row' },
  });

  // Émission d'événements
  const emit = defineEmits<{
    (e: 'input', value: any[]): void;
    (e: 'change', value: any[]): void;
  }>();

  const input = ref([...props.modelValue]);
  const contextualMenuOption = ref(null);

  watch(
    () => props.modelValue,
    (newVal) => {
      input.value = [...newVal];
    }
  );

  const contextualMenuOptions = computed(() =>
    contextualMenuOption.value && contextualMenuOption.value.contextualMenu
      ? contextualMenuOption.value.contextualMenu
      : []
  );

  function toggleValue(val: any) {
    if (input.value.includes(val)) {
      input.value = input.value.filter((v) => v !== val);
    } else {
      input.value.push(val);
    }
    handleChange();
  }

  function handleChange() {
    emit('input', [...input.value]);
    emit('change', [...input.value]);
  }

  const contextualMenu = ref<InstanceType<typeof UContextualMenu>>();
  function openContextualMenu(option: any) {
    contextualMenuOption.value = option;
    if (
      contextualMenu.value &&
      typeof contextualMenu.value.showMenu === 'function'
    ) {
      contextualMenu.value.showMenu({ x: 100, y: 90 });
    }
  }

  // Ferme le menu contextuel
  function onContextualMenuClosed() {
    contextualMenuOption.value = null;
  }
</script>

<style lang="scss" scoped>
  .u-checkbox-group {
    display: flex;
    flex-direction: row;
    &.-column {
      flex-direction: column;
    }
    .option-button {
      display: flex;
      position: relative;
      align-items: center;
      background-color: transparent;
      cursor: pointer;
      padding: 12px 12px;
      &:hover {
        .contextual-menu {
          & > .u-icon {
            display: block;
          }
        }
      }
      &.-selected {
        .option-checkbox {
          position: relative;
          border-color: var(--color-primary-500);
          background-color: var(--color-primary-500);
          border-radius: 2px;
          &::after {
            box-sizing: content-box;
            position: absolute;
            top: 1px;
            left: 4px;
            transform: rotate(45deg);
            border-right: solid 1px var(--color-white);
            border-bottom: solid 1px var(--color-white);
            width: 3px;
            height: 7px;
            content: '';
          }
        }
      }
      &.-menu-open {
        background-color: var(--color-neutral-100);
      }
      .option-checkbox {
        flex-shrink: 0;
        margin-right: 8px;
        border: 1px solid var(--color-neutral-400);
        border-radius: 2px;
        width: 14px;
        height: 14px;
        &:hover {
          border-color: var(--color-primary-500);
        }
        &:focus {
          outline: 3px solid var(--color-primary-100);
          border-color: var(--color-primary-500);
        }
      }
      .option-icon {
        flex-shrink: 0;
        margin-right: 5px;
      }
      .option-label {
        flex-grow: 1;
      }
      .contextual-menu {
        flex-grow: 0;
        & > .u-icon {
          display: none;
        }
      }
    }
  }
</style>
