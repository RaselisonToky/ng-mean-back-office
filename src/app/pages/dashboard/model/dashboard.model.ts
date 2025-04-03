export default interface AppointmentStatisticPerStatus {
  action: string;
  count: number;
}

export interface ServiceCountByCategories {
  _id?: string;
  name: string;
  count: number;
}

export interface ChartData {
  key: string;
  value: number;
}
