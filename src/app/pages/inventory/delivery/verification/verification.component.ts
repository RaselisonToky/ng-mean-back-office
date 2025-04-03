import { Component, Input } from '@angular/core';
import { DeliveryDetail, DeliveryGeneralFormData } from '../delivery.types';

@Component({
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent {
  @Input() general: DeliveryGeneralFormData | null = null;
  @Input() details: DeliveryDetail[] = [];

  getTotalPrice(): number {
    return this.details.reduce((total, detail) => {
      return total + detail.prixUnitaire * detail.quantite;
    }, 0);
  }
}
