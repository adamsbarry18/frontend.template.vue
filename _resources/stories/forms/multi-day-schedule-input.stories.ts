import UMultiDayScheduleInput from '@/modules/common/forms/UMultiDayScheduleInput.vue';

export default {
  title: 'forms/MultiDayScheduleInput',
  component: UMultiDayScheduleInput,
};

// 1. Configuration par défaut
export const Default = () => ({
  components: { UMultiDayScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-multi-day-schedule-input
        :value="value"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = null;
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 2. Avec des jours sélectionnés
export const WithSelectedDays = () => ({
  components: { UMultiDayScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-multi-day-schedule-input
        :value="value"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = '00 00 12 * * MON,WED,FRI';
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 3. Avec timezone
export const WithTimezone = () => ({
  components: { UMultiDayScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-multi-day-schedule-input
        :value="value"
        timezone="UTC"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = null;
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 4. Composant désactivé
export const Disabled = () => ({
  components: { UMultiDayScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-multi-day-schedule-input
        :value="value"
        :disabled="true"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = '00 00 12 * * MON,WED,FRI';
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 5. Avec options personnalisées pour le sélecteur de temps
export const WithCustomTimeOptions = () => ({
  components: { UMultiDayScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-multi-day-schedule-input
        :value="value"
        :options="customOptions"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = null;
    const customOptions = {
      timeStart: '08:00',
      timeEnd: '18:00',
      timeStep: '01:00',
    };
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, customOptions, handleChange };
  },
});
