import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-delivery',
  imports: [],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent implements OnInit, OnDestroy {
  private linkElement!: HTMLLinkElement;
  private currentStep: number = 1;
  private totalSteps: number = 3;
  private steps: string[] = ['Information Général', 'Détails du livraison', 'Vérification'];
  private stepTitles: string[] = ['Information Général', 'Détails du livraison', 'Vérification'];
  
  formData: any = {
    deliveryDate: '',
    deliveryTime: '',
    deliveryAddress: '',
    deliveryInstructions: '',
    deliveryContactName: '',
    deliveryContactPhone: ''
  }
  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
    this.linkElement = this.renderer.createElement('link')
    this.linkElement.rel = 'stylesheet';
    this.linkElement.href = 'assets/tailwind-specific.css';
    this.renderer.appendChild(document.head, this.linkElement);

  }
  ngOnDestroy(): void {
    if (this.linkElement) {
      this.renderer.removeChild(document.head, this.linkElement);

    }
  }
  goToNextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }

  }

}
