import { UContentWrapper, UButton } from '@/modules/ui';

export default {
  title: 'layout/ContentWrapper',
  component: UContentWrapper,
};

export const ContentWrapper = () => ({
  components: { UContentWrapper, UButton },
  template: `
    <div style="padding: 20px; display: flex; flex-direction: column; gap: 40px;">
      <!-- Exemple 1 : Placement des actions "high" -->
      <div>
        <h3>Content Wrapper - High Actions Placement</h3>
        <u-content-wrapper :actions-placement="'high'">
          Main content for high actions placement.
          <template #actions>
            <u-button
              collapsable
              class="item"
              type="primary"
              icon="icon-edit"
              :icon-size="24"
              round
              title="Edit"
              label="Edit"
              @click="editItem"
            />
            <u-button
              collapsable
              type="default"
              icon="icon-delete"
              :icon-size="24"
              round
              class="item"
              title="Delete"
              label="Delete"
              @click="deleteItem"
            />
          </template>
        </u-content-wrapper>
      </div>

      <!-- Exemple 2 : Panneau gauche uniquement avec placement des actions "low" -->
      <div>
        <h3>Content Wrapper - Left Panel Only</h3>
        <div style="position: relative; height: 300px; border: 1px solid #ccc;">
          <u-content-wrapper :actions-placement="'low'">
            <template #left>
              <p>Left panel content</p>
            </template>
            Main content with left panel.
          </u-content-wrapper>
        </div>
      </div>

      <!-- Exemple 3 : Panneau gauche et actions avec placement des actions "low" -->
      <div>
        <h3>Content Wrapper - Left Panel & Actions</h3>
        <div style="position: relative; height: 300px; border: 1px solid #ccc;">
          <u-content-wrapper :actions-placement="'low'">
            <template #left>
              <p>Left panel content</p>
            </template>
            Main content with left panel and actions.
            <template #actions>
              <u-button
                collapsable
                class="item"
                type="primary"
                icon="icon-edit"
                :icon-size="24"
                round
                title="Edit"
                label="Edit"
                @click="editItem"
              />
              <u-button
                collapsable
                type="default"
                icon="icon-delete"
                :icon-size="24"
                round
                class="item"
                title="Delete"
                label="Delete"
                @click="deleteItem"
              />
            </template>
          </u-content-wrapper>
        </div>
      </div>
      <div>
        <h3>Wrapper with Left Panel</h3>
        <u-content-wrapper :loading="false" actionsPlacement="high">
          <template #left-title>
            <h4>Left Panel Title</h4>
          </template>
          <template #left-button>
            <u-button round icon="icon-edit" type="primary" @click="editItem" />
            <u-button round icon="icon-delete" type="tertiary" @click="editItem" />
          </template>
          <template #actions>
            <u-button round icon="icon-edit" type="primary" @click="editItem" />
            <u-button round icon="icon-delete" type="tertiary" @click="editItem" />
          </template>
          <template #left>
            <p>Content in the left panel.</p>
          </template>
          <p>This is the main content area with a left panel provided.</p>
        </u-content-wrapper>
      </div>
    </div>
  `,
  setup() {
    const editItem = () => alert('Edit!');
    const deleteItem = () => alert('Delete!');

    return { editItem, deleteItem };
  },
});
