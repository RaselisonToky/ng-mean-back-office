import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { Router } from '@angular/router';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { DetailsComponent } from './details/details.component';
import { VerificationComponent } from './verification/verification.component';
@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GeneralInfoComponent,
    DetailsComponent,
    VerificationComponent
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css',
  
})
export class DeliveryComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  totalSteps: number = 3;
  action: string | null = 'create';


  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'create';
      this.currentStep = +params['step'] || 1;
      console.log('Action:', params['action']);
      console.log('Step:', params['step']);
    });

  }
  ngOnDestroy(): void {

  }

  goToNextStep(event: Event): void {
    event.preventDefault();
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.router.navigate(['inventory/deliveries'], {
          queryParams: {
            action: this.action,
            step: this.currentStep
          }
        });
      }
    }
    );
  }

}
