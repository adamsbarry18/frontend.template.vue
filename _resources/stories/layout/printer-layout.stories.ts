import { UPrinterLayout } from '@/modules/ui';

export default {
  title: 'Layout/UPrinterLayout',
  component: UPrinterLayout,
};

export const PrinterLayout = () => ({
  components: { UPrinterLayout },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px; background-color: var(--color-neutral-100);">
      <!-- Cas 1 : Layout avec Left, Center et Right -->
      <div style="position: relative; height: 300px; background-color: #fff; padding: 20px;">
        <h3>Left, Center & Right</h3>
        <u-printer-layout>
          <template #left>
            <h2>Left</h2>
            <p>Lorem ipsum dolor sit amet</p>
          </template>
          <div>
            <h2>Center</h2>
            <p>Lorem ipsum dolor sit amet</p>
          </div>
          <template #right>
            <h2>Right</h2>
            <p>Lorem ipsum dolor sit amet</p>
          </template>
        </u-printer-layout>
      </div>

      <!-- Cas 2 : Layout avec Center et Right seulement -->
      <div style="position: relative; height: 300px; background-color: #fff; padding: 20px;">
        <h3>Center & Right Only</h3>
        <u-printer-layout>
          <div>
            <h2>Center</h2>
            <p>Lorem ipsum dolor sit amet</p>
          </div>
          <template #right>
            <h2>Right</h2>
            <p>Lorem ipsum dolor sit amet</p>
          </template>
        </u-printer-layout>
      </div>

      <!-- Cas 3 : Layout avec Left et Center seulement -->
      <div style="position: relative; height: 300px; background-color: #fff; padding: 20px;">
        <h3>Left & Center Only</h3>
        <u-printer-layout>
          <template #left>
            <h2>Left</h2>
            <p>Lorem ipsum dolor sit amet</p>
          </template>
          <div>
            <h2>Center</h2>
            <p>Lorem ipsum dolor sit amet</p>
          </div>
        </u-printer-layout>
      </div>
    </div>
  `,
});
