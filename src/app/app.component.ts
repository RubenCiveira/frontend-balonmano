import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavBarTreeComponent } from './feature/liga/components/nav-bar-tree/nav-bar-tree.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, NavBarTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ui';
}
