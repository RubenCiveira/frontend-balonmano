import { Injectable } from '@angular/core';

declare global {
  interface Window {
    _paq: any[];
  }
}

@Injectable({ providedIn: 'root' })
export class MatomoService {
  private matomoUrl = 'https://matomo.civeira.net/';
  private siteId = '1';
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    const win = window as any;
    win._paq = win._paq || [];
    const _paq = win._paq;

    // Configuración básica
    _paq.push(['enableLinkTracking']);
    _paq.push(['setTrackerUrl', this.matomoUrl + 'matomo.php']);
    _paq.push(['setSiteId', this.siteId]);

    // Inyectar el script de Matomo
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = this.matomoUrl + 'matomo.js';
    s.parentNode?.insertBefore(g, s);
  }

  trackPageView(title?: string) {
    const _paq = (window as any)._paq || [];
    if (title) {
      _paq.push(['setDocumentTitle', title]);
    }
    _paq.push(['setCustomUrl', window.location.href]);
    _paq.push(['trackPageView']);
  }

  trackEvent(category: string, action: string, name?: string, value?: number) {
    const _paq = (window as any)._paq || [];
    const args: any[] = ['trackEvent', category, action];
    if (name !== undefined) {
      args.push(name);
    }
    if (value !== undefined) {
      args.push(value);
    }
    _paq.push(args);
  }

  // Para setear usuario logueado (opcional)
  setUserId(userId: string | null) {
    const _paq = (window as any)._paq || [];
    if (userId) {
      _paq.push(['setUserId', userId]);
    } else {
      _paq.push(['resetUserId']);
    }
  }

  // Props custom a nivel de visita (ej. rol, plan, etc.)
  setCustomDimension(index: number, value: string | null) {
    const _paq = (window as any)._paq || [];
    _paq.push(['setCustomDimension', index, value]);
  }
}
