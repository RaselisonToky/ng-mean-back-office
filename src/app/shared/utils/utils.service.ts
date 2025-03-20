import { Injectable } from '@angular/core';
import {STATUS} from '../../pages/appointment/model/appointment.model';
import {STATUS_CHIP_COLORS, STATUS_LABELS_FR} from '../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  getStatusChipStyle(status: any): { backgroundColor: string; borderColor: string; color: string } {
    return STATUS_CHIP_COLORS[status as STATUS];
  }

  getStatusLabel(status: any): string {
    return STATUS_LABELS_FR[status as STATUS];
  }
}
