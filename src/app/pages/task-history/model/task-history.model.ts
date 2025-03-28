import { Appointment } from '../../appointment/model/appointment.model'
import { Service } from '../../service/model/service.model'
import { User } from '../../user/model/user.model'
import { TASK_STATUS } from '../../task/model/task.model'

export interface TaskHistories{
  _id?: string;
  appointment: Appointment;
  service: Service;
  users: User[];
  maintenance_start_time ? : Date;
  review_start_time ? : Date
  finished_time ? : Date;
  status: TASK_STATUS;
  price: number;
  createdAt: Date;
}
