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
      width: 100%;
      height: 400px;
      margin: 20px 0;
    }
  `]
})
export class LineChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() data: ChartData[] = [];

  private chart: Chart | undefined;
  private previousDataLength = 0;
  private readonly MAX_DATA_POINTS = 1000; // Limite pour éviter les problèmes de performance

  ngAfterViewInit() {
    // Attendre le prochain cycle pour s'assurer que le canvas est rendu
    setTimeout(() => {
      this.createChart();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Vérifier si les données ont réellement changé et si le graphique existe déjà
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
    // Nettoyer proprement les ressources
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  private hasDataChanged(currentData: ChartData[], previousData: ChartData[]): boolean {
    // Vérification rapide de la longueur
    if (!currentData || !previousData || currentData.length !== previousData.length) {
      return true;
    }

    // Vérification plus approfondie en comparant quelques éléments
    // (Pour de grands ensembles de données, comparer chaque élément serait coûteux)
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
    // Vérifier si le canvas existe
    if (!this.chartCanvas?.nativeElement) {
      console.warn('Canvas element not available');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context');
      return;
    }

    // S'assurer que nous n'avons pas trop de points de données
    const safeData = this.limitDataPoints(this.data);
    this.previousDataLength = safeData.length;

    try {
      // Détruire le graphique précédent s'il existe
      if (this.chart) {
        this.chart.destroy();
      }

      // Créer le nouveau graphique avec des données sécurisées
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: safeData.map(item => item.key),
          datasets: [{
            label: 'Valeurs',
            data: safeData.map(item => item.value),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false,
            pointRadius: safeData.length > 50 ? 0 : 3, // Désactiver les points pour les grands ensembles
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: safeData.length > 100 ? 0 : 1000, // Désactiver l'animation pour les grands ensembles
          },
          scales: {
            y: {
              beginAtZero: true
            }
          },
          elements: {
            line: {
              borderWidth: 1.5, // Ligne plus fine pour de meilleures performances
            }
          },
          plugins: {
            tooltip: {
              enabled: safeData.length <= 100, // Désactiver les tooltips pour les grands ensembles
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
      // S'assurer que nous n'avons pas trop de points de données
      const safeData = this.limitDataPoints(this.data);

      // Si la quantité de données a considérablement changé, recréer le graphique
      if (Math.abs(this.previousDataLength - safeData.length) > 50) {
        this.createChart();
        return;
      }

      this.previousDataLength = safeData.length;

      // Mettre à jour les données existantes
      this.chart.data.labels = safeData.map(item => item.key);
      this.chart.data.datasets[0].data = safeData.map(item => item.value);

      // Désactiver l'animation si nous avons beaucoup de données
      this.chart.options.animation = {
        duration: safeData.length > 100 ? 0 : 1000
      };

      // Mettre à jour le graphique avec une animation minimale
      this.chart.update('none'); // 'none' désactive les animations lors de la mise à jour
    } catch (error) {
      console.error('Error updating chart:', error);
      // En cas d'erreur, essayer de recréer le graphique
      this.createChart();
    }
  }

  private limitDataPoints(data: ChartData[]): ChartData[] {
    if (!data || data.length === 0) {
      return [];
    }

    if (data.length > this.MAX_DATA_POINTS) {
      console.warn(`Data points exceeded maximum (${data.length}/${this.MAX_DATA_POINTS}). Limiting display.`);
      // Option 1: Prendre les N premiers points
      // return data.slice(0, this.MAX_DATA_POINTS);

      // Option 2: Échantillonner uniformément pour maintenir la forme
      const ratio = Math.ceil(data.length / this.MAX_DATA_POINTS);
      return data.filter((_, index) => index % ratio === 0);
    }

    return data;
  }
}
