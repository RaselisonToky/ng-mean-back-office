import {Service} from '../../service/model/service.model';
import {Model} from '../../model/model/model.model';

export enum STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  SUSPENDED = 'SUSPENDED',
  FINISHED = 'FINISHED'
}

export interface Appointment {
  user: {
    firstName: string;
    email: string;
  },
  carModel: Model,
  licensePlate: string,
  services: Service[],
  scheduleAt: Date,
  estimateDuration: Number,
  estimatedPrice: Number,
  status: STATUS,
}
