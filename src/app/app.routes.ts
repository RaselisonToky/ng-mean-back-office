import { Routes } from '@angular/router';

import { TransactionsComponent } from './pages/inventory/transactions/transactions.component';
import { DeliveryComponent } from './pages/inventory/delivery/delivery.component';

import { AuthComponent } from './pages/auth/auth.component';
import { LayoutComponent } from './layout/layout.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthGuard } from './pages/auth/services/auth-guards.service';
import { ServiceComponent } from './pages/service/service.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { AppointmentFormComponent } from './pages/appointment/components/appointment-form/appointment-form.component';
import { TaskComponent } from './pages/task/task.component';
import { PiecesComponent } from './pages/inventory/pieces/pieces.component';
import {
  AppointmentDetailsComponent
} from './pages/appointment/components/appointment-details/appointment-details.component';
import { TaskHistoryComponent } from './pages/task-history/task-history.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { SupplierOrderComponent } from './pages/inventory/supplier-order/supplier-order.component';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'appointment',
        component: AppointmentComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'appointment/:id',
        component: AppointmentDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'appointment-form',
        component: AppointmentFormComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'garage',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'maintenance',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },

      {
        path: 'service',
        component: ServiceComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'inventory/transactions',
        component: TransactionsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'inventory/deliveries',
        component: DeliveryComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'inventory/supplierOrders',
        component: SupplierOrderComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'inventory/pieces',
        component: PiecesComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'task',
        component: TaskComponent,
        canActivate: [AuthGuard],
        data: { roles: ['MECHANIC'] },
      },
      {
        path: 'log-book',
        component: TaskHistoryComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },


      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];
