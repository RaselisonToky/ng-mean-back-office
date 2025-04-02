import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomTableComponent } from '../../../../shared/ui/custom-table/custom-table.component';
import { Appointment, STATUS } from '../../model/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import {Category} from '../../../category/model/category.model';
import {CategoryService} from '../../../category/services/category.service';
import {Clock, Filter, LucideAngularModule, MoreVertical } from 'lucide-angular';
import {TaskAssignmentComponent} from '../task-assignement/task-assignment.component';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  imports: [
    CustomTableComponent,
    DatePipe,
    CommonModule,
    FormsModule,
    LucideAngularModule,
    TaskAssignmentComponent
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})

export class AppointmentListComponent implements OnInit {
  constructor(
    private appointmentService: AppointmentService,
    private categoryService: CategoryService,
    protected utilsService: UtilsService,
    private router: Router,
  ) {}

  height = '909px';
  showSidebar = false;
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  tableHeaders = [
    'Numéro d\'immatriculation',
    'Contact',
    'Marque',
    'Modèle',
    'Services demandés',
    'Rendez-vous',
    'Prix total',
    'Statut',
    ''
  ];
  expandedRows = new Set<number>();
  startDate: string = '';
  endDate: string = '';
  searchQuery: string = '';
  selectedStatuses: STATUS[] = [];
  availableStatuses: STATUS[] = Object.values(STATUS) as STATUS[];
  selectedCategories: string[] = [];
  availableCategories: Category[] = [];
  showFilters: boolean = false;
  selectedAppointment: Appointment | null = null;
  contextMenuAppointment: Appointment | null = null;
  showContextMenu: boolean = false;
  contextMenuX = 0;
  contextMenuY = 0;

  onTaskStatusUpdated(): void {
    this.loadAppointment();
  }

  onCloseSidebar(): void {
    this.showSidebar = false;
    this.selectedAppointment = null;
  }
  ngOnInit() {
    const today = new Date();
    const firstDay = new Date(today);
    const lastDay = new Date(today);
    lastDay.setDate(lastDay.getDate() + 7);
    this.startDate = this.utilsService.formatDateForInput(firstDay);
    this.endDate = this.utilsService.formatDateForInput(lastDay);
    this.loadAppointment();
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.availableCategories = data.data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    });
  }

  loadAppointment(): void {
    const startDateObj = this.startDate ? new Date(this.startDate) : new Date();
    const endDateObj = this.endDate ? new Date(this.endDate) : new Date();
    this.appointmentService.findAll(startDateObj, endDateObj).subscribe({
      next: (data) => {
        this.appointments = data.data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  onDetailsClicked(appointment: Appointment) {
    this.router.navigate(['/appointment', appointment._id]).then();
    this.closeContextMenu();
  }

  onSearch(): void {
    this.loadAppointment();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const searchLower = this.searchQuery.toLowerCase();
      const nameMatch = appointment.name.toLowerCase().includes(searchLower);
      const phoneMatch = appointment.phone.toLowerCase().includes(searchLower);
      const searchMatch = nameMatch || phoneMatch;
      const categoryMatch = this.selectedCategories.length === 0 ||
        appointment.services.some(service =>
          this.selectedCategories.includes(service.category.name)
        );
      const statusMatch = this.selectedStatuses.length === 0 ||
        this.selectedStatuses.includes(appointment.status);
      return searchMatch && categoryMatch && statusMatch;
    });
  }

  toggleCategory(categoryName: string): void {
    const index = this.selectedCategories.indexOf(categoryName);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryName);
    }
    this.applyFilters();
  }

  toggleStatus(status: STATUS): void {
    const index = this.selectedStatuses.indexOf(status);
    if (index > -1) {
      this.selectedStatuses.splice(index, 1);
    } else {
      this.selectedStatuses.push(status);
    }
    this.applyFilters();
  }

  toggleExpand(index: number): void {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  shouldShowExpansionChevron(services: any[]): boolean {
    return services.length > 2;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatuses = [];
    this.applyFilters();
  }

  openContextMenu(event: MouseEvent, appointment: Appointment) {
    event.preventDefault();
    this.contextMenuAppointment = appointment;
    this.showContextMenu = true;
    this.contextMenuX = event.clientX - 200;
    this.contextMenuY = event.clientY + 10;
  }

  closeContextMenu() {
    this.showContextMenu = false;
  }

  onAssignTaskClicked() {
    this.selectedAppointment = this.contextMenuAppointment;
    this.showSidebar = true;
    this.closeContextMenu();
  }

  protected readonly Filter = Filter;
  protected readonly Clock = Clock;
  protected readonly MoreVertical = MoreVertical;
  protected readonly STATUS = STATUS
}
