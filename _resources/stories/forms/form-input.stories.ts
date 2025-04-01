import UFormInput from '@/modules/common/forms/UFormInput.vue';
import { ref } from 'vue';

export default {
  title: 'Forms/FormInput',
};

export const FormInput = () => ({
  components: { UFormInput },
  template: `
    <div>
      <!-- Input de base sans label -->
      <u-form-input
        v-model="value"
        placeholder="type in a value"
        :error="!value ? 'Champ obligatoire' : null"
      />

      <!-- Input avec label simple -->
      <u-form-input
        v-model="enumValue"
        label="Label"
        placeholder="type in a value"
        :error="!value ? 'Champ obligatoire' : null"
      />

      <!-- Input de type number -->
      <u-form-input
        v-model="numberValue"
        label="Number"
        type="number"
        placeholder="type in a value"
      />

      <!-- Input de type date -->
      <u-form-input
        v-model="dateValue"
        label="Date"
        type="date"
        placeholder="type in a value"
      />

      <!-- Input de type enum -->
      <u-form-input
        v-model="enumValue"
        :enum-options="enumOptions"
        type="enum"
        label="Enum"
        placeholder="type in a value"
        :error="!enumValue && enumOptions.length ? 'Champ obligatoire' : null"
      />

      <!-- Input avec option closable -->
      <u-form-input
        v-model="value"
        label="Closable input"
        placeholder="type in a value"
        closable
      />

      <!-- Input avec label complexe via slot -->
      <u-form-input @close="close" v-model="value" placeholder="type in a value" closable>
        <template #label>
          <b>Complex label</b>
          <small>(wow)</small>
        </template>
      </u-form-input>

      <!-- Textarea -->
      <u-form-input
        v-model="value"
        label="Text area"
        placeholder="type in a value"
        type="textarea"
        :error="!value ? 'Champ obligatoire' : null"
      />

      <!-- Input custom via slot -->
      <u-form-input label="Custom input" :error="!value ? 'Champ obligatoire' : null">
        <template #input>
          <input
            type="password"
            v-model="value"
            placeholder="type in a value"
          />
        </template>
      </u-form-input>
    </div>
  `,
  setup() {
    const value = ref('coucou');
    const numberValue = ref(42);
    const enumValue = ref('');
    const enumOptions = ref([
      { value: 'do', label: 'Do', icon: 'icon-add' },
      { value: 're', label: 'Re' },
      { value: 'mi', label: 'Mi' },
      { value: 'fa', label: 'Fa' },
      { value: 'sol', label: 'Sol' },
      { value: 'la', label: 'La' },
    ]);
    const dateValue = ref(new Date());

    const close = () => {
      console.log('close');
    };

    return {
      value,
      numberValue,
      enumValue,
      enumOptions,
      dateValue,
      close,
    };
  },
});
