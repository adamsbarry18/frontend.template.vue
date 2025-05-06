<template>
  <div class="u-copy-to-clipboard-button">
    <div class="copy-button-wrapper">
      <div class="copy-button -button-like" @click.stop="onCopyToClipboard">
        <template v-if="showCopyTimeout">
          <icon-base icon="icon-validate" :size="24" />
          <span class="copy-success">{{ $t('commons.copied') }}</span>
          <div class="timeout-bar" />
        </template>
        <template v-else>
          <icon-base icon="icon-duplicate" :size="24" class="copy-icon" />
          <p>{{ $t('commons.copy-to-clipboard') }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { IconBase } from '@/modules/ui';
  import { waitForMilliseconds } from '@/libs/utils/Time';

  const props = defineProps<{
    snippet: string;
  }>();

  const showCopyTimeout = ref(false);

  const onCopyToClipboard = async () => {
    await navigator.clipboard.writeText(props.snippet);
    showCopyTimeout.value = true;
    await waitForMilliseconds(2500);
    showCopyTimeout.value = false;
  };
</script>

<style lang="scss">
  .u-copy-to-clipboard-button {
    display: flex;
    flex-direction: column;
    min-width: 240px;
    .snippet-info {
      text-align: left;
      margin-bottom: 20px;
      .snippet-name {
        margin-bottom: 4px;
      }
    }
    .copy-button-wrapper {
      .copy-button {
        position: relative;
        display: flex;
        align-items: center;
        border-radius: 4px;
        background-color: var(--color-background-white);
        border: 1px solid var(--color-neutral-800);
        p {
          font-size: var(--paragraph-03);
          margin: 8px;
        }
        .timeout-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          background-color: var(--color-green-500);
          height: 4px;
          animation: grow 1.25s ease-out forwards;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }

  @keyframes grow {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }
</style>
