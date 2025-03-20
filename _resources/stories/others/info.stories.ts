import UInfo from '@/modules/common/others/UInfo.vue';
export default {
  title: 'Others/Info',
};

export const Info = () => ({
  components: { UInfo },
  template: `
  <div>
    <u-info>
      <p><b>Behold!</b> I am a magnificent tooltip.</p>
      <p><u>Here's why</u> :</p>
      <ul>
        <li>I'm awesome</li>
        <li>I can display a lot of thingies</li>
        <li>No one reads the third line anyway</li>
        <li>I use slots</li>
      </ul>
    </u-info>
  </div>
  `,
});
