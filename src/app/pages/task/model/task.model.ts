import {Appointment} from '../../appointment/model/appointment.model';
import {Service} from '../../service/model/service.model';
import {User} from '../../user/model/user.model';

export enum TASK_STATUS {
  PENDING= 'PENDING',
  COMPLETED= 'COMPLETED',
  PAUSED= 'PAUSED',
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
