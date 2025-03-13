import { App } from 'vue';
import ECharts from 'vue-echarts';

import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  SankeyChart,
  ScatterChart,
  ThemeRiverChart,
  FunnelChart,
} from 'echarts/charts';
import {
  SingleAxisComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent,
  LegendComponent,
  DatasetComponent,
  MarkLineComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Enregistrement des modules ECharts
echarts.use([
  // Charts
  BarChart,
  LineChart,
  PieChart,
  SankeyChart,
  ScatterChart,
  ThemeRiverChart,
  FunnelChart,
  // Composants
  SingleAxisComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent,
  LegendComponent,
  DatasetComponent,
  MarkLineComponent,
  // Renderers
  CanvasRenderer,
]);

export default {
  install(app: App) {
    // Enregistrement global du composant sous le nom "VChart"
    app.component('VChart', ECharts);
  },
} as { install: (app: App) => void };
