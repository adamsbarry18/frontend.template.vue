import { ref } from 'vue';
import { USelectGroup } from '@/modules/ui';
import { UButton } from '@/modules/ui/basic';

export default {
  title: 'Forms/SelectGroup',
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    filterable: { control: 'boolean' },
    multiple: { control: 'boolean' },
    groupBy: { control: 'text' },
    clearable: { control: 'boolean' },
    automaticDropdown: { control: 'boolean' },
  },
};

export const SelectGroup = () => ({
  components: { USelectGroup, UButton },
  template: `
    <div style="padding: 16px;">
      <!-- Simple Select -->
      <section style="margin-bottom: 24px;">
        <h3>Simple Select</h3>
        <u-select-group v-model="simpleValue" :options="simpleOptions" placeholder="Select an option" />
        <p>Selected Value: {{ simpleValue }}</p>
      </section>

      <!-- Select with Initial Value -->
      <section style="margin-bottom: 24px;">
        <h3>Select with inital Value Set</h3>
        <u-select-group v-model="initialValue" :options="simpleOptions" placeholder="Select an option" />
        <p>Selected Value: {{ initialValue }}</p>
      </section>

      <!-- Select with Fallback label -->
      <section style="margin-bottom: 24px;">
        <h3>Select with Fallback label</h3>
        <u-select-group v-model="fallbackValue" :options="simpleOptions" fallback-label="No data Founded" placeholder="Select an option" />
        <p>Selected Value: {{ fallbackValue }}</p>
      </section>

      <!-- Simple Clearable Select -->
      <section style="margin-bottom: 24px;">
        <h3>Simple Clearable Select</h3>
        <u-select-group v-model="clearableValue" :options="simpleOptions" placeholder="Select an option" clearable />
        <p>Selected Value: {{ clearableValue }}</p>
      </section>

      <!-- Disabled Select -->
      <section style="margin-bottom: 24px;">
        <h3>Disabled Select</h3>
        <u-select-group v-model="disabledValue" :options="simpleOptions" :disabled="true" placeholder="Disabled select" />
        <p>Selected Value: {{ disabledValue }}</p>
      </section>

        <!-- Disabled select with initial value -->
       <section style="margin-bottom: 24px;">
        <h3>Disabled select with initial value</h3>
        <u-select-group v-model="disabledInitialValue" :options="simpleOptions" :disabled="true" placeholder="Disabled select" />
        <p>Selected Value: {{ disabledInitialValue }}</p>
      </section>

      <!-- Filterable Select-->
       <section style="margin-bottom: 24px;">
        <h3>Filterable Select</h3>
        <u-select-group v-model="filterableValue" :options="simpleOptions" :filterable="true" placeholder="Filterable select" />
        <p>Selected Value: {{ filterableValue }}</p>
      </section>

      <!-- Multiple Select -->
      <section style="margin-bottom: 24px;">
        <h3>Multiple Select</h3>
        <u-select-group v-model="multipleValue" :options="simpleOptions" :multiple="true" placeholder="Select multiple options" />
        <p>Selected Values: {{ multipleValue }}</p>
      </section>

       <!-- Multiple Select With Limit -->
      <section style="margin-bottom: 24px;">
        <h3>Multiple Select With Limit (limit 2)</h3>
        <u-select-group v-model="limitedMultipleValue" :options="simpleOptions" :multiple="true" :multiple-limit="2" placeholder="Select up to 2 options" />
        <p>Selected Values: {{ limitedMultipleValue }}</p>
      </section>

        <!-- Multiple select with clearable -->
        <section style="margin-bottom: 24px;">
            <h3>Multiple Select with clearable</h3>
            <u-select-group v-model="multipleClearableValue" :options="simpleOptions" :multiple="true" clearable placeholder="Select multiple options" />
            <p>Selected Values: {{ multipleClearableValue }}</p>
        </section>

      <!-- Grouped Options -->
      <section style="margin-bottom: 24px;">
        <h3>Grouped Options</h3>
        <u-select-group v-model="groupedValue" :options="groupedOptions" group-by="group" placeholder="Select an option" />
        <p>Selected Value: {{ groupedValue }}</p>
      </section>

      <!-- Group With label false Options -->
      <section style="margin-bottom: 24px;">
        <h3>Group With label false Options</h3>
        <u-select-group v-model="groupedNoLabelValue" :options="groupedOptions" :with-group-label="false" group-by="group" placeholder="Select an option" />
        <p>Selected Value: {{ groupedNoLabelValue }}</p>
      </section>

      <!-- Automatic Dropdown -->
      <section style="margin-bottom: 24px;">
        <h3>Automatic Dropdown</h3>
        <u-select-group v-model="automaticDropdownValue" :options="simpleOptions" :automatic-dropdown="true" placeholder="Select an option" />
        <p>Selected Value: {{ automaticDropdownValue }}</p>
      </section>

      <!-- Select with Prefix Icon -->
      <section style="margin-bottom: 24px;">
        <h3>Select with Prefix Icon</h3>
        <u-select-group v-model="iconValue" :options="optionsWithIcons" icon="icon-search" placeholder="Select with icon" />
        <p>Selected Value: {{ iconValue }}</p>
      </section>

        <!-- Select with dynamically changing icon -->
        <section style="margin-bottom: 24px;">
            <h3>Select with dynamically changing icon</h3>
            <u-select-group v-model="dynamicIconValue" :options="optionsWithIcons" :icon="dynamicIcon" placeholder="Select with dynamic icon" />
            <u-button @click="toggleIcon">Toggle Icon</u-button>
            <p>Selected Value: {{ dynamicIconValue }}</p>
        </section>
        <!-- Select with very long text -->
        <section style="margin-bottom: 24px;">
          <h3>Select with very long text</h3>
          <u-select-group v-model="longTextValue" :options="longTextOptions" placeholder="Select an option" />
          <p>Selected Value: {{ longTextValue }}</p>
        </section>
      <!-- Select with no options -->
      <section style="margin-bottom: 24px;">
        <h3>Select with no options</h3>
        <u-select-group v-model="noOptionsValue" :options="[]" placeholder="No options available" />
        <p>Selected Value: {{ noOptionsValue }}</p>
      </section>
        <!-- Select with custom option rendering -->
      <section style="margin-bottom: 24px;">
        <h3>Select with custom option rendering</h3>
        <u-select-group v-model="customRenderValue" :options="simpleOptions" >
            <template #option="{ option }">
              <span style="font-style: italic;">{{ option.label }}</span>
            </template>
        </u-select-group>
        <p>Selected Value: {{ customRenderValue }}</p>
      </section>
      <!-- Select with Tooltips -->
      <section style="margin-bottom: 24px;">
        <h3>Select with Tooltips</h3>
        <u-select-group v-model="tooltipValue" :options="optionsWithTooltips" placeholder="Hover for tooltip" />
        <p>Selected Value: {{ tooltipValue }}</p>
      </section>

       <!-- Select with Suffix -->
      <section style="margin-bottom: 24px;">
        <h3>Select with Suffix</h3>
        <u-select-group v-model="suffixValue" :options="optionsWithSuffixes" placeholder="Select an option" />
        <p>Selected Value: {{ suffixValue }}</p>
      </section>
    </div>
  `,
  setup() {
    const simpleValue = ref(null);
    const initialValue = ref('option2'); // Setting an initial value
    const clearableValue = ref(null);
    const disabledValue = ref(null);
    const disabledInitialValue = ref('option1'); // Initial value for disabled select
    const filterableValue = ref(null);
    const multipleValue = ref([]);
    const limitedMultipleValue = ref([]);
    const multipleClearableValue = ref([]);
    const groupedValue = ref(null);
    const groupedNoLabelValue = ref(null);
    const automaticDropdownValue = ref(null);
    const iconValue = ref(null);
    const dynamicIcon = ref('icon-add'); // Initial icon
    const dynamicIconValue = ref(null);
    const tooltipValue = ref(null);
    const suffixValue = ref(null);
    const fallbackValue = ref(null);
    const customValue = ref(null);
    const customRenderValue = ref(null);
    const noOptionsValue = ref(null);
    const longTextValue = ref(null);

    const simpleOptions = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];

    const groupedOptions = [
      { label: 'Option A1', value: 'a1', group: 'Group A' },
      { label: 'Option A2', value: 'a2', group: 'Group A' },
      { label: 'Option B1', value: 'b1', group: 'Group B' },
      { label: 'Option B2', value: 'b2', group: 'Group B' },
    ];

    const optionsWithIcons = [
      { label: 'Option 1', value: 'option1', icon: 'icon-add' },
      { label: 'Option 2', value: 'option2', icon: 'icon-add' },
      { label: 'Option 3', value: 'option3', icon: 'icon-add' },
    ];

    const optionsWithTooltips = [
      {
        label: 'Option 1 with tooltip',
        value: 'tool1',
        tooltip: 'This is option 1',
      },
      {
        label: 'Option 2 with tooltip',
        value: 'tool2',
        tooltip: 'This is option 2',
      },
      { label: 'Option 3', value: 'tool3' },
    ];

    const optionsWithSuffixes = [
      { label: 'Option 1', value: 'suffix1', suffix: '(S1)' },
      { label: 'Option 2', value: 'suffix2', suffix: '(S2)' },
      { label: 'Option 3', value: 'suffix3' },
    ];

    const longTextOptions = [
      {
        label:
          'This is a very long option text that should test how the select handles long text and ellipsis',
        value: 'long1',
      },
      {
        label: 'Another very long option text to check word wrapping and overall layout',
        value: 'long2',
      },
    ];

    const toggleIcon = () => {
      dynamicIcon.value = dynamicIcon.value === 'icon-add' ? 'icon-search' : 'icon-add';
    };

    return {
      simpleValue,
      initialValue,
      clearableValue,
      disabledValue,
      disabledInitialValue,
      filterableValue,
      multipleValue,
      limitedMultipleValue,
      multipleClearableValue,
      groupedValue,
      groupedNoLabelValue,
      automaticDropdownValue,
      iconValue,
      dynamicIcon,
      dynamicIconValue,
      toggleIcon,
      tooltipValue,
      suffixValue,
      fallbackValue,
      customValue,
      customRenderValue,
      noOptionsValue,
      longTextValue,
      simpleOptions,
      groupedOptions,
      optionsWithIcons,
      optionsWithTooltips,
      optionsWithSuffixes,
      longTextOptions,
    };
  },
});
