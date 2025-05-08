import { UPasswordInput } from '@/modules/ui';
import { ref, computed } from 'vue';

export default {
  title: 'Forms/PasswordInput',
};

export const PasswordInput = () => ({
  components: { UPasswordInput },

  template: `
    <div>
      <u-password-input progress :error="input===''" @change="handleChanges"  :rules="rules" v-model="input"/>
      <span>length >= 8: {{ lengthCheck(input) ? 'true' : 'false' }}</span><br/>
      <span>Number: {{ numberCheck(input) ? 'true' : 'false' }}</span><br/>
      <span>Uppercase: {{ uppercaseCheck(input) ? 'true' : 'false' }}</span><br/>
      <span>Special Character: {{ specialCharacterCheck(input) ? 'true' : 'false' }}</span><br/>
      <u-password-input @change="handleChanges" disabled v-model="input"/>
      <u-password-input label="Nouveau mot de passe" @change="handleChanges" v-model="input"/>
    </div>
  `,
  setup() {
    const input = ref('123Ab/');

    const rules = computed(() => [
      lengthCheck,
      numberCheck,
      uppercaseCheck,
      specialCharacterCheck,
      charPoint,
    ]);

    const handleChanges = (value: string) => {
      console.log('Password changed:', value);
    };

    const charPoint = (value: string) => (value.length > 0 ? value.length : null);
    const lengthCheck = (value: string) => (value.length >= 8 ? 15 : null);
    const numberCheck = (value: string) => (/[0-9]/.test(value) ? 15 : null);
    const uppercaseCheck = (value: string) => (/[A-Z]/.test(value) ? 15 : null);
    const specialCharacterCheck = (value: string) => {
      const regex = new RegExp('[!@#$%^&*()_+\-=[]{};\':"\\|,.<>/?]+');
      return regex.test(value) ? 15 : null;
    };

    return {
      input,
      rules,
      handleChanges,
      charPoint,
      lengthCheck,
      numberCheck,
      uppercaseCheck,
      specialCharacterCheck,
    };
  },
});
