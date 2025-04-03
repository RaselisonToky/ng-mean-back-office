import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-place-holder-loading',
  imports: [CommonModule],
  templateUrl: './place-holder-loading.component.html',
  styleUrl: './place-holder-loading.component.css'
})
export class PlaceHolderLoadingComponent {
  @Input() width: string = '100%';
  @Input() height: string = '100px';
  @Input() type: 'card' | 'text-line' | 'image' | 'circle' | 'chart' = 'card';
  @Input() animate: boolean = true;
}
