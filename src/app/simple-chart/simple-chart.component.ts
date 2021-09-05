import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Weather } from '../interfaces/weather.interface';
import data from '../../assets/data/my_weather_data.json';

import * as d3 from 'd3';

@Component({
  selector: 'app-simple-chart',
  templateUrl: './simple-chart.component.html',
  styleUrls: ['./simple-chart.component.css'],
})
export class SimpleChartComponent implements OnInit {
  @ViewChild('chart', { static: true }) chart!: ElementRef<SVGGElement>;
  @HostBinding('class.route') isRoute = true;
  constructor(private el: ElementRef<HTMLElement>) {}

  data: Array<Weather> = data;

  margins = {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  };

  private extentX!: [Date, Date];
  private extentY!: [number, number];

  private parseDate = d3.timeParse('%Y-%m-%d');
  private xAccessor = (data: Weather) => this.parseDate(data.date);
  private yAccessor = (data: Weather) => data.temperatureMax;

  ngOnInit(): void {
    this.extentX = <[Date, Date]>(
      d3.extent<Weather, Date>(this.data, this.xAccessor)
    );
    this.extentY = <[number, number]>(
      d3.extent<Weather, number>(this.data, this.yAccessor)
    );

    this.draw();
  }

  get innerWidth(): number {
    return (
      this.el.nativeElement.clientWidth - this.margins.left - this.margins.right
    );
  }

  get outerWidth() {
    return this.el.nativeElement.clientWidth;
  }

  get innerHeight(): number {
    return this.outerHeight - this.margins.top - this.margins.bottom;
  }

  get outerHeight() {
    return 400;
  }

  get yScale() {
    return d3
      .scaleLinear()
      .domain(this.extentY)
      .range([this.innerHeight, 0])
      .nice();
  }

  get xScale() {
    return d3
      .scaleTime()
      .domain(this.extentX)
      .range([0, this.innerWidth])
      .nice();
  }

  get lineGenerator() {
    const generator = d3
      .line<Weather>()
      .x((data: Weather) => this.xScale(this.xAccessor(data)!))
      .y((data: Weather) => this.yScale(this.yAccessor(data)));

    return generator(this.data);
  }

  draw() {
    const chart = d3.select(this.chart.nativeElement);
    chart.style(
      'transform',
      `translate(${this.margins.left}px, ${this.margins.top}px)`
    );

    const yAxis = chart.append('g');
    const yAxisGenerator = d3.axisLeft(this.yScale);
    yAxisGenerator(yAxis);

    const xAxis = chart.append('g');
    xAxis.style('transform', `translateY(${this.innerHeight}px)`);
    const xAxisGenerator = d3.axisBottom(this.xScale);
    xAxisGenerator(xAxis);
  }
}
