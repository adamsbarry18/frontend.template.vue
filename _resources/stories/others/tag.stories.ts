import { UTag } from '@/modules/ui';

export default {
  title: 'Others/Tag',
};

export const Tag = () => ({
  components: { UTag },
  template: `
    <div>
      <u-tag icon="icon-explore">
        <span>Saucisse</span>
      </u-tag>
      <u-tag icon="icon-active">
        <span>Merguez</span>
      </u-tag>
      <u-tag icon="icon-success" background-color="var(--color-green-200)" color="var(--color-neutral-800)" >
        <span>Lorem ipsum dolor sit amet</span>
      </u-tag>
    </div>
    `,
});
