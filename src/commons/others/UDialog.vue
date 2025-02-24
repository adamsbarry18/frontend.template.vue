<template>
  <el-dialog
    v-model="internalVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="closable"
    :class="[
      'u-dialog',
      customClass,
      {
        '-closable': closable,
        '-has-left-panel': !!$slots['left-panel'],
        '-with-outside-icon': closable && closeIconOutside,
      },
    ]"
    :width="width"
    :height="height"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :append-to-body="true"
    :modal-append-to-body="true"
    @opened="emit('opened')"
    @closed="emit('close')"
    @close="handleClose"
    @click="handleClickOutside"
  >
    <div v-if="$slots['left-panel']" class="u-dialog-left-panel">
      <slot name="left-panel" />
    </div>
    <div v-if="$slots.title" class="u-dialog-header">
      <slot name="title" class="u-dialog-title" />
    </div>
    <div class="u-dialog-body">
      <icon-base
        v-if="closable && !closeIconOutside"
        icon="icon-cross"
        class="u-dialog-close -button-like"
        size="24"
        color="var(--color-neutral-700)"
        @click="handleClose"
      />
      <icon-base
        v-if="hasBackButton"
        icon="icon-arrow-back"
        class="u-dialog-back -button-like"
        size="24"
        color="var(--color-neutral-700)"
        :title="$t('commons.form.back')"
        @click="emit('back')"
      />
      <u-help-button v-if="$slots.help" class="u-dialog-help">
        <slot name="help" />
      </u-help-button>

      <div class="u-dialog-content">
        <slot />
      </div>

      <div v-if="$slots.footer" class="u-dialog-footer">
        <slot name="footer" />
      </div>
      <u-shortcut-subscriber
        v-if="internalVisible"
        :shortcut="shortcut"
        @shortcut-trigger="handleShortcutEscape"
      />
    </div>

    <template #close>
      <div
        v-if="closable && closeIconOutside"
        class="u-dialog-close-outside"
        @click="handleClose"
      >
        <icon-base
          color="var(--color-neutral-700)"
          icon="icon-cross"
          size="24"
        />
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch, type PropType } from 'vue';
  import { ElDialog } from 'element-plus';
  import IconBase from '@/commons/icons/IconBase.vue';
  import UShortcutSubscriber from '@/commons/others/UShortcutSubscriber.vue';
  import UHelpButton from '@/commons/others/UHelpButton.vue';

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
      type: Function as PropType<(() => void) | undefined>,
      default: undefined,
    },
    shortcut: {
      type: String,
      default: 'esc',
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

  const internalVisible = ref(props.visible);

  watch(
    () => props.visible,
    (newValue) => {
      internalVisible.value = newValue;
    }
  );

  const handleClose = () => {
    if (props.beforeClose) {
      props.beforeClose();
    } else {
      internalVisible.value = false;
      emit('update:visible', false);
    }
  };

  const handleShortcutEscape = () => {
    if (props.closable) {
      handleClose();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (props.closable && props.closeOnClickOutside) {
      if (
        event.target instanceof Element &&
        event.target.classList.contains('el-overlay')
      ) {
        handleClose();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .u-dialog {
    --outside-close-icon-size: 40px;

    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: row;

    &.-with-outside-icon {
      padding-top: calc(var(--outside-close-icon-size) / 2);
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
      .el-dialog__header {
        padding: 0px;
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
        cursor: pointer;
      }
      .u-dialog-back {
        position: absolute;
        top: 17px;
        left: 16px;
        user-select: none;
        cursor: pointer;
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
      border-radius: var(--outside-close-icon-size);
      border: 1px solid var(--color-neutral-300);
      cursor: pointer;
      z-index: 4;
      display: flex;
      height: var(--outside-close-icon-size);
      justify-content: center;
      width: var(--outside-close-icon-size);
      position: absolute;
      right: calc(-1 * var(--outside-close-icon-size) / 2);
      top: calc(-1 * var(--outside-close-icon-size) / 2);
    }

    .el-dialog {
      margin: auto !important;
      border-radius: 7px;
      box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.3);
      background-color: var(--color-white);
      width: auto;
      text-align: center;
      color: var(--color-neutral-800);
      position: relative;
      overflow: hidden;

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
        padding: 10px 20px 20px;
      }

      .el-dialog__close {
        display: none;
      }
    }
  }
</style>
