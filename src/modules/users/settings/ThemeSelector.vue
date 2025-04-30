<template>
  <div class="theme-selector">
    <label class="el-form-item__label">{{
      $t('user.settings.preferences.theme')
    }}</label>
    <u-radio
      :model-value="modelValue"
      :options="themeOptions"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { URadio } from '@/modules/common';
  import i18n from '@/i18n';

  defineProps({
    modelValue: {
      type: String,
      default: 'system',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const themeOptions = computed(() => [
    {
      value: 'light',
      label: i18n.global.t('user.settings.preferences.themes.light'),
    },
    {
      value: 'dark',
      label: i18n.global.t('user.settings.preferences.themes.dark'),
    },
    {
      value: 'system',
      label: i18n.global.t('user.settings.preferences.themes.system'),
    },
  ]);
</script>

<style lang="scss">
  .theme-selector {
    margin-bottom: 15px;

    .el-form-item__label {
      color: var(--color-text-secondary);
      font-size: var(--paragraph-02);
      line-height: 20px;
      margin-bottom: 4px;
      display: block;
    }

    .u-radio {
      margin-top: 0;
    }
  }
</style>
