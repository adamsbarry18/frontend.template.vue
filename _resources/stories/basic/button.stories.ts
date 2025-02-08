import AButton from "@/modules/basic/AButton.vue";

export default {
  title: "Basic",
};

export const Button = (args, { argTypes }) => ({
  components: { AButton },
  props: Object.keys(argTypes),
  template: `
    <div class="boxContent">
      <div class="story-row">
        <a-button type="default">Default</a-button>
        <a-button type="primary">Primary</a-button>
        <a-button type="secondary">Secondary</a-button>
        <a-button type="tertiary">Tertiary</a-button>
        <a-button type="warning">Warning</a-button>
        <a-button type="primary" disabled>Disabled</a-button>
        <a-button>{{ text }}</a-button>
      </div>
      <div class="story-row">
        <a-button type="default" size="small">Default</a-button>
        <a-button type="primary" size="small">Primary</a-button>
        <a-button type="secondary" size="small">Secondary</a-button>
        <a-button type="tertiary" size="small">Tertiary</a-button>
        <a-button type="warning" size="small">Warning</a-button>
        <a-button type="primary" size="small" disabled>Disabled</a-button>
      </div>
      <div class="story-row">
        <a-button type="default" icon="icon-edit"></a-button>
        <a-button type="primary" icon="icon-edit"></a-button>
        <a-button type="secondary" icon="icon-edit"></a-button>
        <a-button type="tertiary" icon="icon-edit"></a-button>
        <a-button type="warning" icon="icon-edit"></a-button>
        <a-button type="primary" icon="icon-edit" disabled></a-button>
      </div>
      <div class="story-row">
        <a-button round type="default" icon="icon-edit"></a-button>
        <a-button round type="primary" icon="icon-edit"></a-button>
        <a-button round type="secondary" icon="icon-edit"></a-button>
        <a-button round type="tertiary" icon="icon-edit"></a-button>
        <a-button round type="warning" icon="icon-edit"></a-button>
        <a-button round type="primary" icon="icon-edit" disabled></a-button>
      </div>
    </div>`,
  methods: {
    alert(data) {
      alert(data);
    },
  },
});

Button.args = {
  text: "Hello Storybook",
};
