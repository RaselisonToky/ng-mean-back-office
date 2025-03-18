import { Routes } from '@angular/router';
import {AuthComponent} from './pages/auth/auth.component';
import {LayoutComponent} from './layout/layout.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {AuthGuard} from './pages/auth/services/auth-guards.service';
import {ServiceComponent} from './pages/service/service.component';
import {AppointmentComponent} from './pages/appointment/appointment.component';
import {AppointmentFormComponent} from './pages/appointment/components/appointment-form/appointment-form.component';
import {TaskComponent} from './pages/task/task.component';

export const routes: Routes = [
  {path: 'login', component: AuthComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }},
      { path: 'appointment', component: AppointmentComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }},
      { path: 'appointment-form', component: AppointmentFormComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }},
      { path: 'garage', component: SettingsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
      { path: 'maintenance', component: SettingsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
      { path: 'service', component: ServiceComponent,  canActivate: [AuthGuard], data: { roles: ['ADMIN'] }},
      { path: 'task', component: TaskComponent,  canActivate: [AuthGuard], data: { roles: ['MECHANIC'] }},
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];
