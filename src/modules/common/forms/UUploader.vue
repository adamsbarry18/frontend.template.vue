<template>
  <el-upload
    class="u-uploader"
    drag
    action=""
    :accept="accept"
    :http-request="onUpload"
    :class="{ '-uploading': isUploadInProgress }"
  >
    <div class="u-uploader-body">
      <template v-if="isUploadInProgress">
        <b class="primary-emphasis">{{
          $t('commons.uploader.upload-in-progress')
        }}</b>
      </template>
      <template v-else>
        <div v-if="input !== null" class="file-preview">
          <icon-base icon="icon-list" :size="32" />
          <p class="file-name">{{ input.name }}</p>
          <b class="delete-file -button-like" @click.stop="onDelete">{{
            $t('commons.form.delete')
          }}</b>
          <p class="file-specs">
            {{ $t('commons.uploader.file-size', { size: formattedFileSize }) }}
          </p>
        </div>
        <template v-else>
          <p class="uploader-prompt">
            <b class="primary-emphasis">{{
              $t('commons.uploader.prompt.click')
            }}</b>
          </p>
          <p v-if="accept" class="file-specs">
            {{
              $t('commons.uploader.accepted-files', { types: formattedAccept })
            }}
          </p>
          <p v-if="maxFileSize" class="file-specs">
            {{
              $t('commons.uploader.max-file-size', {
                size: formattedMaxFileSize,
              })
            }}
          </p>
        </template>
      </template>
    </div>
  </el-upload>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { ElUpload } from 'element-plus';
  import { IconBase } from '@/modules/common';
  import { formatFileSize } from '@/libs/utils/Number';
  import i18n from '@/i18n';

  const props = defineProps({
    modelValue: {
      type: Object,
    },
    accept: {
      type: String,
      default: '',
    },
    maxFileSize: {
      type: Number,
      default: 0,
    },
  });

  const input = ref(props.modelValue);
  const isUploadInProgress = ref(false);

  watch(
    () => props.modelValue,
    (newValue) => {
      input.value = newValue;
    },
    { immediate: true }
  );

  const formattedFileSize = computed(() =>
    input.value ? formatFileSize(input.value.size) : '0'
  );
  const formattedMaxFileSize = computed(() =>
    formatFileSize(props.maxFileSize)
  );
  const formattedAccept = computed(() => props.accept.replaceAll(',', ', '));

  const emit = defineEmits(['update:modelValue', 'change']);
  const onChange = () => {
    emit('update:modelValue', input.value);
    emit('change', input.value);
  };

  const onDelete = () => {
    input.value = null;
    onChange();
  };

  const onUpload = ({ file }: { file: File }): Promise<void> => {
    isUploadInProgress.value = true;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (file.size > props.maxFileSize) {
          alert(i18n.global.t('commons.uploader.error.file-too-large'));
          reject(new Error('FILE_TOO_LARGE'));
        } else {
          input.value = file;
          onChange();
          resolve();
        }
        isUploadInProgress.value = false;
      }, 1000);
    });
  };
</script>

<style lang="scss">
  .u-uploader {
    display: flex;
    align-items: center;
    padding: 8px 0;

    &.-uploading {
      .el-upload-dragger {
        border: 1px dashed var(--color-primary-500);
        background-color: var(--color-primary-50);
      }
    }

    .el-upload {
      width: 100%;

      .el-upload-dragger {
        width: 100%;
        border: 1px dashed var(--color-input-border);
        border-radius: 8px;
        padding: 60px;

        &:hover {
          border: 1px dashed var(--color-input-border-hover);
        }

        .u-uploader-body {
          .primary-emphasis {
            color: var(--color-primary-600);
          }
          .delete-file {
            color: var(--color-status-error);
          }
          .file-specs {
            color: var(--color-neutral-700);
          }
        }
      }
    }
  }
</style>
