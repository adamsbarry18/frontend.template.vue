import { ref } from 'vue';
import UTimePicker from '@/modules/common/forms/UTimePicker.vue';

export default {
  title: 'Forms/TimePicker',
};

export const TimePicker = () => ({
  components: { UTimePicker },
  template: `
    <div style="padding: 16px;">
      <!-- Cas par défaut -->
      <section style="margin-bottom: 24px;">
        <h3>Cas par défaut</h3>
        <u-time-picker v-model="defaultValue" />
        <p>Heure sélectionnée : {{ defaultValue }}</p>
      </section>

      <!-- Cas avec options personnalisées -->
      <section style="margin-bottom: 24px;">
        <h3>Options personnalisées</h3>
        <u-time-picker v-model="customValue" :picker-options="customPickerOptions" />
        <p>Heure sélectionnée : {{ customValue }}</p>
      </section>

      <!-- Cas du composant désactivé -->
      <section style="margin-bottom: 24px;">
        <h3>Composant désactivé</h3>
        <u-time-picker v-model="disabledValue" :disabled="true" />
        <p>Heure sélectionnée : {{ disabledValue }}</p>
      </section>

      <!-- Cas avec gestion d'événement -->
      <section style="margin-bottom: 24px;">
        <h3>Gestion d'événement</h3>
        <u-time-picker v-model="eventValue" @change="handleChange" />
        <p>Heure sélectionnée : {{ eventValue }}</p>
      </section>
    </div>
  `,
  setup() {
    const defaultValue = ref('12:00');

    const customValue = ref('08:00');
    const customPickerOptions = ref({
      start: '08:00',
      end: '18:00',
      step: '00:30',
    });
    const disabledValue = ref('10:00');
    const eventValue = ref('14:00');
    const handleChange = (newValue) => {
      console.log('Valeur changée :', newValue);
    };

    return {
      defaultValue,
      customValue,
      customPickerOptions,
      disabledValue,
      eventValue,
      handleChange,
    };
  },
});
