<template>
  <div class="u-filter">
    <div class="wrapper-actions">
      <u-search-bar
        v-model="searchBuffer"
        icon-position="left"
        icon-color="var(--color-neutral-800)"
        :placeholder="$t('commons.searchbar.default-list')"
        @change="onSearchChanged"
      />
      <span v-if="hasActiveFilter" class="clear-button -button-like" @click="clearAll">
        <icon-base icon="icon-delete" :size="20" color="var(--color-neutral-800)" />
        <p>{{ $t('commons.filter.filter-list.clear') }}</p>
      </span>
    </div>
    <div class="filter-list">
      <div class="list-label">
        <h4>{{ $t('commons.filter.filter-list.title') }}</h4>
        <span>
          ({{
            $t('commons.filter.item-count', {
              count: dataCount,
              plural: dataCount,
            })
          }})
        </span>
      </div>
      <div class="wrapper-filter">
        <u-filter-item
          v-for="key in activeFilterKey"
          :key="key"
          v-model="input[key]"
          :config="config[key]"
          @remove="removeFilter(key)"
          @change="handleChange"
        />
        <!-- Bouton d'ajout de filtre -->
        <u-button
          v-if="canAddFilter"
          ref="buttonRef"
          class="add-filter-button"
          icon="icon-add"
          icon-color="var(--color-neutral-800)"
          :icon-size="16"
          @click="displayAddFilterPopper"
        />
        <!-- Popper d'ajout de filtre intégré -->
        <u-popper v-model:visible="addFilterVisible" placement="bottom-start" :width="225">
          <div class="u-add-filter-popper u-popper">
            <div v-for="key in availableFilterKeys" :key="key" class="filter-button" @click="addFilter(key)">
              {{ config[key].label }}
            </div>
          </div>
        </u-popper>
      </div>
    </div>
    <div class="collapse-button -button-like" @click="collapse">
      <icon-base icon="icon-arrow" :size="14" color="var(--color-neutral-700)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { USearchBar, UButton, UFilterItem, UPopper } from '@/modules/ui';
  import IconBase from '@/modules/ui/icons/IconBase.vue';
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    dataCount: {
      type: Number,
      default: 0,
    },
    search: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits<{
    (e: 'input', value: Record<string, any>): void;
    (e: 'change', value: Record<string, any>): void;
    (e: 'collapse'): void;
    (e: 'update:search', value: string): void;
  }>();

  // Copie réactive de la valeur initiale
  const input = ref({ ...props.modelValue });
  const active = ref(false);
  const searchBuffer = ref(props.search);

  watch(
    () => props.modelValue,
    (newVal) => {
      input.value = { ...newVal };
    }
  );

  watch(
    () => props.search,
    (newVal) => {
      searchBuffer.value = newVal;
    }
  );

  const activeFilterKey = computed(() => Object.keys(input.value || {}));

  const availableFiltersConfig = computed(() => {
    const res: Record<string, any> = {};
    for (const key in props.config) {
      if (!input.value || !(key in input.value)) {
        res[key] = props.config[key];
      }
    }
    return res;
  });

  const availableFilterKeys = computed(() => Object.keys(availableFiltersConfig.value));

  const hasActiveFilter = computed(() => {
    return (input.value && Object.keys(input.value).length > 0) || searchBuffer.value !== '';
  });

  const canAddFilter = computed(() => Object.keys(availableFiltersConfig.value).length > 0);

  function handleChange() {
    emit('input', input.value);
    emit('change', input.value);
  }

  const addFilterVisible = ref(false);
  const buttonRef = ref<InstanceType<typeof UButton>>();

  function displayAddFilterPopper() {
    addFilterVisible.value = true;
    active.value = true;
  }

  function addFilter(key: string) {
    input.value[key] = null;
    handleChange();
    addFilterVisible.value = false;
  }

  function clearAll() {
    for (const key in input.value) {
      removeFilter(key, false);
    }
    searchBuffer.value = '';
    emit('update:search', searchBuffer.value);
    handleChange();
  }

  function removeFilter(key: string, triggerEvent = true) {
    delete input.value[key];
    if (triggerEvent) handleChange();
  }

  function collapse() {
    emit('collapse');
  }

  function onSearchChanged(value: string) {
    emit('update:search', value);
  }
</script>

<style lang="scss">
  .u-filter {
    display: flex;
    position: relative;
    flex-direction: column;
    margin-bottom: 30px;
    border-radius: 4px;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    background-color: var(--color-background-white);
    padding: 0 25px;
    width: 100%;
    .collapse-button {
      display: flex;
      position: absolute;
      right: 50%;
      bottom: -12px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05),
        0px 0px 6px 1px rgba(0, 0, 0, 0.05);
      background: var(--color-white);
      width: 30px;
      height: 30px;
      & > svg {
        transform: rotate(-90deg);
      }
    }
    .wrapper-actions {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .clear-button {
        display: flex;
        align-items: center;
        margin-left: 12px;
        p {
          margin-left: 4px;
          text-decoration: underline;
        }
      }
    }
    .u-search-bar {
      flex-grow: 1;
      .icon.left {
        margin-left: 0;
      }
    }
    .filter-list {
      display: flex;
      align-items: center;
      padding: 24px 0;
      .list-label {
        display: flex;
        align-items: baseline;
        margin-right: 20px;
        h4 {
          padding-right: 8px;
        }
        span {
          font-size: var(--paragraph-03);
        }
      }
      .wrapper-filter {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .u-button:hover {
          filter: none;
        }
      }
      .add-filter-button {
        transition: border-color 0.2s;
        border: 1px solid var(--color-input-border);
        background-color: transparent;
        width: 150px;
        &:hover {
          border-color: var(--color-input-border-hover);
        }
        &:focus {
          outline: 3px solid var(--color-input-outline-focus);
        }
      }
    }
  }

  .u-add-filter-popper {
    display: flex;
    flex-direction: column;
    justify-items: center;
    cursor: pointer;
    .filter-button {
      background-color: transparent;
      border-bottom: 1px solid var(--color-neutral-200);
      padding: 12px 40px;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-03);
      user-select: none;
      &:hover {
        background-color: var(--color-neutral-100);
      }
    }
  }
</style>
