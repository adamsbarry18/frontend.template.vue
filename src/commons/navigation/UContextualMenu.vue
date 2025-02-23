<template>
  <div v-if="show" ref="menu" class="u-contextual-menu" :style="axisComputed">
    <u-shortcut-subscriber
      v-if="show"
      :shortcut="props.shortcut"
      @shortcut-trigger="onShortcutEscape"
    />
    <!-- First level -->
    <ul class="cm-ul cm-ul-1">
      <li v-if="$slots.title" class="cmenu-title">
        <slot name="title" />
      </li>
      <li
        v-for="(item, index) in props.list"
        :key="item.label"
        :style="liStyle"
      >
        <div
          class="item-wrapper"
          :class="firstLeft ? 'cm-left' : ''"
          @click.stop="callback(item, $event)"
        >
          <u-pulser v-if="item.hasPulser" />
          <icon-base
            v-if="item.icon"
            class="item-icon"
            :icon="item.icon"
            size="24"
            color="var(--color-neutral-700)"
          />
          <span>{{ item.label }}</span>
          <div
            v-if="item.children && item.children.length > 0"
            class="arrow-icon-item-wrapper"
            aria-hidden="true"
          >
            <icon-base
              icon="icon-arrow"
              size="14"
              color="var(--color-neutral-700)"
            />
          </div>
        </div>
        <!-- Second level -->
        <ul
          v-if="item.children && item.children.length > 0"
          class="cm-ul cm-ul-2"
          :style="secondBorderCheck(index)"
        >
          <li
            v-for="child in item.children"
            :key="child.label"
            :style="liStyle"
          >
            <div
              class="item-wrapper"
              :class="secondLeft ? 'cm-left' : ''"
              @click.stop="callback(child, $event)"
            >
              <icon-base v-if="child.icon" :icon="child.icon" />
              <span>{{ child.label }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    defineProps,
    defineEmits,
    defineExpose,
    PropType,
  } from 'vue';
  import UShortcutSubscriber from '@/commons/others/UShortcutSubscriber.vue';
  import UPulser from '@/commons/others/UPulser.vue';
  import IconBase from '@/commons/icones/IconBase.vue';

  interface MenuItem {
    label: string;
    icon?: string;
    hasPulser?: boolean;
    children?: MenuItem[];
    onClick?: (event: MouseEvent) => void;
  }

  const props = defineProps({
    list: { type: Array as PropType<MenuItem[]>, required: true },
    itemWidth: { type: Number, default: 160 },
    itemHeight: { type: Number, default: 32 },
    itemSize: { type: Number, default: 14 },
    offset: {
      type: Object as PropType<{ x: number; y: number }>,
      default: () => ({ x: 6, y: 2 }),
    },
    borderWidth: { type: Number, default: 6 },
    shortcut: { type: String, default: 'esc' },
  });

  const emit = defineEmits(['close']);

  const show = ref(false);
  const axis = ref({ x: 0, y: 0 });
  const globalClickHandler = ref<((e: Event) => void) | null>(null);
  const elMenu = ref<HTMLElement | null>(null);

  const axisComputed = computed(() => {
    const res: Record<string, string> = {};
    const bodyWidth = document.body.offsetWidth;
    const bodyHeight = document.body.offsetHeight;
    const margin = 32;

    if (axis.value.x + props.offset.x + props.itemWidth + margin >= bodyWidth) {
      res.right = `${Math.max(0, bodyWidth - (axis.value.x - props.offset.x))}px`;
    } else {
      res.left = `${Math.max(0, axis.value.x + props.offset.x)}px`;
    }

    if (
      axis.value.y +
        props.offset.y +
        props.itemHeight * props.list.length +
        margin >=
      bodyHeight
    ) {
      res.bottom = `${Math.max(0, bodyHeight - (axis.value.y - props.offset.y))}px`;
    } else {
      res.top = `${Math.max(0, axis.value.y + props.offset.y)}px`;
    }
    return res;
  });

  const liStyle = computed(() => ({
    height: `${props.itemHeight}px`,
    lineHeight: `${props.itemHeight}px`,
    fontSize: `${props.itemSize}px`,
  }));

  const firstLeft = computed(() => {
    const bodyWidth = document.body.offsetWidth;
    return axis.value.x + props.itemWidth * 2 >= bodyWidth;
  });

  const secondLeft = computed(() => {
    const bodyWidth = document.body.offsetWidth;
    return axis.value.x + props.itemWidth * 3 >= bodyWidth;
  });

  function onShortcutEscape() {
    close();
  }

  function showMenu(newAxis: { x: number; y: number }) {
    show.value = true;
    axis.value = newAxis;
  }

  function secondBorderCheck(i: number) {
    const bodyWidth = document.body.offsetWidth;
    const bodyHeight = document.body.offsetHeight;
    const childCount = props.list[i].children
      ? props.list[i].children!.length
      : 0;
    const cy = axis.value.y + (i + childCount) * props.itemHeight;
    return {
      left: axis.value.x + props.itemWidth * 2 >= bodyWidth ? '-100%' : '100%',
      top: bodyHeight >= cy ? '0' : `${-(childCount - 1) * props.itemHeight}px`,
    };
  }

  function callback(item: MenuItem, event: MouseEvent) {
    if (item.onClick) {
      item.onClick(event);
    }
    close();
  }

  function close() {
    show.value = false;
    emit('close');
  }

  onMounted(() => {
    globalClickHandler.value = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.u-contextual-menu')) {
        close();
      }
    };
    document.addEventListener('mousedown', globalClickHandler.value, true);
  });

  onBeforeUnmount(() => {
    if (globalClickHandler.value) {
      document.removeEventListener('mousedown', globalClickHandler.value, true);
    }
  });

  // Expose public methods for utilisation externe
  defineExpose({ showMenu, close, onShortcutEscape });
</script>

<style lang="scss">
  .u-contextual-menu {
    position: fixed;
    user-select: none;
    z-index: 9999;
  }
  .u-contextual-menu .cm-ul {
    margin: 0;
    list-style: none;
    border-radius: 5px;
    box-shadow:
      0 0 1px var(--color-neutral-500),
      0px 1px 11px 1px rgba(0, 0, 0, 0.13);
    background-color: var(--color-background-white);
    padding: 0;
    width: 100%;
    li {
      position: relative;
      cursor: pointer;
      min-width: 180px;
      max-width: 380px;
      box-sizing: border-box;
      &:hover > ul {
        display: block;
      }
      i {
        display: inline-block;
        width: 1em;
        text-align: center;
        font-size: 1.3em;
      }
    }
  }
  .u-contextual-menu .cm-ul-1 {
    padding: 6px 0;
    > .cmenu-title {
      margin: 0 20px;
      margin-top: 12px;
      border-bottom: 1px solid var(--color-neutral-300);
      padding-bottom: 12px;
    }
  }
  .u-contextual-menu .cm-ul-2 {
    display: none;
    position: absolute;
    top: 0;
    z-index: 10000;
  }
  .u-contextual-menu .item-wrapper {
    box-sizing: border-box;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: flex-start;
    padding: 0 5px 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background-color: var(--color-neutral-100);
    }
    > .u-pulser {
      --color-pulser: var(--color-green-500);
      position: absolute;
      top: 6px;
      right: 12px;
    }
    > .a-switch {
      margin-left: 24px;
    }
    .item-icon {
      margin-right: 6px;
    }
    svg {
      flex-shrink: 0;
    }
    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .arrow-icon-item-wrapper {
      margin-left: auto;
      padding-left: 5px;
    }
  }
</style>
