<template>
  <table
    v-if="input.length > 0"
    ref="sortableList"
    class="u-sortable-list"
    :class="{ '-disabled': disabled }"
  >
    <tr v-if="$slots.header" class="u-sortable-list-header">
      <slot name="header" />
    </tr>
    <tr v-for="item in input" :key="item.id" class="u-sortable-list-item">
      <td class="u-sortable-list-handle">
        <icon-base icon="icon-draggable" />
      </td>
      <slot :item="item" />
    </tr>
  </table>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import IconBase from '@/modules/ui/icons/IconBase.vue';
  import Sortable from 'sortablejs';

  // Types
  interface Item {
    id: string | number;
    [key: string]: any;
  }

  // Props
  const props = defineProps({
    modelValue: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  // Événements
  const emit = defineEmits<{
    (e: 'input', value: Item[]): void;
    (e: 'change', value: Item[]): void;
  }>();

  // Références et état réactif
  const sortableList = ref<HTMLTableElement | null>(null);
  const input = ref<Item[]>([]);
  const sortableInstance = ref<Sortable | null>(null);

  // Initialisation et synchronisation avec la prop value
  watch(
    () => props.modelValue,
    (newValue) => {
      if (Array.isArray(newValue)) {
        input.value = [...(newValue as Item[])]; // Crée une copie pour éviter les mutations directes
      } else {
        input.value = []; // Réinitialise si newValue n'est pas un tableau
      }
    },
    { immediate: true }
  );

  // Gestion de Sortable.js
  onMounted(() => {
    nextTick(() => {
      if (sortableList.value && !props.disabled) {
        sortableInstance.value = new Sortable(sortableList.value, {
          draggable: '.u-sortable-list-item',
          handle: '.u-sortable-list-handle',
          animation: 150,
          ghostClass: '--ghost',
          onUpdate: onOrderUpdate,
        });
      }
    });
  });

  onUnmounted(() => {
    if (sortableInstance.value) {
      sortableInstance.value.destroy();
    }
  });

  // Méthodes
  function onOrderUpdate(event: Sortable.SortableEvent) {
    if (props.disabled) return;

    const itemToMove = input.value[event.oldDraggableIndex!];
    input.value.splice(event.oldDraggableIndex!, 1);
    input.value.splice(event.newDraggableIndex!, 0, itemToMove);
    emitChanges();
  }

  function emitChanges() {
    emit('input', [...input.value]);
    emit('change', [...input.value]);
  }
</script>

<style lang="scss" scoped>
  .u-sortable-list {
    border-collapse: collapse;

    .u-sortable-list-header {
      background-color: var(--color-neutral-100);
      border-left: 1px solid var(--color-neutral-100);
      border-right: 1px solid var(--color-neutral-100);

      th {
        height: 52px;
        text-align: center;
        text-transform: uppercase;
        font-size: var(--caption);
      }
    }

    .u-sortable-list-item {
      &.--ghost {
        background-color: var(--color-input-border);
      }

      td {
        border: 1px solid var(--color-input-border);
        padding: 6px 20px;
      }

      .u-sortable-list-handle {
        padding: 9px 16px;
        text-align: center;
        width: 64px;

        &:hover {
          cursor: grab;
        }
      }
    }
  }
</style>
