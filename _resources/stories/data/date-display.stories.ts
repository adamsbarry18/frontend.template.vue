import UDateDisplay from '@/modules/common/data/UDateDisplay.vue';

export default {
  title: 'data/DateDisplay',
  component: UDateDisplay,
};

export const DateDisplay = () => ({
  components: { UDateDisplay },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px;">
    <!-- Cas avec une date valide (string) -->
    <div>
      <h3>Valid Date (String) middle</h3>
      <u-date-display :date="validDateString" />
    </div>

    <!-- Cas avec une date valide (timestamp) -->
    <div>
      <h3>Valid Date (Number) middle</h3>
      <u-date-display :date="validDateNumber" />
    </div>

    <!-- Cas avec une date valide (objet Date) -->
    <div>
      <h3>Valid Date (Date Object) middle</h3>
      <u-date-display :date="validDateObject" />
    </div>

    <!-- Cas avec une date invalide -->
    <div>
      <h3>Invalid Date</h3>
      <u-date-display :date="invalidDateString" />
    </div>

    <!-- Cas avec un format i18n personnalisé -->
    <div>
      <h3>Custom i18n Format short</h3>
      <u-date-display :date="validDateString" :i18n-format="shortFormat" />
    </div>
    <div>
      <h3>Custom i18n Format long</h3>
      <u-date-display :date="validDateString" :i18n-format="longFormat" />
    </div>
  </div>
`,
  setup() {
    // Cas avec une date valide au format string (ISO)
    const validDateString = '2023-03-12T12:34:56';
    // Cas avec une date valide sous forme de timestamp (nombre)
    const validDateNumber = Date.now();
    // Cas avec une date valide sous forme d'objet Date
    const validDateObject = new Date('2023-03-12T12:34:56'); // or this format: new Date(2020, 0, 1);
    // Cas avec une date invalide (chaîne incorrecte)
    const invalidDateString = 'invalid-date';
    // Cas avec un format personnalisé pour l'affichage via i18n
    const shortFormat = 'short';
    const longFormat = 'long';

    return {
      validDateString,
      validDateNumber,
      validDateObject,
      invalidDateString,
      shortFormat,
      longFormat,
    };
  },
});
