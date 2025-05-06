<template>
  <div class="u-multi-day-schedule-input">
    <span class="schedule-text -first">{{ $t('commons.schedule.every') }}</span>
    <el-select
      v-model="dayValue"
      multiple
      :collapse-tags="dayValue.length > 2"
      :placeholder="$t('commons.schedule.placeholder.days-of-week')"
      :disabled="disabled"
      @change="handleChange"
    >
      <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <b class="schedule-text">{{ $t('commons.schedule.at') }}</b>
    <el-time-select
      v-model="timeValue"
      :picker-options="timePickerOptions"
      :placeholder="$t('commons.schedule.placeholder.time')"
      :disabled="disabled"
      @change="handleChange"
    />
    <u-info v-if="timezone">{{ $t('commons.schedule.timezone', { timezone }) }}</u-info>
  </div>
</template>
<script setup lang="ts">
  import { computed, ref, watch, onMounted } from 'vue';
  import { DAYS_OF_WEEK } from '@/libs/utils/Date';
  import { UInfo } from '@/modules/ui';
  import { ElSelect, ElOption, ElTimeSelect } from 'element-plus';
  import i18n from '@/i18n';

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
  const dayValue = ref<string[]>([]);
  const timeValue = ref<string>('00:00');
  const lastTimeValue = ref<string>('00:00');

  // Options pour les jours de la semaine
  const dayOptions = computed(() =>
    Object.values(DAYS_OF_WEEK).map((value) => ({
      value,
      label: i18n.global.t(`commons.schedule.day.${value}`),
    }))
  );

  // Options pour le sélecteur de temps
  const timePickerOptions = computed(() => {
    const opts = {
      timeStart: '00:00',
      timeEnd: '23:30',
      timeStep: '00:30',
    };
    return { ...opts, ...props.options };
  });

  // Calcul des valeurs parsées
  const parsedDayValue = computed(() => {
    if (input.value && input.value.split(' ').length === 6) {
      return input.value.split(' ')[5].split(',');
    }
    return [];
  });

  const parsedTimeValue = computed(() => {
    if (input.value && input.value.split(' ').length === 6) {
      return `${input.value.split(' ')[2]}:${input.value.split(' ')[1]}`;
    }
    return '00:00';
  });

  // Valeur formatée pour l'input
  const formattedValue = computed(() => {
    if (dayValue.value.length === 0) {
      return null;
    }
    // Create a copy of dayValue.value to avoid side effects
    const sortedDays = [...dayValue.value]
      .sort((a, b) => {
        const order = dayOptions.value.map((o) => o.value);
        return order.indexOf(a as (typeof order)[0]) - order.indexOf(b as (typeof order)[0]);
      })
      .join(',');
    const formattedHour = timeValue.value ? timeValue.value.split(':')[0] : '00';
    const formattedMinute = timeValue.value ? timeValue.value.split(':')[1] : '00';
    return `00 ${formattedMinute} ${formattedHour} * * ${sortedDays}`;
  });

  // Synchronisation des props avec l'état interne
  watch(
    () => props.value,
    (val) => {
      input.value = val;
      updateState();
    }
  );

  // Initialisation au montage
  onMounted(() => {
    input.value = props.value ?? null;
    updateState();
  });

  // Gestion des changements
  const emit = defineEmits(['change', 'input']);
  const handleChange = () => {
    input.value = formattedValue.value;
    emit('change', input.value);
    emit('input', input.value);
  };

  const updateState = () => {
    dayValue.value = parsedDayValue.value;
    timeValue.value = parsedTimeValue.value;
    lastTimeValue.value = parsedTimeValue.value;
  };

  // Watcher pour effectuer les effets de bord nécessaires
  watch(parsedDayValue, (newVal) => {
    dayValue.value = newVal;
  });

  watch(parsedTimeValue, (newVal) => {
    timeValue.value = newVal;
    lastTimeValue.value = newVal;
  });
</script>

<style lang="scss">
  .u-multi-day-schedule-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    .schedule-text {
      padding: 16px;
      &.-first {
        padding-left: 0;
      }
    }

    .el-select__wrapper {
      background-color: var(--color-white);
      box-shadow: 0 0 0 1px var(--color-input-border);
      border-radius: 4px;
    }
  }
</style>
