import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'spinner-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-loading.component.html',
  styleUrl: './spinner-loading.component.css'
})
export class SpinnerLoadingComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: string = '#1e293b';
  @Input() backgroundColor: string = 'rgba(255, 255, 255, 0.8)';
  @Input() text: string = 'Chargement...';
  @Input() textColor: string = '#333';
  @Input() showText: boolean = true;

  get spinnerSizeClass(): string {
    return `spinner-${this.size}`;
  }

  get containerStyle() {
    return {
      'background-color': this.backgroundColor
    };
  }
}
