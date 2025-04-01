import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '../../../shared/ui/custom-table/custom-table.component';
import { Transaction } from './model/transaction.model';
import { TransactionsService } from './service/transactions.service';
@Component({
  selector: 'app-transactions',
  imports: [CommonModule, CustomTableComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  height = '785px'
  transactions: Transaction[] = []
  tableHeaders = ["Transaction Id", "Pieces", "Quantité", "Type", "Date"]

  constructor(private transactionService: TransactionsService) { }
  ngOnInit(): void {
    this.loadServices()
  }

  loadServices(): void {
    this.transactionService.findAll().subscribe({
      next: (data) => {
        this.transactions = data.data;
        console.log("Données récupérées:", data)
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error)
      }
    })
  }
}
