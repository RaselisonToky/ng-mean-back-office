import { Injectable } from '@angular/core';
import {STATUS} from '../../pages/appointment/model/appointment.model';
import {STATUS_CHIP_COLORS, STATUS_LABELS_FR} from '../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  areMapsEqual(map1: Map<any, any>, map2: Map<any, any>): boolean {
    if (map1.size !== map2.size) {
      return false;
    }
    for (const [key, val] of map1) {
      if (!map2.has(key)) {
        return false;
      }
      const map2Val = map2.get(key);
      if (Array.isArray(val) && Array.isArray(map2Val)) {
        if (!this.areArraysEqual(val, map2Val)) {
          return false;
        }
      } else if (val !== map2Val) {
        return false;
      }
    }
    return true;
  }

  areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  formatDate(anyFormOfDate: Date): string {
    const date = new Date(anyFormOfDate);
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  getStatusChipStyle(status: any): { backgroundColor: string; borderColor: string; color: string } {
    return STATUS_CHIP_COLORS[status as STATUS];
  }

  getStatusLabel(status: any): string {
    return STATUS_LABELS_FR[status as STATUS];
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
