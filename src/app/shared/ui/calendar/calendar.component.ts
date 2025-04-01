import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCount, CalendarDay } from './model/calendar.model'

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges {
  @Input() appointmentCounts: AppointmentCount[] = [];
  @Input() currentMonth!: number;
  @Input() currentYear!: number;
  @Output() monthChanged = new EventEmitter<{ month: number; year: number }>();

  calendar: CalendarDay[][] = [];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appointmentCounts'] || changes['currentMonth'] || changes['currentYear']) {
      this.generateCalendar();
    }
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startingDay = (firstDayOfMonth.getDay() + 6) % 7;

    this.calendar = [];
    let week: CalendarDay[] = [];

    // Days from the previous month
    let prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
      week.push(this.createEmptyDay(prevDate));
    }
    week.reverse(); // Reverse to correct order

    // Days of the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      week.push({
        date,
        appointmentCount: this.getAppointmentCount(date),
        isCurrentMonth: true,
        isToday: this.isToday(date)
      });

      if (week.length === 7) {
        this.calendar.push(week);
        week = [];
      }
    }

    // Days from the next month
    let nextMonthDay = 1;
    if (week.length > 0) {
      for (let i = week.length; i < 7; i++) {
        const nextDate = new Date(this.currentYear, this.currentMonth + 1, nextMonthDay++);
        week.push(this.createEmptyDay(nextDate));
      }
      this.calendar.push(week);
    }
  }

  private createEmptyDay(date: Date): CalendarDay {
    return {
      date,
      appointmentCount: 0,
      isCurrentMonth: false,
      isToday: false
    };
  }

  getAppointmentCount(date: Date): number {
    const dateString = this.formatDate(date); // Use formatDate function
    const appointmentData = this.appointmentCounts.find(a => a.date === dateString);
    return appointmentData?.appointmentCount || 0;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.formatDate(date) === this.formatDate(today); // Use formatDate here too.
  }

  // Helper function to format dates consistently.
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  previousMonth() {
    let newMonth = this.currentMonth - 1;
    let newYear = this.currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    this.monthChanged.emit({ month: newMonth, year: newYear });
  }

  nextMonth() {
    let newMonth = this.currentMonth + 1;
    let newYear = this.currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    this.monthChanged.emit({ month: newMonth, year: newYear });
  }
}
