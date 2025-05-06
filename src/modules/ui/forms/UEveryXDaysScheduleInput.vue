<template>
  <div class="u-every-x-days-schedule-input">
    <span class="schedule-text -first">{{ $t('commons.schedule.every') }}</span>
    <u-number-input
      v-model="dayValue"
      :min="1"
      :step="1"
      :disabled="disabled"
      @change="handleChange"
    />
    <b class="schedule-text">{{ $t('commons.schedule.days', dayValue) }}</b>
    <u-info v-if="timezone">{{
      $t('commons.schedule.timezone', { timezone })
    }}</u-info>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onMounted } from 'vue';
  import { UNumberInput, UInfo } from '@/modules/ui';

  // Interface pour typer les props
  interface Props {
    value: string | null;
    disabled?: boolean;
    options?: Record<string, any>;
    timezone?: string;
  }

  // Définition des props avec valeurs par défaut
  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    options: () => ({}),
  });

  // État réactif
  const input = ref<string | null>(null);
  const dayValue = ref<number>(1);

  // Calcul de la valeur parsée
  const parsedDayValue = computed(() => {
    if (input.value && input.value.split(' ').length === 6) {
      const dayPart = input.value.split(' ')[3];
      if (dayPart.split('/').length > 1) {
        return parseInt(dayPart.split('/')[1], 10);
      }
    }
    return 1;
  });

  // Valeur formatée pour l'input
  const formattedValue = computed(() => {
    const cron = input.value
      ? input.value.split(' ')
      : '00 00 00 * * ?'.split(' ');
    cron[3] = `*/${dayValue.value}`;
    return cron.join(' ');
  });

  // Synchronisation des props avec l'état interne
  watch(
    () => props.value,
    (val) => {
      input.value = val;
      dayValue.value = parsedDayValue.value;
    }
  );

  // Initialisation au montage
  onMounted(() => {
    input.value = props.value ?? null;
    dayValue.value = parsedDayValue.value;
  });

  // Gestion des changements
  const emit = defineEmits(['change', 'input']);
  const handleChange = () => {
    input.value = formattedValue.value;
    emit('change', input.value);
    emit('input', input.value);
  };
</script>

<style lang="scss">
  .u-every-x-days-schedule-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    .schedule-text {
      padding: 16px;
      &.-first {
        padding-left: 0;
      }
    }
    .u-number-input {
      min-width: 120px;
    }
  }
</style>
