import { defineComponent } from 'vue';
import USearchBar from '@/commons/others/USearchBar.vue';
import UButton from '@/commons/basic/UButton.vue';

export default {
  title: 'Others/SearchBar',
};

export const Search = () =>
  defineComponent({
    components: { USearchBar, UButton },
    template: `
      <div>
        <!-- Cas 1 : Barre de recherche simple -->
        <u-search-bar @search="handleSearch"></u-search-bar>
        <br />

        <!-- Cas 2 : Barre de recherche avec v-model -->
        <u-search-bar v-model="value" @keyup.enter.native="handleSearch" @search="handleSearch"></u-search-bar>
        <br />

        <!-- Cas 3 : Placement de l'icône à gauche -->
        <span>Left icon placement</span>
        <u-search-bar icon-position="left" @search="handleSearch"></u-search-bar>
        <br />

        <!-- Cas 4 : Slot suffix -->
        <span>Suffix Slot</span>
        <u-search-bar #suffix icon-color="var(--color-neutral-500)">
          <u-button type="primary">Button</u-button>
        </u-search-bar>
        <br />

        <!-- Cas 5 : Slot prefix -->
        <span>Prefix Slot</span>
        <u-search-bar icon-position="right" #prefix icon-color="var(--color-neutral-500)">
          <u-button>Button</u-button>
        </u-search-bar>
        <br />

        <!-- Cas 6 : Barre de recherche avec bouton de suppression -->
        <span>Clear</span>
        <u-search-bar @search="handleSearch" clear v-model="value"></u-search-bar>
        <br />

        <!-- Cas 7 : Barre de recherche avec étiquette de suppression personnalisée -->
        <span>Clear label</span>
        <u-search-bar @search="handleSearch" clear clear-label="effacer" v-model="value"></u-search-bar>
        <br />

        <!-- Cas 8 : Barre de recherche avec placeholder -->
        <span>With placeholder</span>
        <u-search-bar placeholder="Rechercher ici..." @search="handleSearch"></u-search-bar>
        <br />

        <!-- Cas 9 : Barre de recherche avec icône à droite -->
        <span>Right icon placement</span>
        <u-search-bar icon-position="right" @search="handleSearch"></u-search-bar>
        <br />

        <!-- Cas 10 : Barre de recherche avec couleur d'icône personnalisée -->
        <span>Custom icon color</span>
        <u-search-bar icon-position="left" icon-color="var(--color-blue-500)" @search="handleSearch"></u-search-bar>
        <br />

        <!-- Cas 11 : Barre de recherche avec contenu pré-rempli -->
        <span>Pre-filled content</span>
        <u-search-bar v-model="value" @search="handleSearch"></u-search-bar>
        <br />

        <!-- Cas 12 : Barre de recherche avec focus -->
        <span>Focus behavior</span>
        <u-search-bar v-model="value"  @blur="handleBlur"></u-search-bar>
        <br />
      </div>
    `,
    data() {
      return {
        value: 'je suis un contenu pré-rempli',
      };
    },
    methods: {
      handleSearch() {
        alert(`Recherche effectuée : ${this.value}`);
      },
      handleFocus() {
        console.log('Input focused');
      },
      handleBlur() {
        console.log('Input blurred', this.value);
      },
    },
  });
