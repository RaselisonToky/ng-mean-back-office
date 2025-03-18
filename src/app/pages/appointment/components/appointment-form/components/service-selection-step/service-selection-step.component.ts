import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { JsonPipe, NgClass, NgStyle } from '@angular/common';
import {ServiceService} from '../../../../../service/services/servce.service';
import {CategoryService} from '../../../../../category/services/category.service';
import {Category} from '../../../../../category/model/category.model';
import {Service} from '../../../../../service/model/service.model';

@Component({
  selector: 'app-service-selection-step',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './service-selection-step.component.html',
  styleUrl: './service-selection-step.component.css',
})
export class ServiceSelectionStepComponent implements OnInit {
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<Service[]>();
  categories: Category[] = [];
  services: Service[] = [];
  selectedServiceIds: string[] = [];
  activeTab: string = '';

  visibleCategories: Category[] = [];
  currentCategoryPage: number = 0;
  categoriesPerPage: number = 8;

  isAnimating: boolean = false;
  slideDirection: 'left' | 'right' | null = null;

  constructor(
    private serviceService: ServiceService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.fetchServices();
    this.fetchCategories();
  }

  fetchServices(){
    this.serviceService.findAll().subscribe({
      next: (data) => {
        this.services = data.data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    })
  }

  fetchCategories(){
    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.categories = data.data;
        if (this.categories.length > 0) {
          this.activeTab = this.categories[0]._id;
          this.updateVisibleCategories();
        }
      }
    })
  }

  updateVisibleCategories(): void {
    const startIndex = this.currentCategoryPage * this.categoriesPerPage;
    this.visibleCategories = this.categories.slice(
      startIndex,
      startIndex + this.categoriesPerPage
    );
  }

  nextCategoryPage(): void {
    if (this.isAnimating || !this.hasNextPage()) return;

    this.isAnimating = true;
    this.slideDirection = 'right';

    setTimeout(() => {
      this.currentCategoryPage++;
      this.updateVisibleCategories();
      this.slideDirection = null;
      this.isAnimating = false;
    }, 280);
  }

  previousCategoryPage(): void {
    if (this.isAnimating || !this.hasPreviousPage()) return;

    this.isAnimating = true;
    this.slideDirection = 'left';

    setTimeout(() => {
      this.currentCategoryPage--;
      this.updateVisibleCategories();
      this.slideDirection = null;
      this.isAnimating = false;
    }, 280);
  }

  hasNextPage(): boolean {
    return this.currentCategoryPage < Math.ceil(this.categories.length / this.categoriesPerPage) - 1;
  }

  hasPreviousPage(): boolean {
    return this.currentCategoryPage > 0;
  }

  getServicesByCategory(categoryId: string): Service[] {
    return this.services.filter(service => service.category._id === categoryId);
  }

  toggleService(serviceId: string): void {
    const index = this.selectedServiceIds.indexOf(serviceId);
    if (index === -1) {
      this.selectedServiceIds.push(serviceId);
    } else {
      this.selectedServiceIds.splice(index, 1);
    }
  }

  handleNext(): void {
    if (this.selectedServiceIds.length === 0) return;
    const selectedServicesList = this.services.filter(service =>
      this.selectedServiceIds.includes(service._id)
    );
    this.onNext.emit(selectedServicesList);
  }

  isServiceSelected(serviceId: string): boolean {
    return this.selectedServiceIds.includes(serviceId);
  }

  get totalPrice(): number {
    return this.services
      .filter(service => this.selectedServiceIds.includes(service._id))
      .reduce((sum, service) => sum + service.price, 0);
  }

  get totalDuration(): number {
    return this.services
      .filter(service => this.selectedServiceIds.includes(service._id))
      .reduce((sum, service) => sum + service.estimateDuration, 0);
  }
}
