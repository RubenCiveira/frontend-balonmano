import {
  ApplicationRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavBarTreeComponent } from './feature/liga/components/nav-bar-tree/nav-bar-tree.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, Subscription } from 'rxjs';
import { SmallDeviceBreakPoints } from './feature/liga/service/break-point.service';
import { TourMatMenuModule, TourService } from 'ngx-ui-tour-md-menu';
import { onboard } from './app.onboarding';

@Component({
  selector: 'app-root',
  imports: [
    TourMatMenuModule,
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
    private readonly appRef: ApplicationRef,
    private readonly tourService: TourService,
    private readonly breakpoint: BreakpointObserver
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        if( this.isHandset() ) {
          this.sidenav()?.close();
        }
        this.tourService.end();
        const key = 'tour-executed-' + e.url.split('?')[0];
        if (!localStorage.getItem(key)) {
          setTimeout(() => {
            localStorage.setItem(key, 'true');
            this.help();
          });
        }
      });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.breakpoint
        .observe(Object.values(SmallDeviceBreakPoints))
        .subscribe((res) => {
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

  help() {
    const url = this.router.url.split('?')[0];
    const steps = onboard()[url] ?? [];
    this.tourService.end();
    this.tourService.initialize(steps, {
      enableBackdrop: true,
      backdropConfig: {
        offset: 10,
      },
    });
    this.appRef.whenStable().then(() => {
      this.tourService.start();
    });
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
