import { UAlertCard } from '@/modules/common';

export default {
  title: 'Others/AlertCard',
};

export const CardAlerte = () => ({
  components: { UAlertCard },
  template: `
  <div :style="{ width: '700px' }">
    <u-alert-card type="info">
      <p>Utilisateur existant, définissez ses accès </p>
    </u-alert-card>
    <br>
    <u-alert-card type="success">
      <p>Cet utilisateur dispose déjà d'un accès . Il n'est pas possible de récréer un compte.</p>
    </u-alert-card>
    <br>
    <u-alert-card type="warning">
      <p>Cet utilisateur dispose déjà d'un accès . Il n'est pas possible de récréer un compte.</p>
    </u-alert-card>
    <br>
    <u-alert-card type="danger">
      <p>Cet utilisateur dispose déjà d'un accès . Il n'est pas possible de récréer un compte.</p>
    </u-alert-card>
    <br>
    <u-alert-card type="warning">
      <h4>Titre alert card</h4>
      <strong>Cet utilisateur dispose déjà d'un accès . Il n'est pas possible de récréer un compte.</strong>
      <p>Cet utilisateur dispose déjà d'un accès . Il n'est pas possible de récréer un compte.</p>
      <p>Cet utilisateur dispose déjà d'un accès . Il n'est pas possible de récréer un compte.</p>
      <p>Cet utilisateur dispose déjà d'un accès . Il n'est pas possible de récréer un compte.</p>
    </u-alert-card>

  </div>
  `,
});
