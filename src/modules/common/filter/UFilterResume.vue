<template>
  <div class="u-filter-resume">
    <u-tooltip tooltip-class="filter-tooltip-resume">
      <template #content>
        <h3>
          {{ $t('commons.filter.resume-actives') }}
        </h3>
        <ul>
          <li v-for="(filter, index) in Object.keys(activeFilter)" :key="index">
            <div class="content-label">{{ filterConfig[filter].label }} :</div>
            <div class="content-value">
              {{ formatDataType(activeFilter[filter], filter) }}
            </div>
          </li>
        </ul>
        <div class="remove-btn-wrapper -button-like" @click="removeFilters">
          <p>{{ $t('commons.filter.resume-delete') }}</p>
        </div>
      </template>
      <div class="number-wrapper">
        {{ nbrActivesFilters }}
      </div>
    </u-tooltip>
  </div>
</template>
<script setup lang="ts">
  import UTooltip from '@/modules/common/others/UTooltip.vue';

  import { formatToString } from '@/libs/utils/String';
  import { computed } from 'vue';

  const props = defineProps({
    filterConfig: {
      type: Object,
      required: true,
    },
    activeFilter: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['clear-filters']);

  const nbrActivesFilters = computed(() => {
    return Object.keys(props.activeFilter).length;
  });

  const removeFilters = () => {
    emit('clear-filters');
  };

  const formatDataType = (value: any, key: string) => {
    const config = props.filterConfig[key];
    return formatToString(value, config);
  };
</script>

<style lang="scss">
  .u-tooltip.el-tooltip__popper.filter-tooltip-resume {
    cursor: pointer;
    min-width: 400px;
    h3 {
      margin: 0 12px;
      border-bottom: 1px solid var(--color-neutral-300);
      padding-bottom: 4px;
    }

    ul {
      padding-top: 5px;
      li {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
      }
    }

    .content-label {
      margin-right: 4px;
      white-space: nowrap;
      font-weight: 600;

      &::before {
        display: inline-block;
        margin-right: 0.5rem;
        border-radius: 50%;
        background-color: var(--color-neutral-300);
        width: 6px;
        height: 6px;
        content: '';
      }
    }

    .remove-btn-wrapper {
      display: flex;
      flex-direction: row-reverse;
      padding: 0px 12px 6px 12px;
      p {
        cursor: pointer;
        text-decoration: underline;
        font-weight: 500;
      }
    }

    .popper__arrow {
      &::after {
        border-bottom-color: var(--color-white);
      }
    }
  }

  .u-filter-resume {
    position: relative;
    .number-wrapper {
      position: absolute;
      top: -27px;
      right: -22px;
      border: 2px solid var(--color-white);
      border-radius: 50%;
      background-color: var(--color-primary-500);
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 22px;
      color: var(--color-white);
      font-size: var(--paragraph-03);
      font-weight: 600;
    }
  }
</style>
