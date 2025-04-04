import { Component, OnInit } from '@angular/core';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierOrder } from './model/supplier-order.model';
import { SupplierOrderService } from './service/supplier-order.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-supplier-order',
  standalone: true,
  imports: [
    SupplierListComponent
  ],
  templateUrl: './supplier-order.component.html',
  styleUrl: './supplier-order.component.css'
})
export class SupplierOrderComponent implements OnInit {
  action: string = 'list'

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'list';
      console.log('Action:', params['action']);
    });
  }

  switchViewMode() {
    this.action = this.action === 'list' ? 'create' : 'list';
    this.router.navigate(['inventory/supplierOrders'], {
      queryParams: {
        action: this.action
      }
    });
  }

}
