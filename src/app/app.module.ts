import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimpleChartComponent } from './simple-chart/simple-chart.component';
import { PointsChartComponent } from './points-chart/points-chart.component';
import { HistogramComponent } from './histogram/histogram.component';
import { D3SelectionDirective } from './d3-selection.directive';

@NgModule({
  declarations: [
    AppComponent,
    SimpleChartComponent,
    PointsChartComponent,
    HistogramComponent,
    D3SelectionDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
