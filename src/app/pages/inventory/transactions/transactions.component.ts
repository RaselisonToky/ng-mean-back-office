import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '../../../shared/ui/custom-table/custom-table.component';
import { Transaction } from './model/transaction.model';
import { TransactionsService } from './service/transactions.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, formatPrice } from '../../../../utils/formatter';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, CustomTableComponent, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  height = '785px';
  transactions: Transaction[] = [];
  tableHeaders = ["Transaction Id", "Pieces", "Quantité", "Prix Unitaire", "Type", "Total", "Date"];
  startDate: string = '';  // Start date as string in 'YYYY-MM-DD' format
  endDate: string = '';  // End date as string in 'YYYY-MM-DD' format
  searchTerm: string = '';
  private query: string = '';
  itemsPerPage = 10;


  constructor(
    private transactionService: TransactionsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // If there's any date or searchTerm passed from the URL, set them
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
      this.searchTerm = params['q'] || '';
      this.fetchTransactions()
    });
  }

  loadServices(): void {
    this.transactionService.findAll().subscribe({
      next: (data) => {
        this.transactions = data.data;
        console.log("Données récupérées:", data);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
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

  onSearch(): void {
    this.updateUrlParams();  // Call updateUrlParams to update the URL with current search parameters

    this.transactionService.search(this.query).subscribe({
      next: (data) => {
        this.transactions = data.data;

      }, error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    })
  }

  fetchTransactions(): void {
    const params: any = {};
    if (this.startDate) params.startDate = this.startDate;
    if (this.endDate) params.endDate = this.endDate;
    if (this.searchTerm && this.searchTerm.trim()) params.q = this.searchTerm.trim();

    // Construire la chaîne de requête pour l'API (si votre service l'attend comme ça)
    // Ou passez l'objet 'params' directement à votre service s'il peut le gérer
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    // Utiliser findAll ou search en fonction de la présence de paramètres
    const request = queryString
      ? this.transactionService.search(queryString) // ou this.transactionService.search(params)
      : this.transactionService.findAll();          // Appeler findAll si aucun filtre n'est actif

    request.subscribe({
      next: (data) => {
        this.transactions = data.data; // Assurez-vous que la structure de 'data' est correcte
        console.log("Données récupérées:", data);
        // Gérer la pagination ici si nécessaire (ex: data.pagination)
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
        this.transactions = []; // Vider les transactions en cas d'erreur
      }
    });
  }

  private updateUrlParams(): void {
    const queryParams: any = {};

    // Constructing the query string to match the format: startDate=2023-12-20&q=Radiateur
    let queryString = '';

    if (this.startDate) {
      queryParams['startDate'] = this.startDate;
      queryString += `startDate=${this.startDate}`;
    }

    if (this.endDate) {
      queryParams['endDate'] = this.endDate;
      if (queryString) {
        queryString += `&endDate=${this.endDate}`;
      } else {
        queryString += `endDate=${this.endDate}`;
      }
    }

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      queryParams['q'] = this.searchTerm.trim();
      if (queryString) {
        queryString += `&q=${this.searchTerm.trim()}`;
      } else {
        queryString += `q=${this.searchTerm.trim()}`;
      }
    }

    // Update the URL with query parameters if there's at least one query parameter
    if (queryString) {
      this.query = queryString;  // Save the concatenated query string
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge'  // Merge the new params with the existing ones
      });
    }
  }

  prettyHintFormatDate(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date);
  }

  prettyHintFormatPrice(price: number): string {
    console.log("Prix avant formatage:", price);
    return formatPrice(price);
  }

  resetQueryParamsFilter(): void {
    // Réinitialiser les variables du composant
    this.startDate = '';
    this.endDate = '';
    this.searchTerm = '';

    // Naviguer pour effacer les paramètres de l'URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}, // Définir un objet vide pour effacer les paramètres
      // queryParamsHandling est omis, donc le comportement par défaut (remplacement) est utilisé
    }).then(() => {
      // Après la navigation (URL mise à jour), recharger les données
      // Le subscribe dans ngOnInit devrait s'en charger, mais par sécurité :
      // this.fetchTransactions(); // Décommentez si le rechargement via ngOnInit ne se fait pas
    });
    // Normalement, le changement de queryParams déclenche le subscribe dans ngOnInit,
    // qui appelle fetchTransactions avec les paramètres vides (donc findAll est appelé).
  }
}
