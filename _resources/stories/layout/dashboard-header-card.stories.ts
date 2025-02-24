import { ref } from 'vue';
import UDashboardHeaderCard from '@/commons/layout/UDashboardHeaderCard.vue';

export default {
  title: 'layout/UDashboardHeaderCard',
  component: UDashboardHeaderCard,
};

export const DashboardHeaderCard = () => ({
  components: { UDashboardHeaderCard },
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
      <!-- Default Header Card -->
      <div>
        <h2>Default Header Card</h2>
        <u-dashboard-header-card 
          title="Dashboard Header"
          icon="icon-dashboard"
          :lastProcessTime="defaultTime"
        >
          <template #description>
            <p>This is a default dashboard header card description.</p>
          </template>
        </u-dashboard-header-card>
      </div>

      <!-- Header Card with Dimension Slot -->
      <div>
        <h2>Header Card with Dimension Slot</h2>
        <u-dashboard-header-card 
          title="Sales Overview"
          icon="icon-sales"
          :lastProcessTime="salesTime"
        >
          <template #dimension>
            <span style="margin-left: 16px; font-weight: bold;">Q1 2025</span>
          </template>
          <template #description>
            <p>Sales increased by 20% compared to the previous quarter.</p>
          </template>
        </u-dashboard-header-card>
      </div>

      <!-- Header Card without Last Process Time -->
      <div>
        <h2>Header Card without Last Process Time</h2>
        <u-dashboard-header-card 
          title="User Engagement"
          icon="icon-users"
        >
          <template #description>
            <p>User engagement metrics and activity trends are displayed here.</p>
          </template>
        </u-dashboard-header-card>
      </div>
    </div>
  `,
  setup() {
    const defaultTime = ref(new Date());
    const salesTime = ref(new Date());
    return { defaultTime, salesTime };
  },
});
