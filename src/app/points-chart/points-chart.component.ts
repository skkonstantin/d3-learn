import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import data from '../../assets/data/my_weather_data.json';
import { Weather } from '../interfaces/weather.interface';

import * as d3 from 'd3';

@Component({
  selector: 'app-points-chart',
  templateUrl: './points-chart.component.html',
  styleUrls: ['./points-chart.component.css'],
})
export class PointsChartComponent implements OnInit {
  data: Weather[] = data;

  @ViewChild('content', { static: true }) content!: ElementRef<SVGGElement>;

  margins = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 60,
  };

  constructor(private el: ElementRef<HTMLElement>) {}

  private xAccessor = (data: Weather) => data.dewPoint;
  private yAccessor = (data: Weather) => data.humidity;
  private colorAcccesor = (data: Weather) => data.cloudCover;

  private get wrapperSize() {
    return d3.min([
      this.el.nativeElement.clientWidth,
      this.el.nativeElement.clientHeight,
    ]);
  }

  private xScale!: d3.ScaleLinear<number, number, never>;
  private yScale!: d3.ScaleLinear<number, number, never>;
  private colorScale!: d3.ScaleLinear<string, string, never>;

  get wrapperHeight() {
    return this.wrapperSize;
  }

  get wrapperWidth() {
    return this.wrapperSize;
  }

  get contentHeigth() {
    return this.wrapperHeight! - this.margins.top - this.margins.bottom;
  }

  get contentWidth() {
    return this.wrapperWidth! - this.margins.left - this.margins.right;
  }

  get contentTranslate() {
    return `translate(${this.margins.left}, ${this.margins.top})`;
  }

  get contentSelection() {
    return d3.select(this.content.nativeElement);
  }

  ngOnInit(): void {
    this.xScale = d3
      .scaleLinear()
      .domain(
        <[number, number]>d3.extent<Weather, number>(this.data, this.xAccessor)
      )
      .range([0, this.contentWidth])
      .nice();

    this.yScale = d3
      .scaleLinear()
      .domain(
        <[number, number]>d3.extent<Weather, number>(this.data, this.yAccessor)
      )
      .range([this.contentHeigth, 0])
      .nice();

    this.colorScale = d3
      .scaleLinear<string, string>()
      .domain(
        <[number, number]>(
          d3.extent<Weather, number>(this.data, this.colorAcccesor)
        )
      ) // [0, 1]
      .range(['#333', '#ccc']);

    this.drawAxis();
    this.drowDots(this.data, 'cornflowerblue');
  }

  drowDots(data: Weather[], color: string) {
    this.contentSelection
      .selectAll('circle')
      .data(data)
      //.enter() // добавить те которых нет,  merge -  замена
      .join('circle')
      .attr('cx', (d) => this.xScale(this.xAccessor(d)))
      .attr('cy', (d) => this.yScale(this.yAccessor(d)))
      .attr('r', 3)
      .attr('fill', (d) => this.colorScale(this.colorAcccesor(d)));
  }

  drawAxis() {
    const xAxisEl = this.contentSelection.select<SVGGElement>('.x-axis');
    xAxisEl.style('transform', `translateY(${this.contentHeigth}px)`);

    xAxisEl
      .append('text')
      .html('Dew point')
      .style('fill', 'currentColor')
      .style('font-size', '1rem')
      .attr('x', this.contentWidth / 2)
      .attr('y', this.margins.bottom - 10);

    const xAxis = d3.axisBottom(this.xScale)(xAxisEl);

    const yAxisEl = this.contentSelection.select<SVGGElement>('.y-axis');

    yAxisEl
      .append('text')
      .text('Relative humidity')
      .style('fill', 'currentColor')
      .style('font-size', '1rem')
      .style('transform', `rotate(-90deg)`)
      .style('text-anchor', 'middle')
      .attr('y', -this.margins.left + 20)
      .attr('x', -this.contentHeigth / 2);

    d3.axisLeft(this.yScale).ticks(4)(yAxisEl);
  }
}
