import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistogramComponent } from './histogram/histogram.component';
import { PointsChartComponent } from './points-chart/points-chart.component';
import { SimpleChartComponent } from './simple-chart/simple-chart.component';

const routes: Routes = [
  {
    path: 'simple-chart',
    component: SimpleChartComponent,
  },
  {
    path: 'pointer-chart',
    component: PointsChartComponent,
  },
  {
    path: 'histogram',
    component: HistogramComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
