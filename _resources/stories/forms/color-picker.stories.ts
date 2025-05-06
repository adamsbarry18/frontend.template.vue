import { ref } from 'vue';
import { UColorPicker } from '@/modules/ui';

export default {
  title: 'Forms/ColorPicker',
  component: UColorPicker,
};

export const ColorPicker = () => ({
  components: { UColorPicker },
  template: `
    <div style="padding: 16px;">
      <!-- Default Color Picker -->
      <section style="margin-bottom: 24px;">
        <h3>Default Color Picker</h3>
        <u-color-picker v-model="defaultColor" />
        <p>Selected Color: {{ defaultColor }}</p>
      </section>

      <!-- Disabled Color Picker -->
      <section style="margin-bottom: 24px;">
        <h3>Disabled Color Picker</h3>
        <u-color-picker v-model="disabledColor" :disabled="true" />
        <p>Selected Color: {{ disabledColor }}</p>
      </section>

      <!-- Dark Mode Color Picker -->
      <section style="margin-bottom: 24px;">
        <h3>Dark Mode Color Picker</h3>
        <div class="u-color-picker -dark">
          <u-color-picker v-model="darkColor" />
        </div>
        <p>Selected Color: {{ darkColor }}</p>
      </section>

      <!-- Interactive Color Picker -->
      <section style="margin-bottom: 24px;">
        <h3>Interactive Color Picker</h3>
        <u-color-picker v-model="interactiveColor" :disabled="isDisabled" />
        <p>Selected Color: {{ interactiveColor }}</p>
        <button @click="toggleDisabled">
          Toggle Disabled (Current: {{ isDisabled ? 'Disabled' : 'Enabled' }})
        </button>
      </section>
    </div>
  `,
  setup() {
    const defaultColor = ref(null); // Default color
    const disabledColor = ref('#00ff00'); // Default color for disabled picker
    const darkColor = ref('#0000ff'); // Default color for dark mode
    const interactiveColor = ref('#abcdef'); // Default color for interactive picker
    const isDisabled = ref(false);

    const toggleDisabled = () => {
      isDisabled.value = !isDisabled.value;
    };

    return {
      defaultColor,
      disabledColor,
      darkColor,
      interactiveColor,
      isDisabled,
      toggleDisabled,
    };
  },
});
