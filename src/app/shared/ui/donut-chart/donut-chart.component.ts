import { Component, OnInit, Input } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from '../../../pages/dashboard/model/dashboard.model'
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
  ],
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {
  @Input() set data(chartData: ChartData[]) {
    this.updateChart(chartData);
  }

  chartType: 'doughnut' = 'doughnut';

  chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }]
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
  };

  private colors = [
    '#2C3E50', // Bleu foncé professionnel
    '#34495E', // Gris bleuté
    '#1ABC9C', // Vert d'eau
    '#16A085', // Vert foncé
    '#F39C12', // Orange foncé
    '#D35400', // Rouge brique
    '#7F8C8D', // Gris neutre
    '#BDC3C7', // Gris clair
    '#95A5A6', // Gris bleuté clair
    '#2E4053'  // Bleu nuit
  ];


  ngOnInit(): void {
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
  }

  private updateChart(data: ChartData[]): void {
    this.chartData.labels = data.map(item => item.key);
    this.chartData.datasets[0].data = data.map(item => item.value);
    this.chartData.datasets[0].backgroundColor = data.map((_, i) => this.colors[i % this.colors.length]);
    this.chartData.datasets[0].hoverBackgroundColor = data.map((_, i) => this.colors[i % this.colors.length]);
  }
}
