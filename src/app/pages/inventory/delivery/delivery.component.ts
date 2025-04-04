import { SupplierOrderService } from './../supplier-order/service/supplier-order.service';
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
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { SupplierOrderTicket } from '../supplier-order/model/supplier-order.model';
import { DeliveryService } from './service/delivery.service';
@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralInfoComponent,
    DetailsComponent,
    VerificationComponent,
    DeliveryListComponent
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css',

})
export class DeliveryComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  totalSteps: number = 3;
  action: string | null = 'view';
  pieces: any[] = [];
  deliveryGeneral: DeliveryGeneralFormData | null = null;
  deliveryDetails: any[] = [];
  searchTerm: string = '';
  tickets: SupplierOrderTicket[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pieceService: PiecesService,
    private supplierOrderService: SupplierOrderService,
    private deliveryService: DeliveryService

  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'view';
      this.currentStep = +params['step'] || 1;
      console.log('Action:', params['action']);
      console.log('Step:', params['step']);
    });
    this.getAllTickets();
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

  async goToNextStep(genInfo: DeliveryGeneralFormData) {
    this.deliveryGeneral = genInfo;
    this.supplierOrderService.findById(this.deliveryGeneral.commandeId).subscribe({
      next: (data: any) => {
        this.pieces = data.items
      },
      error: (error) => {
        console.log('Erreur lors de la récupération des données', error)
      }
    })
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

  getAllTickets() {
    this.supplierOrderService.findAllAvailableTickets().subscribe({
      next: (data: any) => {
        this.tickets = data;
        console.log('Tickets:', this.tickets);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
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

  

  switchViewMode() {
    if (this.action === 'create') {
      this.router.navigate(['inventory/deliveries'], {
        queryParams: {
          action: 'view'
        }
      });
    }
    else {
      this.router.navigate(['inventory/deliveries'], {
        queryParams: {
          action: 'create'
        }
      });
    }
  }
}
