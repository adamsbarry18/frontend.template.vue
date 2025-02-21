import UButton from '@/commons/basic/UButton.vue';
import IconBase from '@/commons/icones/IconBase.vue';
import UTabPane from '@/commons/navigation/UTabPane.vue';
import UTabs from '@/commons/navigation/UTabs.vue';
import URadio from '@/commons/forms/URadio.vue'; // Import URadio
import { ref } from 'vue';

export default {
  title: 'Navigation/Tabs',
};

export const Tabs = () => ({
  // Changed the name to be more descriptive
  components: { UTabs, UTabPane, UButton, IconBase, URadio }, // Include URadio
  template: `
    <div>
      <h3 style="margin-top:20px">Basic Tabs</h3>
      <u-tabs v-model="basicActive" @tab-click="logEvent">
        <u-tab-pane index="1" label="User" icon="icon-user">User Content</u-tab-pane>
        <u-tab-pane index="2" label="Config" icon="icon-settings">Config Content</u-tab-pane>
        <u-tab-pane index="3" label="Role" disabled>Role Content</u-tab-pane>
      </u-tabs>

      <h3 style="margin-top:20px">Card Tabs</h3>
      <u-tabs v-model="cardActive" type="card" >
        <u-tab-pane index="1" label="User">User Content</u-tab-pane>
        <u-tab-pane index="2" label="Config"  icon="icon-settings">Config Content</u-tab-pane>
        <u-tab-pane index="3" label="Role">Role Content</u-tab-pane>
      </u-tabs>


      <h3 style="margin-top:20px">Border Card Tabs</h3>
      <u-tabs v-model="borderCardActive" type="border-card">
        <u-tab-pane index="1" label="User" icon="icon-user">User Content</u-tab-pane>
        <u-tab-pane index="2" label="Config" icon="icon-settings">Config Content</u-tab-pane>
        <u-tab-pane index="3" label="Role" disabled>Role Content</u-tab-pane>
        <u-tab-pane index="4" label="Error" error>Error Content</u-tab-pane>
      </u-tabs>

      <h3 style="margin-top:20px">Tab Positions</h3>
      <u-radio v-model="tabPosition" :options="tabPositionOptions" :button="true" style="margin-bottom: 20px;"/>

      <u-tabs v-model="positionedActive" :tab-position="tabPosition" style="height: 250px">
        <u-tab-pane index="1" label="User">User Content</u-tab-pane>
        <u-tab-pane index="2" label="Config">Config Content</u-tab-pane>
        <u-tab-pane index="3" label="Role">Role Content</u-tab-pane>
      </u-tabs>

      <h3 style="margin-top:20px">Closable Tabs</h3>
      <u-tabs v-model="closableActive" type="card" closable @tab-remove="removeTab">
        <u-tab-pane index="1" label="Tab 1">Tab 1 Content</u-tab-pane>
        <u-tab-pane index="2" label="Tab 2">Tab 2 Content</u-tab-pane>
        <u-tab-pane index="3" label="Tab 3">Tab 3 Content</u-tab-pane>
      </u-tabs>

      <h3 style="margin-top:20px">Editable Tabs (Add/Remove)</h3>
      <u-tabs v-model="editableActive" type="card" @tab-remove="removeTab">
        <u-tab-pane v-for="(tab, index) in editableTabs" :key="tab.name" :index="tab.name" :label="tab.title" closable>
          {{ tab.content }}
        </u-tab-pane>
      </u-tabs>
      <u-button style="margin-top: 20px" size="small" @click="addTab">Add Tab</u-button>

      <h3 style="margin-top:20px">Custom class name</h3>
        <u-tabs v-model="customClassActive" custom-class="custom-tabs-class">
            <u-tab-pane index="1" label="Tab 1">Tab 1 Content</u-tab-pane>
            <u-tab-pane index="2" label="Tab 2">Tab 2 Content</u-tab-pane>
        </u-tabs>
    </div>
    `,
  setup() {
    const basicActive = ref('1');
    const cardActive = ref('1');
    const borderCardActive = ref('1');
    const positionedActive = ref('1');
    const closableActive = ref('1');
    const editableActive = ref('1');
    const customClassActive = ref('1');
    const tabPosition = ref('top');

    // Options for URadio
    const tabPositionOptions = ref([
      { label: 'Top', value: 'top' },
      { label: 'Right', value: 'right' },
      { label: 'Bottom', value: 'bottom' },
      { label: 'Left', value: 'left' },
    ]);

    const editableTabs = ref([
      { title: 'Tab 1', name: '1', content: 'Tab 1 content' },
      { title: 'Tab 2', name: '2', content: 'Tab 2 content' },
    ]);
    let tabIndex = editableTabs.value.length + 1;

    const addTab = () => {
      const newTabName = `${tabIndex++}`;
      editableTabs.value.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content',
      });
      editableActive.value = newTabName; // Set as active
    };

    const removeTab = (targetName: string) => {
      const tabs = editableTabs.value;
      let activeName = editableActive.value;

      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
      editableActive.value = activeName; //update the v-model
    };

    const logEvent = (...args: any[]) => {
      console.log(...args);
    };

    return {
      basicActive,
      cardActive,
      borderCardActive,
      positionedActive,
      closableActive,
      editableActive,
      customClassActive,
      tabPosition,
      tabPositionOptions,
      removeTab,
      editableTabs,
      addTab,
      logEvent,
    };
  },
});
