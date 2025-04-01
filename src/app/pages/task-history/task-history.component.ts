import { Component, inject, OnInit } from '@angular/core'
import { TaskHistories } from './model/task-history.model'
import { TaskHistoryService } from './services/task-history.service'
import { UtilsService } from '../../shared/utils/utils.service'
import { CustomTableComponent } from '../../shared/ui/custom-table/custom-table.component'
import { CurrencyPipe, DatePipe, NgStyle } from '@angular/common'
import { Clock, Filter, LucideAngularModule } from 'lucide-angular'
import { FormsModule } from '@angular/forms'
import { AppointmentService } from '../appointment/services/appointment.service'

@Component({
  selector: 'app-task-history',
  imports: [
    CustomTableComponent,
    NgStyle,
    DatePipe,
    LucideAngularModule,
    FormsModule,
  ],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.css'
})
export class TaskHistoryComponent implements OnInit {
  private readonly taskHistoriesService = inject(TaskHistoryService);
  protected utilsService = inject(UtilsService);
  height = '909px';
  taskHistories : TaskHistories[] = [];
  startDate: string = '';
  endDate: string = '';
  tableHeaders = [
    'Immatriculation',
    'État',
    'Service',
    'Mécanicien(s)',
    'Début Maintenance',
    'Début Vérification',
    'Fin',
    'Date'
  ];
  searchQuery: string = '';
  filteredTaskHistories: TaskHistories[] = [];

  ngOnInit() {
    const firstDay = new Date();
    const lastDay = new Date();
    this.startDate = this.utilsService.formatDateForInput(firstDay);
    this.endDate = this.utilsService.formatDateForInput(lastDay);
    this.loadTaskHistories();
  }

  loadTaskHistories() {
    const firstDay = this.startDate ? new Date(this.startDate) : new Date();
    const lastDay = this.endDate ? new Date(this.endDate) : new Date();
    this.taskHistoriesService.getAll(firstDay, lastDay).subscribe({
      next: (data) => {
        this.taskHistories = data.data.reverse();
        this.filteredTaskHistories = [...this.taskHistories];
        this.applyFilters();
      }
    });
  }

  onSearch(): void {
    this.loadTaskHistories();
  }

  applyFilters(): void {
    if (!this.searchQuery) {
      this.filteredTaskHistories = [...this.taskHistories];
      return;
    }
    const searchTerm = this.searchQuery.toLowerCase();
    this.filteredTaskHistories = this.taskHistories.filter(item => {
      const licensePlate = item.appointment.licensePlate?.toLowerCase().includes(searchTerm);
      const status = this.utilsService.getStatusLabel(item.status)?.toLowerCase().includes(searchTerm);
      const serviceName = item.service.name?.toLowerCase().includes(searchTerm);
      const mechanicNames = item.users?.map(user => user.firstname?.toLowerCase()).join(' ').includes(searchTerm);
      const createdAt = this.utilsService.formatDate(item.createdAt).toLowerCase().includes(searchTerm);
      return (
        licensePlate ||
        status ||
        serviceName ||
        mechanicNames ||
        createdAt
      );
    });
  }
}
