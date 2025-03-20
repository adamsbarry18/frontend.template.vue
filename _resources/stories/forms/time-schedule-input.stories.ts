import UTimeScheduleInput from '@/modules/common/forms/UTimeScheduleInput.vue';

export default {
  title: 'forms/TimeScheduleInput',
  component: UTimeScheduleInput,
};

// 1. Configuration par défaut
export const Default = () => ({
  components: { UTimeScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-time-schedule-input
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

// 2. Avec une valeur initiale
export const WithInitialValue = () => ({
  components: { UTimeScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-time-schedule-input
        :value="value"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = '00 30 14 * * ?'; // Correspond à 14:30
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 3. Avec timezone
export const WithTimezone = () => ({
  components: { UTimeScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-time-schedule-input
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
  components: { UTimeScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-time-schedule-input
        :value="value"
        :disabled="true"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = '00 30 14 * * ?';
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 5. Avec options personnalisées pour le sélecteur de temps
export const WithCustomTimeOptions = () => ({
  components: { UTimeScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-time-schedule-input
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
