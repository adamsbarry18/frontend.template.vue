import UButton from '@/commons/basic/UButton.vue';

export default {
  title: 'Basic',
};

export const Button = (args, { argTypes }) => ({
  components: { UButton },
  props: Object.keys(argTypes),
  template: `
    <div class="boxContent">
      <div class="story-row">
        <u-button type="default">Default</u-button>
        <u-button type="primary">Primary</u-button>
        <u-button type="secondary">Secondary</u-button>
        <u-button type="tertiary">Tertiary</u-button>
        <u-button type="warning">Warning</u-button>
        <u-button type="primary" disabled>Disabled</u-button>
        <u-button>{{ text }}</u-button>
      </div>
      <div class="story-row">
        <u-button type="default" size="small">Default</u-button>
        <u-button type="primary" size="small">Primary</u-button>
        <u-button type="secondary" size="small">Secondary</u-button>
        <u-button type="tertiary" size="small">Tertiary</u-button>
        <u-button type="warning" size="small">Warning</u-button>
        <u-button type="primary" size="small" disabled>Disabled</u-button>
      </div>
      <div class="story-row">
        <u-button type="default" icon="icon-weather"></u-button>
        <u-button type="primary" icon="icon-edit"></u-button>
        <u-button type="secondary" icon="icon-edit"></u-button>
        <u-button type="tertiary" icon="icon-edit"></u-button>
        <u-button type="warning" icon="icon-edit"></u-button>
        <u-button type="primary" icon="icon-edit" disabled></u-button>
      </div>
      <div class="story-row">
        <u-button round type="default" icon="icon-edit"></u-button>
        <u-button round type="primary" icon="icon-edit"></u-button>
        <u-button round type="secondary" icon="icon-edit"></u-button>
        <u-button round type="tertiary" icon="icon-edit"></u-button>
        <u-button round type="warning" icon="icon-edit"></u-button>
        <u-button round type="primary" icon="icon-edit" disabled></u-button>
      </div>
    </div>`,
  methods: {
    alert(data) {
      alert(data);
    },
  },
});

Button.args = {
  text: 'Hello Storybook',
};
