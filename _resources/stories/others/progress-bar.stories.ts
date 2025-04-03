import { UProgressBar } from '@/modules/common';
import { ref } from 'vue';

export default {
  title: 'others/ProgressBar',
};

export const ProgressBar = () => ({
  components: { UProgressBar },
  template: `
    <div style="padding: 12px;">
      <section style="margin-bottom: 24px;">
        <h3>Basic ProgressBar</h3>
        <u-progress-bar :percent="basicPercent" />
        <p>Percent: {{ basicPercent }}</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>ProgressBar with Increment</h3>
        <u-progress-bar :percent="incrementPercent" :increment-percent="incrementAmount" />
        <p>Percent: {{ incrementPercent }}, Increment: {{ incrementAmount }}</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>Overloaded ProgressBar</h3>
        <u-progress-bar :percent="overloadedPercent" />
        <p>Percent: {{ overloadedPercent }}</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>Custom Colors ProgressBar</h3>
        <u-progress-bar
          :percent="customColorPercent"
          :increment-percent="incrementAmount"
          color="var(--color-blue-600)"
          increment-color="var(--color-blue-400)"
          overload-color="var(--color-red-600)"
        />
        <p>Percent: {{ customColorPercent }}</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>Hidden Indicators ProgressBar</h3>
        <u-progress-bar :percent="hiddenPercent" :display-percent="false" :display-title="false" />
        <p>Percent: {{ hiddenPercent }}</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>Custom Height ProgressBar</h3>
        <u-progress-bar :percent="customHeightPercent" :height="customHeight" />
        <p>Percent: {{ customHeightPercent }}, Height: {{ customHeight }}px</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>Zero Percent ProgressBar</h3>
        <u-progress-bar :percent="zeroPercent" />
        <p>Percent: {{ zeroPercent }}</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>Full Percent ProgressBar</h3>
        <u-progress-bar :percent="fullPercent" />
        <p>Percent: {{ fullPercent }}</p>
      </section>

      <section style="margin: 24px 0;">
        <h3>Increment Greater Than Percent ProgressBar</h3>
        <u-progress-bar :percent="incrementGreaterThanPercentValue" :increment-percent="incrementGreaterThanPercentIncrement" />
        <p>Percent: {{ incrementGreaterThanPercentValue }}, Increment: {{ incrementGreaterThanPercentIncrement }}</p>
      </section>


    </div>
  `,
  setup() {
    const basicPercent = ref(50);
    const incrementPercent = ref(75);
    const incrementAmount = ref(30);
    const overloadedPercent = ref(120);
    const customColorPercent = ref(70);
    const hiddenPercent = ref(80);
    const customHeightPercent = ref(40);
    const customHeight = ref(32);
    const zeroPercent = ref(0);
    const fullPercent = ref(100);
    const incrementGreaterThanPercentValue = ref(30);
    const incrementGreaterThanPercentIncrement = ref(70);

    return {
      basicPercent,
      incrementPercent,
      incrementAmount,
      overloadedPercent,
      customColorPercent,
      hiddenPercent,
      customHeightPercent,
      customHeight,
      zeroPercent,
      fullPercent,
      incrementGreaterThanPercentValue,
      incrementGreaterThanPercentIncrement,
    };
  },
});
