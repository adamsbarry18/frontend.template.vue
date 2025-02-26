import UAccordion from '@/commons/others/UAccordion.vue';
import UAccordionItem from '@/commons/others/UAccordionItem.vue';
import IconBase from '@/commons/icons/IconBase.vue';

export default {
  title: 'Others/Accordion',
};

export const Accordion = () => ({
  components: { UAccordion, UAccordionItem, IconBase },
  template: `
    <div style="background-color: white; width: 232px; height: 450px">
      <u-accordion v-model="activeItem" @change="onChange">
        <u-accordion-item name="acquire">
          <div slot="title">
            <icon-base icon="icon-acquire" :size="24" />
            <span>Acquire</span>
          </div>
          <ul>
            <li>Product life cycle</li>
            <li>Store</li>
            <li>Weather</li>
            <li>Persona</li>
            <li>Loyalty</li>
            <li>Persona</li>
            <li>Loyalty</li>
            <li>Moment of the lifeee</li>
          </ul>
        </u-accordion-item>
        <u-accordion-item name="convert">
          <div slot="title">
            <icon-base icon="icon-convert" :size="24" />
            <span>Convert</span>
          </div>
          <ul>
            <li>Product life cycle</li>
            <li>Store</li>
            <li>Weather</li>
            <li>Persona</li>
            <li>Lorem</li>
            <li>Ipsum</li>
            <li>Store</li>
            <li>Weather</li>
            <li>Persona</li>
            <li>Lorem</li>
            <li>Ipsum</li>
            <li>Dolor</li>
            <li>Sit amet</li>
            <li>Lorem</li>
            <li>Ipsum</li>
            <li>Dolor</li>
            <li>Sit amet</li>
            <li>Thug life</li>
            <li>Lorem</li>
            <li>Ipsum</li>
            <li>Dolor</li>
            <li>Sit amet</li>
            <li>Thug life</li>
            <li>Loyalty</li>
            <li>Moment of the lifeee</li>
          </ul>
        </u-accordion-item>
        <u-accordion-item name="fidelize">
          <div slot="title">
            <icon-base icon="icon-fidelize" :size="24" />
            <span>Fidelize</span>
          </div>
          <ul>
            <li>Product life cycle</li>
            <li>Store</li>
            <li>Weather</li>
            <li>Persona</li>
            <li>Weather</li>
            <li>Persona</li>
            <li>Loyalty</li>
            <li>Moment of the lifeee</li>
          </ul>
        </u-accordion-item>
      </u-accordion>
    </div>
    `,
  methods: {
    onChange(value) {
      console.log('Item changed', value);
    },
  },
  data() {
    return {
      activeItem: 'convert',
    };
  },
});
