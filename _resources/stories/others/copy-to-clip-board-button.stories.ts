import { UCopyToClipboardButton } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'others/CopyToClipboardButton',
  component: UCopyToClipboardButton,
};

export const CopyToClipboardButton = () => ({
  components: { UCopyToClipboardButton },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <div>
        <h3>Default Copy Button</h3>
        <u-copy-to-clipboard-button :snippet="snippetDefault" />
        <strong>Texte à copier : </strong>{{ snippetDefault }}
      </div>
      <div>
        <h3>Custom Snippet Copy Button</h3>
        <u-copy-to-clipboard-button :snippet="snippetCustom" />
        <strong>Texte à copier : </strong>{{ snippetCustom }}
      </div>
    </div>
  `,
  setup() {
    const snippetDefault = ref('Default snippet text to copy.');
    const snippetCustom = ref('This is a custom snippet for the button.');
    return { snippetDefault, snippetCustom };
  },
});
