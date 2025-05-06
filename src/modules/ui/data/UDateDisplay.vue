<template>
  <span class="u-date-display" :title="formattedDate">
    {{ formattedDate }}
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { isDateValid } from '@/libs/utils/Date';
  import { useI18n } from 'vue-i18n';

  interface Props {
    date: string | number | Date;
    i18nFormat?: string;
  }

  const props = defineProps<Props>();

  // On récupère la fonction de formatage des dates via vue-i18n
  const { d: formatDate } = useI18n();

  // On crée un objet Date à partir de la prop date
  const dateObject = computed(() => new Date(props.date));

  // Si la date est invalide, on retourne '-' sinon on formate la date
  const formattedDate = computed(() => {
    if (!props.date || !isDateValid(dateObject.value)) {
      return '-';
    }
    return formatDate(dateObject.value, props.i18nFormat || 'middle');
  });
</script>

<style lang="scss"></style>
