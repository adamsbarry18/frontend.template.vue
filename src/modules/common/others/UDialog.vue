<template>
  <el-dialog
    ref="elDialog"
    v-model="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="closable"
    :custom-class="customClass"
    :class="{
      '-closable': closable,
      '-has-left-panel': !!$slots['left-panel'],
      '-with-outside-icon': closable && closeIconOutside,
    }"
    class="u-dialog"
    :width="width"
    :height="height"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :modal-append-to-body="true"
    @opened="onOpened"
    @closed="onClose"
    @close="closeDialog"
    @mousedown="onDialogClick"
  >
    <div
      v-if="$slots['left-panel']"
      class="u-dialog-left-panel"
      :style="{
        height: height,
        'max-height': maxHeight,
      }"
    >
      <slot name="left-panel" />
    </div>
    <div
      class="u-dialog-body"
      :style="{
        width: width,
        height: height,
        'max-width': maxWidth,
        'max-height': maxHeight,
      }"
    >
      <icon-base
        v-if="closable && !closeIconOutside"
        icon="icon-cross"
        class="u-dialog-close -button-like"
        size="24"
        color="var(--color-neutral-700)"
        @click.stop="closeDialog"
      />
      <icon-base
        v-if="hasBackButton"
        icon="icon-arrow-back"
        class="u-dialog-back -button-like"
        size="24"
        color="var(--color-neutral-700)"
        :title="$t('commons.form.back')"
        @click.stop="onBack"
      />
      <u-help-button v-if="$slots.help" class="u-dialog-help">
        <slot name="help" />
      </u-help-button>
      <div v-if="$slots.title" class="u-dialog-header">
        <slot name="title" class="u-dialog-title" />
      </div>
      <div class="u-dialog-content">
        <slot />
      </div>
      <div v-if="$slots.footer" class="u-dialog-footer">
        <slot name="footer" />
      </div>
    </div>
    <div
      v-if="closable && closeIconOutside"
      class="u-dialog-close-outside"
      @click="closeDialog"
    >
      <icon-base color="var(--color-neutral-700)" icon="icon-cross" size="24" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch, type PropType } from 'vue';
  import { ElDialog } from 'element-plus';
  import { IconBase, UHelpButton } from '@/modules/common';

  // Define props with type annotations
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    closeIconOutside: {
      type: Boolean,
      default: false,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    hasBackButton: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: '',
    },
    beforeClose: {
      type: Function as PropType<() => void>,
    },
    width: {
      type: String,
      default: '600px',
    },
    height: {
      type: String,
      default: '400px',
    },
    maxHeight: {
      type: String,
    },
    maxWidth: {
      type: String,
    },
  });

  const emit = defineEmits(['update:visible', 'opened', 'close', 'back']);

  const isVisible = ref(props.visible);

  watch(
    () => props.visible,
    (newValue) => {
      isVisible.value = newValue;
    }
  );

  const customClass = computed(() => props.customClass);

  const closeDialog = () => {
    if (props.beforeClose) {
      props.beforeClose();
    } else {
      isVisible.value = false;
      emit('update:visible', false);
    }
  };

  const onOpened = () => {
    emit('opened');
  };

  const onClose = () => {
    if (isVisible.value) {
      emit('close');
    }
  };

  const onBack = () => {
    emit('back');
  };

  const onDialogClick = (event: MouseEvent) => {
    if (props.closable && props.closeOnClickOutside) {
      if (
        event.target instanceof Element &&
        event.target.classList.contains('el-dialog__wrapper')
      ) {
        closeDialog();
      }
    }
  };
</script>
<style lang="scss">
  .u-dialog {
    align-items: center;
    display: flex;
    justify-content: center;
    border-radius: 7px;
    box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.3);
    background-color: var(--color-white);
    text-align: center;
    color: var(--color-white);
    position: relative;

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      display: flex;
      padding: 0;
      width: 100%;
      word-break: normal;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-01);
    }

    .el-dialog__footer {
      display: none;
    }

    .el-dialog__close {
      display: none;
    }

    &.-with-outside-icon {
      padding-top: calc(40px / 2);
    }

    &.-has-left-panel {
      .el-dialog {
        background-color: var(--color-background-light);
      }
    }

    .u-dialog-body {
      display: flex;
      position: relative;
      flex-direction: column;
      flex-grow: 1;

      .u-dialog-header {
        border-radius: 5px 5px 0 0;
        background-color: var(--color-background-light);
        padding: 20px 0;
      }
      .u-dialog-content {
        flex-grow: 1;
        padding: 20px;
        overflow: auto;
      }

      .u-dialog-footer {
        padding: 20px 0;
      }

      .u-dialog-close {
        position: absolute;
        top: 17px;
        right: 16px;
        user-select: none;
        z-index: 100;
      }
      .u-dialog-back {
        position: absolute;
        top: 17px;
        left: 16px;
        user-select: none;
      }
      .u-dialog-help {
        position: absolute;
        top: 11px;
        right: 45px;
        user-select: none;
        text-align: left;
      }
    }

    .u-dialog-left-panel {
      z-index: 3;
      border-radius: 5px 0 0 5px;
      border: 1px solid var(--color-neutral-300);
      background-color: var(--color-background-white);
      padding: 20px;
    }

    .u-dialog-close-outside {
      align-items: center;
      background-color: var(--color-white);
      border-radius: 40px;
      border: 1px solid var(--color-neutral-300);
      cursor: pointer;
      z-index: 4;
      display: flex;
      height: 40px;
      justify-content: center;
      width: 40px;
      position: absolute;
      right: calc(-1 * 40px / 2);
      top: calc(-1 * 40px / 2);
    }
  }
</style>
