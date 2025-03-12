import USplitButton from '@/commons/basic/USplitButton.vue';

export default {
  title: 'basic/SplitButton',
  component: USplitButton,
};

export const SplitButton = () => ({
  components: { USplitButton },
  setup() {
    const items = [
      { label: 'Item 1', onClick: () => alert('Au revoir') },
      {
        label: 'Item 2',
        icon: 'icon-edit',
        onClick: () => alert('Item 2 clicked'),
      },
      { icon: 'icon-delete', label: 'Disabled', disabled: true },
    ];

    const onButtonClick = () => {
      alert('Bonjour');
    };

    return { items, onButtonClick };
  },
  template: `
      <div style="padding: 20px;">
        <!-- Default Type -->
        <h2>Default Type Split Button</h2>
        <u-split-button :items="items" type="default" @click="onButtonClick">
          Default
        </u-split-button>
        <!-- Primary Type -->
        <u-split-button :items="items" type="primary" @click="onButtonClick">
          Primary
        </u-split-button>
        <!-- Secondary Type -->
        <u-split-button :items="items" type="secondary" @click="onButtonClick">
          Secondary
        </u-split-button>
        <!-- Tertiary Type -->
        <u-split-button :items="items" type="tertiary" @click="onButtonClick">
          Tertiary
        </u-split-button>
        <!-- Warning Type -->
        <u-split-button :items="items" type="warning" @click="onButtonClick">
          Warning
        </u-split-button>
        <!-- Disabled Button -->
        <u-split-button :items="items" type="primary" @click="onButtonClick" disabled>
          Disabled
        </u-split-button>
        <!-- Button sans type défini -->
        <u-split-button :items="items" @click="onButtonClick">
          No Type
        </u-split-button>
        <br /><br />
        <!-- Small Size Variants -->
        <h2>Split Button Small Size Variants</h2>
        <u-split-button :items="items" type="default" size="small" @click="onButtonClick">
          Default Small
        </u-split-button>
        <u-split-button :items="items" type="primary" size="small" @click="onButtonClick">
          Primary Small
        </u-split-button>
        <u-split-button :items="items" type="secondary" size="small" @click="onButtonClick">
          Secondary Small
        </u-split-button>
        <u-split-button :items="items" type="tertiary" size="small" @click="onButtonClick">
          Tertiary Small
        </u-split-button>
        <u-split-button :items="items" type="warning" size="small" @click="onButtonClick">
          Warning Small
        </u-split-button>
        <u-split-button :items="items" type="primary" size="small" @click="onButtonClick" disabled>
          Disabled Small
        </u-split-button>
        <br /><br />
        <!-- With Icon -->
        <h2>Split With Icon </h2>
        <u-split-button :items="items" type="default" icon="icon-user" @click="onButtonClick">
          Default with Icon
        </u-split-button>
        <u-split-button :items="items" type="primary" icon="icon-user" @click="onButtonClick">
          Primary with Icon
        </u-split-button>
        <u-split-button :items="items" type="secondary" icon="icon-user" @click="onButtonClick">
          Secondary with Icon
        </u-split-button>
        <u-split-button :items="items" type="tertiary" icon="icon-user" @click="onButtonClick">
          Tertiary with Icon
        </u-split-button>
        <u-split-button :items="items" type="warning" icon="icon-user" @click="onButtonClick">
          Warning with Icon
        </u-split-button>
        <u-split-button :items="items" type="primary" icon="icon-user" @click="onButtonClick" disabled>
          Disabled with Icon
        </u-split-button>
    </div>
  `,
});
