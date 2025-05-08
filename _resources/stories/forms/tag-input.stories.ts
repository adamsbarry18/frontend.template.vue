import { UTagInput } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'Forms/TagInput',
};

export const TagInput = () => ({
  components: { UTagInput },
  template: `
    <div>
      <!-- Tag Input de base -->
      <u-tag-input
        :values="basicTags"
        width="400px"
        @change="onChangeBasic"
        @tag-click="onTagClick"
      />

      <!-- Tag Input avec limite d'affichage (collapsed) -->
      <u-tag-input
        :values="collapsedTags"
        :collapseLimit="3"
        width="400px"
        @change="onChangeCollapsed"
      />

      <!-- Tag Input avec autocompletion -->
      <u-tag-input
        :values="autocompleteTags"
        autocompletion
        :enumOptions="enumOptions"
        type="string"
        width="400px"
        @change="onChangeAutocomplete"
        @query-search-async="onQuerySearch"
      />

      <!-- Tag Input en mode désactivé -->
      <u-tag-input
        :values="disabledTags"
        disabled
        width="400px"
      />

      <!-- Tag Input avec slot personnalisé pour le tooltip -->
      <u-tag-input :values="customTooltipTags" width="400px">
        <template #tooltip="{ tag }">
          <div>
            <strong>Info :</strong> {{ tag.value }}
          </div>
        </template>
      </u-tag-input>
    </div>
  `,
  setup() {
    // Exemple de tags de base
    const basicTags = ref([
      { value: 'Tag1' },
      { value: 'Tag2', icon: 'icon-star', color: 'red' },
      { value: 'Tag3' },
    ]);

    // Exemple de tags avec collapse (limite affichée à 3 tags)
    const collapsedTags = ref([
      { value: 'Tag A' },
      { value: 'Tag B' },
      { value: 'Tag C' },
      { value: 'Tag D' },
      { value: 'Tag E' },
    ]);

    // Tag Input avec autocompletion
    const autocompleteTags = ref([]);
    const enumOptions = ref([
      { value: 'opt1', label: 'Option 1', icon: 'icon-check', color: 'green' },
      { value: 'opt2', label: 'Option 2', icon: 'icon-check', color: 'blue' },
      { value: 'opt3', label: 'Option 3' },
    ]);

    // Exemple en mode désactivé
    const disabledTags = ref([{ value: 'Disabled Tag 1' }, { value: 'Disabled Tag 2' }]);

    // Exemple avec tooltip personnalisé via slot
    const customTooltipTags = ref([{ value: 'Custom Tooltip Tag' }]);

    // Gestion des événements
    const onChangeBasic = (newTags: any) => {
      basicTags.value = newTags;
    };

    const onChangeCollapsed = (newTags: any) => {
      collapsedTags.value = newTags;
    };

    const onChangeAutocomplete = (newTags: any) => {
      autocompleteTags.value = newTags;
    };

    const onQuerySearch = ({ queryString, cb }: { queryString: any; cb: any }) => {
      // Simule une recherche asynchrone dans enumOptions
      const results = enumOptions.value
        .filter((option) => option.label.toLowerCase().includes(queryString.toLowerCase()))
        .map((option) => ({ value: option.value, label: option.label }));
      cb(results);
    };

    const onTagClick = (tag: any) => {
      console.log('Tag cliqué :', tag);
    };

    return {
      basicTags,
      collapsedTags,
      autocompleteTags,
      enumOptions,
      disabledTags,
      customTooltipTags,
      onChangeBasic,
      onChangeCollapsed,
      onChangeAutocomplete,
      onQuerySearch,
      onTagClick,
    };
  },
});
