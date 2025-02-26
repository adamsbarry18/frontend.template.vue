<template>
  <el-pagination
    ref="elPagination"
    v-model:current-page="currentPage"
    :page-size="props.size"
    layout="slot, prev, pager, next"
    :total="props.total"
    @current-change="onCurrentChange"
  >
    <span v-if="props.total > 0" class="custom-total">
      {{
        $t('commons.list.results', { minResult, maxResult, total: props.total })
      }}
    </span>
    <span v-else class="custom-total">
      {{ $t('commons.list.results.empty') }}
    </span>
  </el-pagination>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { ElPagination } from 'element-plus';

  // Typage des props
  interface Props {
    total: number;
    defaultPage?: number;
    size?: number;
  }

  // Définir les props et les événements émis
  const props = withDefaults(defineProps<Props>(), {
    defaultPage: 1,
    size: 25,
  });
  const emit = defineEmits<{
    (event: 'page-change', page: number): void;
  }>();

  // Référence à l'instance de ElPagination
  const elPagination = ref<InstanceType<typeof ElPagination> | null>(null);

  // État réactif pour la page courante
  const currentPage = ref(props.defaultPage);

  // Propriétés calculées
  const minResult = computed(() => (currentPage.value - 1) * props.size + 1);
  const maxResult = computed(() =>
    Math.min(currentPage.value * props.size, props.total)
  );

  // Gestion des changements de page
  const onCurrentChange = (page: number) => {
    currentPage.value = page;
    emit('page-change', page);
  };

  // Synchronisation avec defaultPage et total
  watch(
    () => props.defaultPage,
    (newDefaultPage) => {
      currentPage.value = newDefaultPage;
    }
  );

  watch(
    () => props.total,
    () => {
      if (
        elPagination.value &&
        (elPagination.value as any).internalCurrentPage !== currentPage.value
      ) {
        (elPagination.value as any).internalCurrentPage = currentPage.value;
      }
    }
  );

  // Initialisation au montage
  onMounted(() => {
    currentPage.value = props.defaultPage;
  });
</script>

<style lang="scss">
  .el-pagination {
    background: var(--color-background-white);
    align-items: center;
    box-shadow: 0px -5px 10px -3px rgba(43, 77, 111, 0.12);
    z-index: 2;
    display: flex;
    height: 55px;
    min-height: 55px;
    padding-right: 8px;

    span.custom-total {
      color: var(--color-neutral-500);
      flex-grow: 1;
      font-size: var(--paragraph-03);
      font-weight: normal;
      margin-left: 20px;
    }

    button {
      flex-grow: 0;

      &.btn-prev .el-icon,
      &.btn-next .el-icon {
        font-size: var(--paragraph-02);
      }
      &:disabled i {
        color: var(--color-neutral-300);
      }
    }

    .el-pager {
      flex-grow: 0;

      li:not(.disabled).active {
        display: inline-block;
        background-color: var(--color-primary-100);
        color: var(--color-neutral-800);
      }

      li {
        display: inline-block;
        border-radius: 2px;
        cursor: pointer;
        padding: 5px 8px 4px 8px;
        min-width: 28px;
        line-height: normal;
        color: var(--color-neutral-700);
        font-stretch: normal;
        font-weight: normal;
        font-style: normal;

        // Double arrow icon
        &.btn-quickprev,
        &.btn-quicknext {
          font-size: var(--paragraph-02);
          position: relative;
          bottom: 2px;
        }
      }

      .more::before {
        line-height: 20px;
      }
    }
  }
</style>
