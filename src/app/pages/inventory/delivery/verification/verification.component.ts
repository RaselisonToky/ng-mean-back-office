import { Component, Input } from '@angular/core';
import { DeliveryDetail, DeliveryGeneralFormData } from '../delivery.types';
import { DeliveryService } from '../service/delivery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent {
  @Input() general: DeliveryGeneralFormData | null = null;
  @Input() details: DeliveryDetail[] = [];

  constructor(private deliveryService: DeliveryService, private router: Router) { }

  getTotalPrice(): number {
    return this.details.reduce((total, detail) => {
      return total + detail.prixUnitaire * detail.quantite;
    }, 0);
  }

  submitDelivery(): void {
    const data = {
      order_id: this.general?.commandeId,
      details: this.details,
      livreur: this.general?.livreur,
      bonLivraison: this.general?.bonLivraison,
      total_amount: this.getTotalPrice(),
    }

    console.log('Submitting delivery data:', data);

    this.deliveryService.create(data).subscribe({
      next: (response) => {
        console.log('Delivery created successfully:', response);
        this.router.navigate(['inventory/deliveries'], {
          queryParams: {
            action: 'list'
          }
        });
      },
      error: (error) => {
        console.error('Error creating delivery:', error);
      }
    });
  }
}
