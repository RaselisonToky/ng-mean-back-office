import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '../../shared/ui/custom-table/custom-table.component';
import { ServiceService } from './services/servce.service';
import {Service} from './model/service.model';

@Component({
  selector: 'app-service-page',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  imports: [CommonModule, CustomTableComponent]
})
export class ServiceComponent implements OnInit {
  height = '785px'
  services: Service[] = [];
  tableHeaders = ['Service','prix', 'categorie','durée (éstimation)']

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.findAll().subscribe({
      next: (data) => {
        this.services = data.data;
        console.log('Données récupérées:', data);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  onRowClick(item: any): void {
    console.log('Ligne cliquée:', item);
  }
}
