import { Component, inject } from '@angular/core'
import { TaskHistories } from './model/task-history.model'
import { TaskHistoryService } from './services/task-history.service'
import { UtilsService } from '../../shared/utils/utils.service'
import { CustomTableComponent } from '../../shared/ui/custom-table/custom-table.component'
import { CurrencyPipe, NgStyle } from '@angular/common'

@Component({
  selector: 'app-task-history',
  imports: [
    CustomTableComponent,
    CurrencyPipe,
    NgStyle,
  ],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.css'
})
export class TaskHistoryComponent {
  private taskHistoriesService = inject(TaskHistoryService);
  protected utilsService = inject(UtilsService);

  height = '909px';
  taskHistories : TaskHistories[] = [];
  startDate: string = '';
  endDate: string = '';
  tableHeaders = [
    'Matricule',
    'Service',
    'Mécanicien',
    'Debut maintenance',
    'Debut Verification',
    'Fin',
    'Prix',
    'Date'
  ];

  ngOnInit() {
    const firstDay = new Date();
    const lastDay = new Date();
    this.startDate = this.utilsService.formatDateForInput(firstDay);
    this.endDate = this.utilsService.formatDateForInput(lastDay);
    this.loadTaskHistories();
  }

  loadTaskHistories(){
    const firstDay = this.startDate ? new Date(this.startDate) : new Date();
    const lastDay = this.endDate ? new Date(this.endDate) : new Date();
    this.taskHistoriesService.getAll(firstDay, lastDay).subscribe({
      next: (data) => {
        console.log(data.data);
        this.taskHistories = data.data;
      }
    })
  }
}
