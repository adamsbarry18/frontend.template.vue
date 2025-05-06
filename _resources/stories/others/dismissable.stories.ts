import { UDismissable } from '@/modules/ui';

export default {
  title: 'Others/Dismissable',
};

export const Dismissable = () => ({
  components: { UDismissable },
  template: `
    <div>
      <u-dismissable icon="icon-add" @close="onClose">
        <h3>Bonjour</h3>
        <p>Il est possible de me fermer</p>
      </u-dismissable>
      <u-dismissable icon="icon-error" @close="onClose" type="error">
        <h3>Bonjour</h3>
        <p>Il est possible de me fermer</p>
      </u-dismissable>
      <p>Autres paragraphes</p>
    </div>`,
  methods: {
    onClose() {
      console.log('closed!');
    },
  },
});
