<template>
  <div class="u-time-schedule-input">
    <el-time-select
      v-model="timeValue"
      class="time-schedule-input"
      size="default"
      :picker-options="{
        start: timePickerOptions.timeStart,
        end: timePickerOptions.timeEnd,
        step: timePickerOptions.timeStep,
      }"
      :placeholder="$t('commons.schedule.placeholder.time')"
      :disabled="disabled"
      :clearable="false"
      @change="handleChange"
    />
    <u-info v-if="timezone">
      {{ $t('commons.schedule.timezone', { timezone }) }}
    </u-info>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onMounted } from 'vue';
  import { UInfo } from '@/modules/ui';
  import { ElTimeSelect } from 'element-plus';

  // Interface pour typer les props
  interface Props {
    value: string | null;
    disabled?: boolean;
    options?: Record<string, string>;
    timezone?: string;
  }

  // Définition des props avec valeurs par défaut
  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    options: () => ({}),
  });

  // État réactif
  const input = ref<string | null>(null);
  const timeValue = ref<string>('00:00');
  const lastTimeValue = ref<string>('00:00');

  // Options pour le sélecteur de temps
  const timePickerOptions = computed(() => {
    const opts = {
      timeStart: '00:00',
      timeEnd: '23:30',
      timeStep: '00:30',
    };
    return { ...opts, ...props.options };
  });

  // Calcul de la valeur parsée sans mutation (computed pur)
  const parsedTimeValue = computed(() => {
    if (input.value && input.value.split(' ').length === 6) {
      const hour = input.value.split(' ')[2].padStart(2, '0');
      const minute = input.value.split(' ')[1].padStart(2, '0');
      return `${hour}:${minute}`;
    }
    return lastTimeValue.value;
  });

  // Mettre à jour lastTimeValue via un watcher, sans impacter le computed
  watch(parsedTimeValue, (val) => {
    lastTimeValue.value = val;
  });

  // Valeur formatée pour l'input
  const formattedValue = computed(() => {
    const cron = input.value ? input.value.split(' ') : '00 00 00 * * ?'.split(' ');
    const formattedHour = timeValue.value ? timeValue.value.split(':')[0] : '00';
    const formattedMinute = timeValue.value ? timeValue.value.split(':')[1] : '00';
    cron[1] = formattedMinute;
    cron[2] = formattedHour;
    return cron.join(' ');
  });

  // Synchronisation des props avec l'état interne
  watch(
    () => props.value,
    (val) => {
      input.value = val;
      timeValue.value = parsedTimeValue.value;
    }
  );

  // Initialisation au montage
  onMounted(() => {
    input.value = props.value ?? null;
    timeValue.value = parsedTimeValue.value;
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
  .u-time-schedule-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    .schedule-text {
      padding: 16px;
      &.-first {
        padding-left: 0;
      }
    }
    .time-schedule-input .el-input__inner {
      height: 40px;
      line-height: 40px;
    }

    .el-select__wrapper {
      background-color: var(--color-white);
      box-shadow: 0 0 0 1px var(--color-input-border);
      border-radius: 4px;
    }
  }
</style>
