import { ref } from 'vue';
import { UToggleButton } from '@/modules/common';

export default {
  title: 'Forms/AToggleButton',
};

export const ToggleButton = () => ({
  components: { UToggleButton },
  template: `
    <div style="padding: 16px;">
      <!-- Cas par défaut -->
      <section style="margin-bottom: 24px;">
        <h3>Cas par défaut with icon</h3>
        <u-toggle-button v-model="value" :options="options" />
        <p>Valeur : {{ value }}</p>
      </section>

      <!-- Cas avec options personnalisées -->
      <section style="margin-bottom: 24px;">
        <h3>Options personnalisées</h3>
        <u-toggle-button v-model="customValue" :options="customOptions" />
        <p>Valeur : {{ customValue }}</p>
      </section>

      <!-- Cas du composant désactivé -->
      <section style="margin-bottom: 24px;">
        <h3>Composant désactivé</h3>
        <u-toggle-button v-model="disabledValue" :disabled="true" />
        <p>Valeur : {{ disabledValue }}</p>
      </section>

      <!-- Cas avec gestion d'événement -->
      <section style="margin-bottom: 24px;">
        <h3>Gestion d'événement</h3>
        <u-toggle-button v-model="eventValue" :options="eventOptions" @change="handleChange" />
        <p>Valeur : {{ eventValue }}</p>
      </section>
    </div>
  `,
  setup() {
    // Cas par défaut
    const value = ref('');
    const options = ref([
      { id: 0, label: 'Par défaut', value: true, icon: 'icon-add' },
      { id: 1, label: 'Personnalisé', value: false, icon: 'icon-add' },
    ]);

    // Cas avec options personnalisées
    const customValue = ref('');
    const customOptions = ref([
      { id: 0, label: 'Option A', value: false },
      { id: 1, label: 'Option B', value: true },
    ]);

    // Cas du composant désactivé
    const disabledValue = ref('');
    const disabledOptions = ref([
      { id: 0, label: 'Option 1', value: false },
      { id: 1, label: 'Option 2', value: false },
    ]);

    // Cas avec gestion d'événement
    const eventValue = ref('');
    const eventOptions = ref([
      { id: 0, label: 'Actif', value: true },
      { id: 1, label: 'Inactif', value: false },
    ]);

    const handleChange = (newValue) => {
      console.log('Valeur changée :', newValue);
    };

    return {
      value,
      options,
      customValue,
      customOptions,
      disabledValue,
      disabledOptions,
      eventValue,
      eventOptions,
      handleChange,
    };
  },
});
