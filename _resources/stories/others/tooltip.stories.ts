import UTooltip from '@/modules/common/others/UTooltip.vue';

export default {
  title: 'Others/Tooltip',
};

export const Tooltip = () => ({
  components: { UTooltip },
  template: `
    <div>
      <u-tooltip placement="right"">
        <template #content>
          <p><b>Behold!</b> I am a magnificent tooltip.</p>
          <p><u>Here's why</u> :</p>
          <ul>
            <li>I'm awesome</li>
            <li>I can display a lot of thingies</li>
            <li>No one reads the third line anyway</li>
            <li>I use slots</li>
          </ul>
        </template>
        <span>hover me</span>
      </u-tooltip>
    </div>
  `,
});
