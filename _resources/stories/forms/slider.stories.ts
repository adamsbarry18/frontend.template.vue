import USlider from '@/commons/forms/USlider.vue';
import { ref } from 'vue';

export default {
  title: 'Form/Slider',
};

export const DefaultSlider = () => ({
  components: { USlider },
  template: `
  <div style="padding: 12px;">
    <section style="margin-bottom: 24px;">
      <h3>Default Slider</h3>
      <u-slider v-model="defaultValue" />
      <p>Current Value: {{ defaultValue }}</p>
    </section>
    
    <hr />

    <section style="margin: 24px 0;">
      <h3>Custom Range Slider</h3>
      <u-slider v-model="customValue" :min="customMin" :max="customMax" />
      <p>Current Value: {{ customValue }}</p>
    </section>
    
    <hr />

    <section style="margin: 24px 0;">
      <h3>Disabled Slider</h3>
      <u-slider v-model="disabledValue" disabled />
      <p>Current Value: {{ disabledValue }}</p>
    </section>
    
    <hr />

    <section style="margin: 24px 0;">
      <h3>Slider with Change Event</h3>
      <u-slider v-model="changeValue" @change="handleChange" />
      <p>Current Value: {{ changeValue }}</p>
    </section>
  </div>
`,
  setup() {
    // Cas par défaut
    const defaultValue = ref(50);

    // Cas avec des bornes personnalisées
    const customValue = ref(75);
    const customMin = 50;
    const customMax = 150;

    // Cas du slider désactivé
    const disabledValue = ref(30);

    // Cas avec gestion de l'événement change
    const changeValue = ref(20);
    const handleChange = (newValue: number) => {
      console.log('Slider value changed:', newValue);
    };

    return {
      defaultValue,
      customValue,
      customMin,
      customMax,
      disabledValue,
      changeValue,
      handleChange,
    };
  },
});
