import { Component, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavBarTreeComponent } from './feature/liga/components/nav-bar-tree/nav-bar-tree.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SelectionStore } from './feature/liga/service/selection-store.service';
import { Subscription } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterOutlet,
    NavBarTreeComponent,
    MatToolbarModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ui';
  sidenav = viewChild<MatSidenav>('sidenav');
  isHandset = signal<boolean>(false);

  private subscription = new Subscription();
  private queries = {
    // handset: Breakpoints.Handset, // móviles en general
    // tablet: Breakpoints.Tablet, // tablets
    // web: Breakpoints.Web, // escritorio
    xsmall: Breakpoints.XSmall, // < 600px
    small: Breakpoints.Small, // 600–959
    // medium: Breakpoints.Medium, // 960–1279
    // large: Breakpoints.Large, // 1280–1919
    // xlarge: Breakpoints.XLarge, // ≥ 1920
    // narrow: '(max-width: 959.98px)', // personalizado
    // ultraNarrow: '(max-width: 599.98px)', // personalizado
    // short: '(max-height: 600px)', // pantallas bajitas
    // portrait: '(orientation: portrait)',
    // landscape: '(orientation: landscape)',
  } as const;

  constructor(
    public readonly store: SelectionStore,
    private readonly router: Router,
    private readonly breakpoint: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.breakpoint.observe(Object.values(this.queries)).subscribe((res) => {
        this.isHandset.set(res.matches);
        if (!res.matches) {
          this.sidenav()?.open();
        } else {
          this.sidenav()?.close();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goHome(): void {
    this.router.navigate(['/'], {
      replaceUrl: true,
      queryParamsHandling: 'preserve',
    });
  }

  toggleSidenav() {
    this.sidenav()?.toggle();
  }
}
