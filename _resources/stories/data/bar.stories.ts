import UBar from '@/modules/common/data/UBar.vue';

export default {
  title: 'data/Bar',
  component: UBar,
};

export const Bar = () => ({
  components: { UBar },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px;">
    <div style="width: auto; height: 400px;">
    <h4>Répartitions de votre base de données par CA sur 12 mois</h4>
      <p class="-description">Description</p>
      <u-bar :data="data1"
      />
    </div>
  </div>
`,
  setup() {
    const data1 = [
      ['Nouveaux', 55, 33],
      ['Réactivés', 12, 23],
      ['Bons cllients', 24, 78],
      ['Tièdes', 14, 72],
      ['Endormis', 24, 78],
      ['Inactifs', 75, 45],
    ];

    return {
      data1,
    };
  },
});
