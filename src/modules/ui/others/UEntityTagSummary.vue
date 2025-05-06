<template>
  <div class="u-entity-tag-summary" :class="{ '-empty': tags.length === 0 }">
    <span v-if="tags.length === 0 && !withName" class="no-tag">{{
      $t('commons.entity-tag.none')
    }}</span>
    <div v-else-if="tags.length > 0" class="tag-list">
      <u-tooltip
        v-for="tag in visibleTags"
        :key="tag.id"
        class="tag-item"
        :class="{ '-with-name': withName }"
        tooltip-class="tag-list-tooltip"
      >
        <div>
          <icon-base icon="icon-tag" :size="16" :color="tag.color" />
          <span v-if="withName" class="tag-name -text-ellipsis">{{
            tag.name
          }}</span>
        </div>
        <template #content>
          <div v-if="!withName" class="tag-row">
            <icon-base icon="icon-tag" :size="16" :color="tag.color" />
            <span>{{ tag.name }}</span>
          </div>
        </template>
      </u-tooltip>
      <u-tooltip
        v-if="hiddenTags.length > 0"
        class="more-tag"
        tooltip-class="tag-list-tooltip"
      >
        <div>+{{ hiddenTags.length }}</div>
        <template v-slot:content>
          <div>
            <div v-for="tag in hiddenTags" :key="tag.id" class="tag-row">
              <icon-base icon="icon-tag" :size="16" :color="tag.color" />
              <span> {{ tag.name }}</span>
            </div>
          </div>
        </template>
      </u-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type PropType } from 'vue';
  import { IconBase, UTooltip } from '@/modules/ui';

  interface Tag {
    id?: string | number;
    name?: string;
    color?: string;
  }

  const props = defineProps({
    tags: {
      type: Array as PropType<Tag[]>,
      required: true,
    },
    withName: {
      type: Boolean,
      default: false,
    },
    maxVisible: {
      type: Number,
      default: 1,
    },
  });
  const visibleTags = computed((): Tag[] => {
    return props.tags.slice(0, props.maxVisible);
  });

  const hiddenTags = computed((): Tag[] => {
    return props.tags.slice(props.maxVisible);
  });
</script>

<style lang="scss">
  .u-entity-tag-summary {
    &.-empty {
      text-align: center;
    }

    .no-tag {
      color: var(--color-neutral-500);
    }

    .tag-list {
      display: flex;
      align-items: center;
      gap: 4px;

      .tag-item {
        padding: 0 4px;

        &:not(.-with-name) {
          border-radius: 4px;
          background-color: var(--color-background-light);
          padding: 4px;
        }

        .tag-name {
          max-width: 100px;
          font-size: var(--paragraph-03);
          color: var(--color-neutral-500);
          margin-left: 2px;
        }
      }

      .more-tag {
        font-size: var(--paragraph-03);
        border-radius: 4px;
        background-color: var(--color-background-light);
        padding: 4px;
      }
    }
  }

  .tag-list-tooltip {
    .tag-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
</style>
