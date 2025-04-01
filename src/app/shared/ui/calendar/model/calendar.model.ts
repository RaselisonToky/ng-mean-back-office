export interface CalendarDay {
  date: Date;
  appointmentCount: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface AppointmentCount {
  date: string;
  appointmentCount: number;
}
