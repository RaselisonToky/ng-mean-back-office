import {Component, ContentChild, TemplateRef,
  EventEmitter, Output, Input,
  OnInit, OnChanges, SimpleChanges,
  AfterContentInit, ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass, NgStyle } from '@angular/common';
import {isEmpty} from 'rxjs';
import { SpinnerLoadingComponent } from '../spinner-loading/spinner-loading.component'

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
  imports: [CommonModule, SpinnerLoadingComponent],
  encapsulation: ViewEncapsulation.None
})
export class CustomTableComponent implements OnInit, OnChanges, AfterContentInit {
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 50;
  @Input() height?: string;
  @Input() className?: string;
  @Input() tableClassName?: string;
  @Input() isLoading = false;
  @Output() rowClick = new EventEmitter<any>();
  @ContentChild(TemplateRef) rowTemplate!: TemplateRef<any>;

  currentPage: number = 1;
  paginatedData: any[] = [];
  totalPages: number = 0;

  ngOnInit(): void {
    this.updatePagination();
  }

  ngAfterContentInit(): void {
    if (!this.rowTemplate) {
      console.error('Template de ligne non trouvé !');
    }
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['itemsPerPage']) {
      this.updatePagination();
    }
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    this.paginatedData = this.data.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onRowClicked(item: any): void {
    this.rowClick.emit(item);
  }

  getPaginationButtons(): any[] {
    const buttons = [];
    const maxButtons = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(this.totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }
    if (start > 1) {
      buttons.push({ type: 'button', value: 1 });
      if (start > 2) {
        buttons.push({ type: 'ellipsis', value: 'start-ellipsis' });
      }
    }
    for (let i = start; i <= end; i++) {
      buttons.push({ type: 'button', value: i, active: this.currentPage === i });
    }
    if (end < this.totalPages) {
      if (end < this.totalPages - 1) {
        buttons.push({ type: 'ellipsis', value: 'end-ellipsis' });
      }
      buttons.push({ type: 'button', value: this.totalPages });
    }
    return buttons;
  }

  protected readonly isEmpty = isEmpty;
}
