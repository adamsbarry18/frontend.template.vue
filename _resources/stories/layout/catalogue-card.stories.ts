import { UCatalogueCard, UButton } from '@/modules/common';

export default {
  title: 'Layout/CatalogueCard',
};

export const CatalogueCard = () => ({
  components: { UButton, UCatalogueCard },
  template: `
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">
      <!-- Carte basique avec contenu uniquement -->
      <u-catalogue-card>
        <template #title>
          <h2>Basic Catalogue Card</h2>
        </template>
        <p>This is a basic catalogue card with default content.</p>
      </u-catalogue-card>

      <!-- Carte avec actions -->
      <u-catalogue-card>
        <template #title>
          <h2>Catalogue Card with Actions</h2>
        </template>
        <template #actions>
          <u-button  @click="onCardClick">Action</u-button>
        </template>
        <p>This card includes an action button in the header.</p>
      </u-catalogue-card>

      <!-- Carte avec bouton d'exploration -->
      <u-catalogue-card>
        <template #title>
          <h2>Catalogue Card with Explore Button</h2>
        </template>
        <p>This card includes an explore button at the bottom.</p>
        <template #explore-button>
          <u-button type="primary"  @click="onCardClick">Explore</u-button>
        </template>
      </u-catalogue-card>

      <!-- Carte complète avec tous les slots -->
      <u-catalogue-card>
        <template #title>
          <h2>Fully Featured Catalogue Card</h2>
        </template>
        <template #actions>
          <u-button  @click="onCardClick">Edit</u-button>
        </template>
        <p>This card displays a title, actions, main content, and an explore button.</p>
        <template #explore-button>
          <u-button type="tertiary"  @click="onCardClick">Explore</u-button>
        </template>
      </u-catalogue-card>
      <u-catalogue-card @click.native="onCardClick">
      <template #title>
        <h2>Card with click event</h2>
      </template>
        <p>Content</p>
        <div>Other content for example as image or tag</div>
        <template #explore-button>
          <u-button type="primary" @click="onCardClick">Bouton qui s'affiche au hover</u-button>
        </template>
    </u-catalogue-card>
    </div>
  `,
  setup() {
    const onCardClick = () => {
      alert('Click on card');
    };
    return {
      onCardClick,
    };
  },
});
