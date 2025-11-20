// src/app/core/analytics/page-time.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatomoService } from './matomo.service';

@Injectable({ providedIn: 'root' })
export class PageTimeService implements OnDestroy {
  private currentPath: string | null = null;
  private enterTime = 0;
  private sub: Subscription;

  constructor(private router: Router, private matomo: MatomoService) {
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.onRouteChange(e.urlAfterRedirects);
      });

    // Por si el usuario cambia de pestaña o cierra
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendTimeOnPage();
      }
    });
  }

  private onRouteChange(path: string) {
    // Enviamos tiempo en la ruta anterior
    this.sendTimeOnPage();

    // Nueva ruta
    this.currentPath = path;
    this.enterTime = performance.now();
  }

  private sendTimeOnPage() {
    if (!this.currentPath || !this.enterTime) {
      return;
    }
    const durationMs = performance.now() - this.enterTime;
    const durationSec = Math.round(durationMs / 1000);

    // Enviamos evento de Matomo
    this.matomo.trackEvent(
      'TimeOnPage',                 // category
      this.currentPath,            // action (ruta)
      'duration_sec',              // name
      durationSec                  // value
    );

    this.enterTime = 0;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.sendTimeOnPage();
  }
}
