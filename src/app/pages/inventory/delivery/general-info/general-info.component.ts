import { Component, Output, EventEmitter } from '@angular/core';
import { DeliveryGeneralFormData } from '../delivery.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.css'
})
export class GeneralInfoComponent {
  @Output() onNext = new EventEmitter<DeliveryGeneralFormData>();

  formErrors: Record<string, string> = {};
  bonLivraison: string = 'BL-123456';
  dateLivraison: string = '12/10/2023:00:00';
  livreur: string = 'Rajaonson Bien aimé';
  observation: string = '';

  constructor() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');

    this.dateLivraison = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.bonLivraison.trim() && this.bonLivraison.trim().length < 1) {
      this.formErrors['bonLivraison'] = 'Le bon de livraison est requis.';
      isValid = false;
    }

    if (!this.dateLivraison) {
      this.formErrors['dateLivraison'] = 'La date de livraison est requise.';
      isValid = false;
    }

    if (!this.livreur.trim()) {
      this.formErrors['livreur'] = 'Le nom du livreur est requis.';
      isValid = false;
    }

    if (this.observation.length > 255) {
      this.formErrors['observation'] = 'L\'observation ne doit pas dépasser 255 caractères.';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Form submitted:', {
      bonLivraison: this.bonLivraison,
      dateLivraison: this.dateLivraison,
      livreur: this.livreur,
      observation: this.observation
    });
    const isValid = this.validateForm();
    console.log('Form errors:', this.formErrors);
    if (isValid) {
      const formData: DeliveryGeneralFormData = {
        bonLivraison: this.bonLivraison,
        dateLivraison: this.dateLivraison,
        livreur: this.livreur,
        observation: this.observation
      };

      this.onNext.emit(formData);
    }
  }
}
