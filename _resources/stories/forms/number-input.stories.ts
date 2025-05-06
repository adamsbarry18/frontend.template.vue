import { UNumberInput } from '@/modules/ui';

export default {
  title: 'Forms/NumberInput',
};

export const NumberInput = () => ({
  components: { UNumberInput },
  template: `
  <div>
  <span>New parameters exist!</span>
  <ul>
  <li>
  <strong>resetable</strong>: {
    type: Boolean,
    default: false,
  },Allows to say if the input can be reset 
  </li>
  <li>
  <strong>resetValue</strong>: {
    type: Number,
    default: null,
  }, Reset value of the input. (ex : 0)
  </li>
  <li>
  <strong>alignStyle</strong>: {
    type: String,
    default: 'center',
  } Allows you to specify the alignment of the input ('left', 'center', 'right') </li>
  </ul>
    Input désactivé.
    <u-number-input v-model="disabledNumber" disabled style="width: 150px" resetable />
    <br />
    Resetable input without any reset value or alignment accuracy
    <u-number-input style="width: 150px" resetable />
    <br />
    Resetable incremental input at reset-value = '0,5'
    <u-number-input v-model="number" style="width: 250px" resetable :reset-value="0.5" />
    <br />
    Incremental input with label and reset-value = '10' and center aligned
    <u-number-input v-model="saucisses" style="width: 632px" label="saucisses" resetable :reset-value="10" align="center" />
    <br />
    Incrementable input with label and reset-value = '1' and left aligned
    <u-number-input v-model="jambons" style="width: 250px" :step="1" label="jambons" resetable :reset-value="1" align="left"/>
    <br />
    Resetable incremental input at reset-value = '3' and right aligned.
    <u-number-input v-model="novalue" style="width: 250px" :step="1" resetable :reset-value="3" align="right" />
    <br />
    Input resetable at reset-value = '50' and left aligned
    <u-number-input style="width: 150px" :step="0" resetable :reset-value="50" align="left" />
  </div>
  `,
  setup() {
    const disabledNumber = 35;
    const number = 0;
    const saucisses = 10;
    const jambons = 0;
    const novalue = null;

    return {
      disabledNumber,
      saucisses,
      jambons,
      number,
      novalue,
    };
  },
});
