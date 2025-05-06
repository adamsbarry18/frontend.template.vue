import { ref } from 'vue';
import { UDatePicker } from '@/modules/ui';

export default {
  title: 'Forms/DatePicker',
};

export const DatePicker = () => ({
  components: { UDatePicker },
  template: `
      <div style="padding: 16px;">
        <!-- Default Case -->
        <section style="margin-bottom: 24px;">
          <h3>Default DatePicker</h3>
          <u-date-picker v-model="defaultDate"/>
          <p style="margin-top: 10px;">Selected Date: {{ defaultDate }}</p>
        </section>

        <!-- DateTime Picker -->
        <section style="margin-bottom: 24px;">
          <h3>DateTime Picker</h3>
          <u-date-picker v-model="dateTimeValue" type="datetime" />
          <p style="margin-top: 10px;">Selected Range: {{ dateTimeValue }}</p>
        </section>
  
        <!-- Range Picker -->
        <section style="margin-bottom: 24px;">
          <h3>Date Range Picker</h3>
          <u-date-picker v-model="rangeDate" type="daterange" />
          <p style="margin-top: 10px;">Selected Range: {{ rangeDate }}</p>
        </section>
  
        <!-- Disabled Picker -->
        <section style="margin-bottom: 24px;">
          <h3>Disabled DatePicker</h3>
          <u-date-picker v-model="disabledDate" :disabled="true" />
          <p style="margin-top: 10px;">Selected Date: {{ disabledDate }}</p>
        </section>
      </div>
    `,
  setup() {
    const defaultDate = ref(null);
    const rangeDate = ref([]);
    const disabledDate = ref(null);
    const dateTimeValue = ref(null);

    return {
      defaultDate,
      dateTimeValue,
      rangeDate,
      disabledDate,
    };
  },
});
