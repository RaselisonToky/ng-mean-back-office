import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appTailwind]'
})
export class TailwindResetDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Ajoute la classe 'tailwind-reset' à l'élément hôte
    this.renderer.addClass(this.el.nativeElement, 'tailwind-reset');
  }
}
