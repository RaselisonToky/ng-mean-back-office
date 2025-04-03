import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { Router } from '@angular/router';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { DetailsComponent } from './details/details.component';
import { VerificationComponent } from './verification/verification.component';
import { PiecesService } from '../pieces/service/pieces.service';
import { Piece } from '../pieces/model/piece.model';
import { CommonModule } from '@angular/common';
import { DeliveryGeneralFormData } from './delivery.types';
@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralInfoComponent,
    DetailsComponent,
    VerificationComponent
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css',

})
export class DeliveryComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  totalSteps: number = 3;
  action: string | null = 'create';
  pieces: Piece[] = [];
  deliveryGeneral: DeliveryGeneralFormData | null = null;
  deliveryDetails: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private pieceService: PiecesService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'create';
      this.currentStep = +params['step'] || 1;
      console.log('Action:', params['action']);
      console.log('Step:', params['step']);
    });
    this.fetchPieces();
  }
  ngOnDestroy(): void {

  }

  fetchPieces() {
    this.pieceService.findAll().subscribe({
      next: (data) => {
        this.pieces = data.data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  goToNextStep(genInfo: DeliveryGeneralFormData): void {
    this.deliveryGeneral = genInfo;
    this.route.params.subscribe(params => {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.router.navigate(['inventory/deliveries'], {
          queryParams: {
            action: this.action,
            step: this.currentStep
          }
        });
      }
    }
    );
  }

  goToVerificationStep(details: any[]): void {
    this.deliveryDetails = details;
    console.log('Details:', details);
    this.route.params.subscribe(params => {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.router.navigate(['inventory/deliveries'], {
          queryParams: {
            action: this.action,
            step: this.currentStep
          }
        });
      }
    });
  }

  submitDelivery(): void {
    // Handle the submission logic here
    console.log('Delivery submitted:', this.deliveryGeneral, this.deliveryDetails);
    // You can navigate to another page or show a success message
  }
}
