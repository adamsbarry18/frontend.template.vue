<template>
  <div
    ref="buttonRef"
    class="u-filter-item"
    :class="{ '-unset': !isSet, '-active': active }"
  >
    <div class="filter-label" @click="displayPopper">
      <b>{{ config.label }} :&nbsp;</b>
      <span>{{ formattedValue }}</span>
    </div>
    <div class="expand-button" @click="displayPopper">
      <icon-base
        icon="icon-arrow"
        :size="14"
        color="var(--color-neutral-700)"
      />
    </div>
    <div class="close-button -button-like" @click.stop="onRemove">
      <icon-base icon="icon-close" :size="9" color="var(--color-neutral-700)" />
    </div>
    <u-filter-item-popper
      ref="popperRef"
      class="u-filter-item-popover"
      :class="config.type ? '-' + config.type : '-unknown'"
      placement="bottom-start"
      @hide="onHidePopper"
    >
      <component
        :is="componentsMap[config.type]"
        v-model="input"
        :config="config"
        @change="handleChange"
      />
    </u-filter-item-popper>
  </div>
</template>
<script setup lang="ts">
  import UFilterItemPopper from './UFilterItemPopper.vue';
  import UFilterItemBool from './types/UfilterItemBool.vue';
  import UFilterItemEnum from './types/UFilterItemEnum.vue';
  import UFilterItemNumberrange from './types/UFilterItemNumberrange.vue';
  import UFilterItemDaterange from '@/commons/filter/types/UFilterItemDatePicker.vue';
  import IconBase from '../icons/IconBase.vue';
  import { ref, computed, watch, onMounted } from 'vue';
  import i18n from '@/i18n';

  const props = defineProps({
    modelValue: {
      type: [Array, Number, String, Object, Boolean, Date, null],
      default: () => [],
    },
    config: {
      type: Object,
    },
  });

  const emit = defineEmits<{
    (e: 'input', value: any): void;
    (e: 'change', value: any): void;
    (e: 'remove'): void;
  }>();

  // Stockage de la valeur (input) et état d'ouverture du popper
  const input = ref(props.modelValue);
  const active = ref(false);

  watch(
    () => props.modelValue,
    (newVal) => {
      input.value = newVal;
    }
  );

  const isSet = computed(() => {
    if (Array.isArray(input.value) && input.value.length === 0) return false;
    return input.value || input.value === false;
  });

  // On mappe le type à son composant correspondant
  const componentsMap: Record<string, any> = {
    bool: UFilterItemBool,
    enum: UFilterItemEnum,
    numberrange: UFilterItemNumberrange,
    daterange: UFilterItemDaterange,
  };

  const formatValue: Record<string, Function> = {
    bool: UFilterItemBool.getFormattedValue,
    enum: UFilterItemEnum.getFormattedValue,
    numberrange: UFilterItemNumberrange.getFormattedValue,
    daterange: UFilterItemDaterange.getFormattedValue,
  };

  const formattedValue = computed(() => {
    if (input.value == null) {
      return i18n.global.t('commons.filter-no-value');
    }
    return formatValue[props.config.type]
      ? formatValue[props.config.type](input.value, props.config)
      : input.value;
  });

  function handleChange() {
    emit('input', input.value);
    emit('change', input.value);
  }

  const popperRef = ref<InstanceType<typeof UFilterItemPopper>>();
  // Référence au bouton servant de déclencheur
  const buttonRef = ref<HTMLElement>();

  function displayPopper() {
    if (!active.value) {
      active.value = true;
      popperRef.value?.showFilterPopper(buttonRef.value);
    }
  }

  function onHidePopper() {
    active.value = false;
  }

  function onRemove() {
    emit('remove');
  }
</script>

<style lang="scss" scoped>
  .u-filter-item {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-input-border);
    border-radius: 4px;
    width: fit-content;
    height: 42px;
    &:hover {
      border-color: var(--color-input-border-hover);
    }
    &.-unset {
      border-color: var(--color-neutral-500);
      .filter-label,
      .expand-button {
        background-color: var(--color-neutral-100);
      }
      .close-button {
        border-color: transparent transparent transparent
          var(--color-neutral-700);
      }
    }
    &.-active {
      outline: 3px solid var(--color-input-outline-focus);
      .close-button {
        border-color: transparent transparent transparent
          var(--color-neutral-700);
      }
    }
    .filter-label {
      display: flex;
      align-items: center;
      border-radius: 3px 0 0 3px;
      background-color: var(--color-white);
      cursor: pointer;
      padding: 8px 12px;
    }
    .expand-button {
      display: flex;
      align-items: center;
      background-color: var(--color-white);
      cursor: pointer;
      padding: 0 8px;
      height: 100%;
      svg {
        transform: rotate(90deg);
      }
    }
    .close-button {
      display: flex;
      align-items: center;
      border-left: 1px solid var(--color-input-border);
      border-radius: 0 4px 4px 0;
      padding: 0 12px;
      height: 100%;
    }
  }
</style>
