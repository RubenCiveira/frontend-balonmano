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
import { Subscription } from 'rxjs';
import { SmallDeviceBreakPoints } from './feature/liga/service/break-point.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterOutlet,
    NavBarTreeComponent,
    MatToolbarModule,
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

  constructor(
    private readonly router: Router,
    private readonly breakpoint: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.breakpoint.observe(Object.values(SmallDeviceBreakPoints)).subscribe((res) => {
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
