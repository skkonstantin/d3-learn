import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import data from '../../assets/data/my_weather_data.json';
import { D3SelectionDirective } from '../d3-selection.directive';
import { Weather } from '../interfaces/weather.interface';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { extent, bin, Bin, max, mean } from 'd3-array';
import { axisBottom } from 'd3-axis';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css'],
})
export class HistogramComponent implements OnInit {
  @ViewChild('wrapper', { static: true }) wrapperEl!: ElementRef<SVGElement>;
  @ViewChild('content', { static: true, read: D3SelectionDirective })
  contentEl!: D3SelectionDirective;

  data: Weather[] = data;

  margins = {
    top: 30,
    right: 10,
    bottom: 50,
    left: 50,
  };

  scaleX!: ScaleLinear<number, number, never>;
  scaleY!: ScaleLinear<number, number, never>;

  constructor(private el: ElementRef<HTMLElement>) {}

  private xAccessor = (d: Weather) => d.humidity;
  private yAccessor = (d: ArrayLike<any>) => d.length;

  get wrapperWidth() {
    return Math.round(this.el.nativeElement.clientWidth);
  }

  get wrapperHeight() {
    return Math.round(this.wrapperWidth * 0.6);
  }

  get contentWidth() {
    return this.wrapperWidth - this.margins.left - this.margins.right;
  }

  get contentHegiht() {
    return this.wrapperHeight - this.margins.top - this.margins.bottom;
  }

  get contentTranslate() {
    return `translate(${this.margins.left}, ${this.margins.top})`;
  }

  ngOnInit(): void {
    this.scaleX = scaleLinear()
      .domain(
        <[number, number]>extent<Weather, number>(this.data, this.xAccessor)
      )
      .range([0, this.contentWidth])
      .nice();

    const binsGenerator = bin<Weather, number>()
      .domain(<[number, number]>this.scaleX.domain())
      .value(this.xAccessor)
      .thresholds(12);
    const bins = binsGenerator(this.data);

    this.scaleY = scaleLinear()
      .domain(<[number, number]>extent(bins, this.yAccessor))
      .range([this.contentHegiht, 0])
      .nice();

    this.draw(bins);
    this.drawMean();
    this.drawAxis();
  }

  drawAxis() {
    const content = this.contentEl.getSelection<SVGGElement>();
    const axisGroup = content.append('g').attr('class', 'axis-group');

    const xAxis = axisGroup
      .append('g')
      .style('transform', `translateY(${this.contentHegiht}px)`);

    const xAxisLabel = xAxis
      .append('text')
      .text('Humidity')
      .attr('fill', 'black')
      .attr('x', this.contentWidth / 2)
      .attr('y', this.margins.bottom - 10)
      .attr('fill', '#000')
      .style('font-size', '1.4em')
      .style('text-anchor', 'middle');

    axisBottom(this.scaleX)(xAxis);
  }

  drawMean() {
    const content = this.contentEl.getSelection<SVGGElement>();
    const meanValue = mean(this.data, this.xAccessor);
    const meanGroup = content.append('g').attr('class', 'mean-group');
    meanGroup
      .append('line')
      .attr('x1', this.scaleX(meanValue!))
      .attr('y1', -15)
      .attr('x2', this.scaleX(meanValue!))
      .attr('y2', this.contentHegiht)
      .attr('stroke', 'maroon')
      .style('stroke-dasharray', '2px 4px');

    meanGroup
      .append('text')
      .attr('x', this.scaleX(meanValue!))
      .attr('y', -20)
      .text('mean')

      .attr('fill', 'maroon')
      .style('font-size', '12px')
      .style('text-anchor', 'middle');
  }
  draw(bins: Bin<Weather, number>[]) {
    const content = this.contentEl.getSelection<SVGGElement>();
    const binsEl = content.append('g').attr('class', 'bins-group');

    const barPadding = 4;

    const binGroups = binsEl.selectAll('g').data(bins).join('g');

    const barRects = binGroups
      .append('rect')
      .attr('x', (d) => this.scaleX(d.x0!) + barPadding / 2)
      .attr('y', (d) => this.scaleY(this.yAccessor(d)))
      .attr(
        'width',
        (d) =>
          max<number>([
            0,
            this.scaleX(d.x1!) - this.scaleX(d.x0!) - barPadding,
          ])!
      )
      .attr(
        'height',
        (d) => this.contentHegiht - this.scaleY(this.yAccessor(d))
      )
      .attr('fill', 'cornflowerblue');

    const barTexts = binGroups
      .filter((x) => this.yAccessor(x) !== 0)
      .append('text')
      .text(this.yAccessor)
      .attr(
        'x',
        (d) =>
          this.scaleX(d.x0!) + +(this.scaleX(d.x1!) - this.scaleX(d.x0!)) / 2
      )
      .attr('y', (d) => this.scaleY(this.yAccessor(d)) - 5)
      .style('text-anchor', `middle`)
      .attr('fill', '#666')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif');
  }
}
