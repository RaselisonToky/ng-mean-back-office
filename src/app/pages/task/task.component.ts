import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TASK_STATUS } from './model/task.model';
import { TaskService } from './services/task.service';
import { AuthService } from '../auth/services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, DragDropModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
  ) {}

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  inReviewTasks: Task[] = [];
  completedTasks: Task[] = [];
  startDate: string = '';
  endDate: string = '';

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    const userId = this.authService.getUserId();
    this.taskService.findTaskByUserId(userId!).subscribe({
      next: (data) => {
        this.sortTasks(data.data);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des tâches:', error);
      }
    });
  }

  private sortTasks(tasks: Task[]) {
    this.todoTasks = tasks.filter(task => task.status === TASK_STATUS.PENDING);
    this.inProgressTasks = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
    this.inReviewTasks = tasks.filter(task => task.status === TASK_STATUS.IN_REVIEW);
    this.completedTasks = tasks.filter(task => task.status === TASK_STATUS.COMPLETED);
  }

  onSearch(): void {
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const newStatus = this.getStatusFromContainerId(event.container.id);
      const previousStatus = this.getStatusFromContainerId(event.previousContainer.id);

      if (newStatus === TASK_STATUS.COMPLETED && previousStatus !== TASK_STATUS.IN_REVIEW) {
        return;
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const task = event.container.data[event.currentIndex];
      task.status = newStatus;
      if (newStatus === TASK_STATUS.IN_PROGRESS && previousStatus === TASK_STATUS.PENDING) {
        task.maintenance_start_time = new Date();
      } else if (newStatus === TASK_STATUS.IN_REVIEW && previousStatus === TASK_STATUS.IN_PROGRESS) {
        task.review_start_time = new Date();
      }
      this.taskService.updateTask(task._id!, task).subscribe();
    }
  }

  private getStatusFromContainerId(containerId: string): TASK_STATUS {
    switch (containerId) {
      case 'todo': return TASK_STATUS.PENDING;
      case 'inProgress': return TASK_STATUS.IN_PROGRESS;
      case 'inReview': return TASK_STATUS.IN_REVIEW;
      case 'completed': return TASK_STATUS.COMPLETED;
      default: return TASK_STATUS.PENDING;
    }
  }
}
