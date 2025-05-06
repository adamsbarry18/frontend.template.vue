<template>
  <div class="icon-box-content">
    <div v-for="category in categories" :key="category">
      <h3>{{ category }}</h3>
      <div class="box-content__wrapper">
        <div v-for="icon in icons[category]" :key="icon" class="box-content__item">
          <icon-base :icon="icon" :rich="true" color="var(--color-neutral-700)" size="50" />
          <div class="box-content__title">
            {{ icon }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import IconBase from '@/modules/ui/icons/IconBase.vue';
  import * as Icons from '@/modules/ui/icons';

  const props = defineProps<{
    prefix?: string;
  }>();

  const icons = ref<{ [category: string]: string[] }>({
    misc: [],
  });

  const iconToCategory = computed(() => {
    const res: Record<string, string> = {};

    res['icon-active'] = 'Statuses';
    res['icon-completed'] = 'Statuses';
    res['icon-success'] = 'Statuses';
    res['icon-paused'] = 'Statuses';
    res['icon-draft'] = 'Statuses';
    res['icon-planned'] = 'Statuses';
    res['icon-running'] = 'Statuses';
    res['icon-error'] = 'Statuses';
    res['icon-stop'] = 'Statuses';
    res['icon-started'] = 'Statuses';
    res['icon-validated'] = 'Statuses';

    res['icon-univers-activate'] = 'Universes';
    res['icon-univers-datahub'] = 'Universes';
    res['icon-univers-studio'] = 'Universes';
    res['icon-univers-inspiration'] = 'Universes';
    res['icon-univers-automation'] = 'Universes';
    res['icon-univers-acquisition'] = 'Universes';
    res['icon-univers-ia'] = 'Universes';
    res['icon-univers-performance'] = 'Universes';
    res['icon-univers-leads'] = 'Universes';

    return res;
  });

  const categories = computed(() => Object.keys(icons.value).reverse());

  const initIcons = () => {
    const iconKeys = Object.keys(Icons)
      .filter((key) => key !== 'IconBase' && (!props.prefix || key.indexOf(props.prefix) === 0))
      .map((el) => el.replace(/\.?([A-Z])/g, (x, y) => `-${y.toLowerCase()}`).replace(/^-/, ''));

    for (const icon of iconKeys) {
      const category = iconToCategory.value[icon];
      if (category) {
        if (!icons.value[category]) {
          icons.value[category] = [];
        }
        icons.value[category].push(icon);
      } else {
        icons.value.misc.push(icon);
      }
    }
  };

  onMounted(() => {
    initIcons();
  });
</script>

<style scoped lang="scss">
  .icon-box-content {
    &__wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, auto));
      grid-auto-rows: minmax(150px, 100px);
      grid-gap: 20px;
      padding: 20px;
    }

    &__item {
      display: inline-grid;
      align-content: center;
      justify-items: center;
      border-radius: 5px;
      padding: 5px;
    }

    &__title {
      margin: 5px 0 10px 0;
      text-align: center;
      font-size: var(--paragraph-03);
    }
  }
</style>
