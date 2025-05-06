import { UDataKpiCard } from '@/modules/ui';

export default {
  title: 'data/DataKpiCard',
  component: UDataKpiCard,
};

export const DataKpiCard = () => ({
  components: { UDataKpiCard },
  setup() {
    // Valeur utilisée pour les cas de tests
    const value = 1200;
    const previousValue = 1000;

    return { value, previousValue };
  },
  template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        <!-- Cas de base -->
        <div>
          <h3>Cas de base</h3>
          <u-data-kpi-card 
            title="Revenue" 
            subtitle="Monthly Revenue" 
            :value="value" 
          />
        </div>

        <!-- Avec détail KPI -->
        <div>
          <h3>Avec KPI Detail</h3>
          <u-data-kpi-card 
            title="Utilisateurs" 
            subtitle="Utilisateurs actifs" 
            :value="value" 
            kpiDetail="Detail" 
            kpiDetailSize="small" 
          />
        </div>

        <!-- Avec valeur précédente pour affichage du delta -->
        <div>
          <h3>Avec Delta (qualification numérique)</h3>
          <u-data-kpi-card 
            title="Ventes" 
            subtitle="Ventes mensuelles" 
            :value="value" 
            :previousValue="previousValue" 
          />
        </div>

        <!-- Sans qualification numérique -->
        <div>
          <h3>Sans qualification numérique</h3>
          <u-data-kpi-card 
            title="Visiteurs" 
            subtitle="Visiteurs du site" 
            :value="value" 
            :previousValue="previousValue" 
            :withNumberQualification="false" 
          />
        </div>

        <!-- Avec slot d'information -->
        <div>
          <h3>Avec Slot Info</h3>
          <u-data-kpi-card 
            title="Engagement" 
            subtitle="Engagement utilisateur" 
            :value="value" 
            :previousValue="previousValue"
          >
            <template #info>
              <span>Informations complémentaires sur l'engagement.</span>
            </template>
          </u-data-kpi-card>
        </div>

        <!-- Cas complet avec toutes les fonctionnalités -->
        <div>
          <h3>Cas complet</h3>
          <u-data-kpi-card 
            title="Profit" 
            subtitle="Profit trimestriel" 
            :value="value" 
            :previousValue="previousValue"
            kpiDetail="Détail du profit"
            kpiDetailSize="high"
            :withNumberQualification="true"
          >
            <template #info>
              <span>Informations complémentaires sur le profit.</span>
            </template>
          </u-data-kpi-card>
        </div>
      </div>
    `,
});
