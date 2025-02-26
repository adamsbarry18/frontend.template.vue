<template>
  <div class="u-tag-list-filter" :class="{ '-column': direction === 'column' }">
    <template v-for="(tag, index) in options">
      <div
        v-if="isSelected(tag)"
        :key="'selected-' + index"
        class="u-tag-list-item -selected"
        @click="onTagFilterUnselect(tag)"
      >
        <u-tag
          :icon="tag.icon"
          :background-color="tag.backgroundColor || backgroundColor"
          :color="tag.color || color"
        >
          <span>{{ tag.label }}</span>
          <div class="u-tag-list-unselect">
            <icon-base
              icon="icon-close"
              :size="9"
              color="var(--color-neutral-800)"
            />
          </div>
        </u-tag>
      </div>

      <div
        v-else
        :key="'unselected-' + index"
        class="u-tag-list-item"
        @click="onTagFilterSelect(tag)"
      >
        <icon-base :icon="tag.icon || 'icon-tag'" :size="24" />
        <span>{{ tag.label }}</span>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import IconBase from '../icons/IconBase.vue';
  import UTag from '@/commons/others/UTag.vue';

  const props = defineProps({
    options: {
      type: Array as () => any[],
      required: true,
    },
    modelValue: {
      type: Array as () => any[],
      required: true,
    },
    color: {
      type: String,
      default: 'var(--color-neutral-800)',
    },
    backgroundColor: {
      type: String,
      default: 'var(--color-neutral-100)',
    },
    direction: {
      type: String,
      default: 'column',
    },
  });

  const emit = defineEmits(['select', 'unselect', 'input', 'change']);

  const input = ref<any[]>([]);

  onMounted(() => {
    input.value = props.modelValue ? [...props.modelValue] : [];
  });

  watch(
    () => props.modelValue,
    (newVal) => {
      input.value = newVal ? [...newVal] : [];
    }
  );

  function isSelected(tag: any) {
    if (!tag) return false;
    return input.value.findIndex((t) => t === tag.value) > -1;
  }

  function onTagFilterSelect(tag: any) {
    if (!tag) return;
    if (input.value.includes(tag.value)) return;
    input.value.push(tag.value);
    emit('select', tag);
    handleChange();
  }

  function onTagFilterUnselect(tag: any) {
    if (!tag) return;
    const index = input.value.findIndex((t) => t === tag.value);
    if (index > -1) {
      input.value.splice(index, 1);
    }
    emit('unselect', tag);
    handleChange();
  }

  function handleChange() {
    emit('input', input.value);
    emit('change', input.value);
  }
</script>

<style lang="scss">
  .u-tag-list-filter {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &.-column {
      flex-direction: column;
      align-items: flex-start;
    }

    .u-tag-list-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      min-height: 35px;
      text-align: left;

      &:not(.-selected) {
        padding: 4px 8px;
      }

      & > .u-icon {
        margin-right: 4px;
      }

      .u-tag-list-unselect {
        padding-left: 16px;
      }
    }
  }
</style>
