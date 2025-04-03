import { UEveryXDaysScheduleInput } from '@/modules/common';
export default {
  title: 'forms/EveryXDaysScheduleInput',
  component: UEveryXDaysScheduleInput,
};

// 1. Configuration par défaut
export const Default = () => ({
  components: { UEveryXDaysScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-every-x-days-schedule-input
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
  components: { UEveryXDaysScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-every-x-days-schedule-input
        :value="value"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = '00 00 00 */3 * ?'; // Tous les 3 jours
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 3. Avec timezone
export const WithTimezone = () => ({
  components: { UEveryXDaysScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-every-x-days-schedule-input
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
  components: { UEveryXDaysScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-every-x-days-schedule-input
        :value="value"
        :disabled="true"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = '00 00 00 */5 * ?'; // Tous les 5 jours
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, handleChange };
  },
});

// 5. Avec options personnalisées
export const WithCustomOptions = () => ({
  components: { UEveryXDaysScheduleInput },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-every-x-days-schedule-input
        :value="value"
        :options="customOptions"
        @change="handleChange"
      />
    </div>`,
  setup() {
    const value = null;
    const customOptions = {}; // Ajoutez des options si nécessaire
    const handleChange = (newValue) => {
      console.log('New value:', newValue);
    };
    return { value, customOptions, handleChange };
  },
});
