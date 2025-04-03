import { UButton, UCard, IconBase } from '@/modules/common';
import { ref } from 'vue';

export default {
  title: 'layout/Card',
};

export const Card = () => ({
  components: { UCard, UButton, IconBase },
  template: `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Carte par défaut -->
      <u-card :title="title">
        <template>
          je suis le contenu
        </template>
        <template #actions>
          <icon-base
            class="-button-like"
            icon="icon-edit"
            @click.native="handleClick('icon-edit')"
            color="#9e9e9e"
          />
        </template>
      </u-card>

      <!-- Carte avec un titre -->
      <u-card title="Titre de la carte">
        <p>Contenu de la carte avec un titre.</p>
      </u-card>

      <!-- Carte avec un slot pour le titre -->
      <u-card>
        <template #title>
          <strong>Slot Title</strong>
        </template>
        <p>Contenu de la carte avec un titre provenant d'un slot.</p>
      </u-card>

      <!-- Carte avec des actions -->
      <u-card title="Carte avec actions">
        <template #actions>
          <u-button @click="handleClick">Action</u-button>
        </template>
        <p>Contenu de la carte avec des actions.</p>
      </u-card>

      <!-- Carte avec un bouton d'aide -->
      <u-card title="Carte avec aide">
        <template #help>
          <p>Aide</p>
        </template>
        <p>Contenu de la carte avec un bouton d'aide.</p>
      </u-card>

      <!-- Carte complète avec toutes les fonctionnalités -->
      <u-card title="Carte complète">
        <template #title>
          <strong>Titre depuis un slot</strong>
        </template>
        <template #actions>
          <u-button @click="handleClick">Action</u-button>
        </template>
        <template #help>
          <p>Aide</p>
        </template>
        <p>Contenu de la carte avec un titre, une action et un bouton d'aide.</p>
      </u-card>
      <u-card>
        <template #title>
          {{ slotTitle }}
        </template>
          <p>Lorem ipsum dolor sit amet</p>
          <ul>
            <li> Item 1</li>
            <li> Item 2</li>
            <li> Item 3</li>
            <li> Item 4</li>
          </ul>
        <template #actions>
          <icon-base
            style="margin: 4px"
            icon="icon-explore"
          />
          <icon-base
            style="margin: 4px"
            icon="icon-activate"
          />
        </template>
        <template #help>
            <p>Je suis de l'aide</p>
        </template>
      </u-card>
    </div>
  `,
  setup() {
    const title = ref('Inline Title');
    const slotTitle = ref('Slot title');
    const handleClick = () => alert('Action cliquée!');
    return { handleClick, title, slotTitle };
  },
});
