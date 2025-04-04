import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../../shared/ui/custom-table/custom-table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Remove SupplierOrder model import if backend returns pre-formatted data
// import { SupplierOrder } from '../model/supplier-order.model';
import { SupplierOrderService } from '../service/supplier-order.service';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router and ActivatedRoute
import { Subscription } from 'rxjs'; // Import Subscription for cleanup
import { SupplierOrder } from '../model/supplier-order.model';
import { formatPrice } from '../../../../../utils/formatter';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CustomTableComponent, FormsModule, CommonModule],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'] // Corrected styleUrl to styleUrls
})
export class SupplierListComponent implements OnInit, OnDestroy { // Implement OnDestroy
  height = '750px';

  tableHeaders = ["Commande Id", "Ticket de suivie", "Fournisseur", "Prix Total Commande","% Livré", "Status", "Date"]; // Added "Articles" if needed
  
  // --- Filter State ---
  startDate: string = '';
  endDate: string = '';
  searchTerm: string = '';
  itemsPerPage = 10; // Number of items per page

  supplierOrders: SupplierOrder[] = [];
  isLoading: boolean = false; // Flag for loading state
  errorMessage: string | null = null; // To display errors

  private queryParamsSubscription: Subscription | null = null; // To store subscription

  constructor(
    private supplierOrderService: SupplierOrderService,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private router: Router       // Inject Router
  ) { }

  ngOnInit(): void {
    // Subscribe to query parameter changes to react to URL updates
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      console.log("Query Params Changed:", params);
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
      this.searchTerm = params['q'] || ''; // Use 'q' to match common practice & TransactionsComponent
      this.fetchSupplierOrders();
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  fetchSupplierOrders(): void {
    this.isLoading = true; // Set loading state
    this.errorMessage = null; // Clear previous errors
    this.supplierOrders = []; // Clear previous data

    const criteria = {
      startDate: this.startDate || undefined, // Pass undefined if empty
      endDate: this.endDate || undefined,
      q: this.searchTerm.trim() || undefined
    };

    
    const hasCriteria = criteria.startDate || criteria.endDate || criteria.q;

    const request$ = hasCriteria
      ? this.supplierOrderService.search(criteria)
      : this.supplierOrderService.findAll();

    request$.subscribe({
      next: (data: any) => {
        
        this.supplierOrders = data.data;
        console.log("Supplier Orders Data:", this.supplierOrders);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des commandes fournisseur:', error);
        this.errorMessage = `Erreur lors de la récupération des données: ${error.message || 'Erreur inconnue'}`;
        this.isLoading = false;
        this.supplierOrders = []; // Ensure data is empty on error
      }
    });
  }

  onDateChange(): void {
    console.log("Date changed:", { start: this.startDate, end: this.endDate });
  }

 
  onSearch(): void {
    this.updateUrlAndFetch();
  }

  private updateUrlAndFetch(): void {
    const queryParams: any = {};

    if (this.startDate) {
      queryParams['startDate'] = this.startDate;
    }
    if (this.endDate) {
      queryParams['endDate'] = this.endDate;
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      queryParams['q'] = this.searchTerm.trim(); // Use 'q'
    }

    console.log("Navigating with query params:", queryParams);
    // Navigate to the same route, replacing query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null // Replace existing parameters
    }).catch(err => console.error("Navigation error:", err)); // Optional: catch navigation errors
   
  }

  
  resetQueryParamsFilter(): void {
    // Reset component state
    this.startDate = '';
    this.endDate = '';
    this.searchTerm = '';
    this.errorMessage = null; // Clear any error messages

    console.log("Resetting filters and navigating...");
    // Navigate to clear query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}, // Empty object clears params
      queryParamsHandling: null // Replace mode
    }).catch(err => console.error("Navigation error on reset:", err));
    // No need to call fetchSupplierOrders here, ngOnInit subscription handles it
  }

  onStartDateChange(event: any): void {
    // The start date is updated as a string, no URL update here
    this.startDate = event.target.value;
  }

  onEndDateChange(event: any): void {
    // The end date is updated as a string, no URL update here
    this.endDate = event.target.value;
  }

  formatPricePrettier(price: number): string {
    return formatPrice(price);
  }

  // Removed prettyHintFormatDate and prettyHintFormatPrice as backend handles formatting
}