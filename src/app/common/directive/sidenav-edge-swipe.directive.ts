import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Directive({
  selector: '[appSidenavEdgeSwipe]',
  standalone: true,
})
export class SidenavEdgeSwipeDirective {
  @Input({ required: true }) appSidenavEdgeSwipe!: MatSidenav;

  private startX = 0;
  private startY = 0;
  private tracking = false;
  private readonly EDGE = 24;     // px desde el borde
  private readonly MIN_X = 40;    // desplazamiento mínimo horizontal
  private readonly MAX_ANGLE = 25; // tolerancia en grados

  constructor(private host: ElementRef<HTMLElement>) {
    // ayuda al navegador a no interpretar doble-tap/zoom
    this.host.nativeElement.style.touchAction = 'pan-y';
  }

  @HostListener('pointerdown', ['$event'])
  onDown(ev: PointerEvent) {
    if (ev.pointerType !== 'touch' && ev.pointerType !== 'pen') return;
    if (this.appSidenavEdgeSwipe.opened) return;

    // Solo si empieza en el borde izquierdo
    if (ev.clientX > this.EDGE) return;

    this.tracking = true;
    this.startX = ev.clientX;
    this.startY = ev.clientY;
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
  }

  @HostListener('pointermove', ['$event'])
  onMove(ev: PointerEvent) {
    if (!this.tracking) return;

    const dx = ev.clientX - this.startX;
    const dy = ev.clientY - this.startY;

    // filtra arrastres muy verticales
    const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
    if (dx > this.MIN_X && angle < this.MAX_ANGLE) {
      this.tracking = false;
      this.appSidenavEdgeSwipe.open();
    }
  }

  @HostListener('pointerup')
  @HostListener('pointercancel')
  onUp() {
    this.tracking = false;
  }
}
