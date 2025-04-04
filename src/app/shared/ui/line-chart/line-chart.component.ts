import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

interface ChartData {
  key: string;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 400px;
      margin: 20px 0;
      max-width: 100%;
      overflow-x: hidden;
      position: relative;
    }
    canvas {
      max-width: 100% !important;
    }
  `]
})
export class LineChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() data: ChartData[] = [];

  private chart: Chart | undefined;
  private previousDataLength = 0;

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
      window.addEventListener('resize', () => {
        if (this.chart) {
          this.chart.resize();
        }
      });
      setTimeout(() => {
        if (this.chart) {
          this.chart.resize();
          this.chart.update();
        }
      }, 300);
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['data'] &&
      !changes['data'].firstChange &&
      this.chart &&
      this.hasDataChanged(changes['data'].currentValue, changes['data'].previousValue)
    ) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  private handleResize = () => {
    if (this.chart) {
      this.chart.resize();
    }
  };

  private hasDataChanged(currentData: ChartData[], previousData: ChartData[]): boolean {
    if (!currentData || !previousData || currentData.length !== previousData.length) {
      return true;
    }
    for (let i = 0; i < Math.min(currentData.length, 5); i++) {
      if (
        currentData[i].key !== previousData[i].key ||
        currentData[i].value !== previousData[i].value
      ) {
        return true;
      }
    }
    return false;
  }

  private createChart() {
    if (!this.chartCanvas?.nativeElement) {
      console.warn('Canvas element not available');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context');
      return;
    }

    const safeData = this.data;
    this.previousDataLength = safeData.length;

    try {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: safeData.map(item => item.key),
          datasets: [{
            label: 'Valeurs',
            data: safeData.map(item => item.value),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.2,
            fill: false,
            pointRadius: safeData.length > 50 ? 0 : 3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: safeData.length > 100 ? 0 : 1000,
          },
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                font: {
                  style: 'normal'
                }
              }
            }
          },
          elements: {
            line: {
              borderWidth: 1.5,
            }
          },
          plugins: {
            tooltip: {
              enabled: safeData.length <= 100,
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  private updateChart() {
    if (!this.chart) {
      this.createChart();
      return;
    }

    try {
      const safeData = this.data;
      if (Math.abs(this.previousDataLength - safeData.length) > 50) {
        this.createChart();
        return;
      }

      this.previousDataLength = safeData.length;
      this.chart.data.labels = safeData.map(item => item.key);
      this.chart.data.datasets[0].data = safeData.map(item => item.value);
      this.chart.options.animation = {
        duration: safeData.length > 100 ? 0 : 1000
      };
      this.chart.update('none');
    } catch (error) {
      console.error('Error updating chart:', error);
      this.createChart();
    }
  }
}
