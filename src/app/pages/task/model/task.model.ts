import {Appointment} from '../../appointment/model/appointment.model';
import {Service} from '../../service/model/service.model';
import {User} from '../../user/model/user.model';

export enum TASK_STATUS {
  REQUESTED = 'REQUESTED',
  PENDING= 'PENDING',
  IN_PROGRESS= 'IN_PROGRESS',
  IN_REVIEW= 'IN_REVIEW',
  COMPLETED= 'COMPLETED',
  CANCELED= 'CANCELED',
}

export interface Task {
  _id?: string;
  appointment: Appointment;
  service: Service;
  users: User[];
  status: TASK_STATUS;
}

export interface TaskDto {
  appointment: string;
  service: string;
  users: string[];
  status: TASK_STATUS;
}
