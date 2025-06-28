import UConfidenceIndicator from '@/modules/ui/data/UConfidenceIndicator.vue';

export default {
  title: 'data/ConfidenceIndicator',
  component: UConfidenceIndicator,
};

export const ConfidenceIndicator = () => ({
  components: { UConfidenceIndicator },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px;">
    <!-- Cas par défaut -->
    <div>
      <h3>Default Confidence</h3>
      <u-confidence-indicator :model-value="defaultValue" />
    </div>

    <!-- Cas avec tooltip personnalisé -->
    <div>
      <h3>Custom Tooltip</h3>
      <u-confidence-indicator :model-value="customValue" :tooltipFormatter="customTooltip" />
    </div>

    <!-- Cas avec seuils et labels personnalisés -->
    <div>
      <h3>Custom Thresholds</h3>
      <u-confidence-indicator :model-value="customValue" :thresholds="customThresholds" :threshold-labels="customThresholdLabels" />
    </div>

    <!-- Cas en mode inline -->
    <div>
      <h3>Inline Confidence</h3>
      <u-confidence-indicator class="-inline" :model-value="inlineValue" />
    </div>

    <!-- Cas avec style Bold et Large -->
    <div>
      <h3>Bold and Large Confidence</h3>
      <u-confidence-indicator class="-bold -large" :model-value="boldLargeValue" />
    </div>
  </div>
`,
  setup() {
    // Cas par défaut
    const defaultValue = 75;
    // Cas avec tooltip personnalisé
    const customValue = 85;
    const customTooltip = (val: number) => `Confidence Level: ${val}%`;
    // Cas avec seuils et labels personnalisés
    const customThresholds = [50, 70, 85];
    const customThresholdLabels = ['Very Low', 'Low', 'Medium', 'High'];
    // Cas en mode inline
    const inlineValue = 60;
    // Cas avec style bold et large
    const boldLargeValue = 95;

    return {
      defaultValue,
      customValue,
      customTooltip,
      customThresholds,
      customThresholdLabels,
      inlineValue,
      boldLargeValue,
    };
  },
});
