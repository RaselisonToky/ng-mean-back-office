import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-delivery',
  imports: [],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent implements OnInit, OnDestroy {
  private linkElement!: HTMLLinkElement;
  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
    this.linkElement = this.renderer.createElement('link')
    this.linkElement.rel = 'stylesheet';
    this.linkElement.href = 'assets/tailwind-specific.css';
    this.renderer.appendChild(document.head, this.linkElement);

  }
  ngOnDestroy(): void {
    if (this.linkElement) {
      this.renderer.removeChild(document.head, this.linkElement);

    }
  }

}
