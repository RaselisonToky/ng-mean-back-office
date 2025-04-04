import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomTableComponent } from '../../../../shared/ui/custom-table/custom-table.component';
import { DeliveryService } from '../service/delivery.service';

@Component({
  standalone:true,
  selector: 'app-delivery-list',
  imports: [FormsModule, CommonModule, CustomTableComponent],
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.css'
})
export class DeliveryListComponent implements OnInit {
  height = '750px';

  tableHeaders = ["Livraison Id", "Ticket de suivie", "Bon de livraison", "Livreur", "Fournisseur", "Prix Total", "Date"];
  startDate: string = '';  // Start date as string in 'YYYY-MM-DD' format
  endDate: string = '';  // End date as string in 'YYYY-MM-DD' format
  searchTerm: string = '';
  private query: string = '';
  itemsPerPage = 10;
  deliveries: any[] = []

  constructor(private deliveryService: DeliveryService) {

  }

  ngOnInit(): void {
      this.getAllDeliveries()
  }

  getAllDeliveries() {
    this.deliveryService.findAll().subscribe({
      next: (response) => {
        this.deliveries = response.data;
      },
      error: (error) => {
        console.error('Error fetching deliveries:', error);
      }
    });
  }
  

  onStartDateChange(event: any): void {
    // The start date is updated as a string, no URL update here
    this.startDate = event.target.value;
  }

  onEndDateChange(event: any): void {
    // The end date is updated as a string, no URL update here
    this.endDate = event.target.value;
  }

  onSearch() {

  }

  resetQueryParamsFilter() {

  }
}
