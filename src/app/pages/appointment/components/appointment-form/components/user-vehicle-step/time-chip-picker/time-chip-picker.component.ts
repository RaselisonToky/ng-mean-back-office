import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-time-chip-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './time-chip-picker.component.html',
  styleUrl: './time-chip-picker.component.css'
})
export class TimeChipPickerComponent {
  @Input() timeSlots: string[] = [];
  @Input() value: string = '';
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';
  @Output() valueChange = new EventEmitter<string>();

  isOpen: boolean = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectTime(time: string): void {
    this.value = time;
    this.valueChange.emit(time);
    this.isOpen = false;
  }
}
