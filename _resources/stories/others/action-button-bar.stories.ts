import { UActionButtonBar } from '@/modules/common';
import { UButton } from '@/modules/common/basic';

export default {
  title: 'others/ActionButtonBar',
  component: UActionButtonBar,
};

export const ActionButtonBar = () => ({
  components: { UActionButtonBar, UButton },
  template: `
    <div style="position: relative; height: 600px; padding: 20px; border: 1px solid #ddd;">
      <h3>High Placement (default)</h3>
      <u-action-button-bar placement="high">
        <u-button type="primary" icon="icon-user">Button 1</u-button>
        <u-button icon="icon-store">Button 2</u-button>
      </u-action-button-bar>
      
      <h3 style="margin-top: 200px;">Mid Placement</h3>
      <u-action-button-bar placement="mid">
        <u-button>Button A</u-button>
        <u-button>Button B</u-button>
      </u-action-button-bar>
      
      <h3 style="margin-top: 200px;">Low Placement</h3>
      <u-action-button-bar placement="low">
        <u-button>Button X</u-button>
        <u-button>Button Y</u-button>
      </u-action-button-bar>
    </div>
  `,
  setup() {
    return {};
  },
});
