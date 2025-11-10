// sidenav.service.ts
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private ref: MatSidenav | null = null;

  attach(sidenav: MatSidenav) { this.ref = sidenav; }
  detach() { this.ref = null; }

  isAttached() { return !!this.ref; }
  opened() { return this.ref?.opened ?? false; }

  async open()   { await this.ref?.open(); }
  async close()  { await this.ref?.close(); }
  async toggle() { await this.ref?.toggle(); }
}
