import { Component, OnInit } from '@angular/core';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierOrder } from './model/supplier-order.model';
import { SupplierOrderService } from './service/supplier-order.service';
@Component({
  selector: 'app-supplier-order',
  standalone: true,
  imports: [
    SupplierListComponent
  ],
  templateUrl: './supplier-order.component.html',
  styleUrl: './supplier-order.component.css'
})
export class SupplierOrderComponent {
  


}
