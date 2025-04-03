import { UHelpButton } from '@/modules/common';
import UButton from '@/modules/common/basic/UButton.vue';

export default {
  title: 'Others/HelpButton',
};

export const HelpButton = () => ({
  components: { UHelpButton, UButton },
  template: `
      <div>
      <u-help-button
         placement="right"
        :hasLabel="true"
        :active="isActive"
        size="20"
        @click="isActive = !isActive"
      >
        <h3>Hello there</h3>
            <p>Lorem ipsum dolor sit amet.</p>
            <h3>Hey there</h3>
            <p>Lorem ipsum dolor sit amet.</p>
            <h3>Bye bye</h3>
            <p>Lorem ipsum dolor sit amet.</p>
      </u-help-button>
      </div>
    `,
  methods: {},
  data() {
    return {
      isActive: false,
    };
  },
});
