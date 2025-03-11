import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper-progress',
  imports: [CommonModule],
  templateUrl: './stepper-progress.component.html',
  styleUrl: './stepper-progress.component.css'
})
export class StepperProgressComponent implements OnInit {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 3;
  stepLabels: string[] = ['User & Vehicle', 'Services', 'Review'];
  stepArray: number[] = [];

  get progress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  getCircleClass(index: number): string {
    if (index + 1 < this.currentStep) {
      return 'stepper-circle completed';
    } else if (index +1 === this.currentStep) {
      return 'stepper-circle active';
    } else {
      return 'stepper-circle';
    }
  }

  ngOnInit(): void {
    this.stepArray = Array.from({ length: this.totalSteps }, (_, i) => i);
  }
}
