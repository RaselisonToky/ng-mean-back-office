import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '../../../shared/ui/custom-table/custom-table.component';
import { Transaction } from './model/transaction.model';
@Component({
  selector: 'app-transactions',
  imports: [CommonModule,CustomTableComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{
  height = '785px'
  transactions:Transaction[] = []
  tableHeaders = ["Transaction Id","Pieces","Prix","Quantité","Justif","Type","Date"]
  ngOnInit(): void {
    
  }
}
