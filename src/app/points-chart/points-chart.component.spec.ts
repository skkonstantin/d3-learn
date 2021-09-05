import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsChartComponent } from './points-chart.component';

describe('PointsChartComponent', () => {
  let component: PointsChartComponent;
  let fixture: ComponentFixture<PointsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
