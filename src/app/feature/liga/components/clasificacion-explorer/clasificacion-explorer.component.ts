import { Component, effect, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  LigaApi,
  Partido,
  Clasificacion,
  Equipo,
} from '../../service/liga-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionStore } from '../../service/selection-store.service';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { Router, RouterModule } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { SidenavService } from '../../service/sidenav.service';
import { Subscription } from 'rxjs';
import { TeamComponent } from '../team/team.component';

@Component({
  selector: 'app-clasificacion-explorer',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    TourMatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  styleUrls: ['./clasificacion-explorer.component.scss'],
  templateUrl: './clasificacion-explorer.component.html',
})
export class ClasificacionExplorerComponent implements OnDestroy {
  loading = signal<boolean>(true);
  clasificaciones = signal<Clasificacion[]>([]);

  private subscription = new Subscription();

  constructor(
    private readonly dialog: MatDialog,
    private readonly api: LigaApi,
    private readonly route: Router,
    public readonly store: SelectionStore,
    private readonly sidenavService: SidenavService
  ) {
    // Load territorials on start
    effect(() => {
      const jornada = this.store.jornada();
      const fase = this.store.fase();
      if (fase) {
        setTimeout(() => {
          this.loading.set(true);

          if (jornada) {
            this.subscription.add(
              this.api.clasificacion(jornada).subscribe((p) => {
                this.clasificaciones.set(p);
                this.loading.set(false);
              })
            );
          } else {
            this.subscription.add(
              this.api.ultimaClasificacion(fase).subscribe((p) => {
                this.clasificaciones.set(p);
                this.loading.set(false);
              })
            );
          }
        });
      } else {
        setTimeout(() => {
          this.clasificaciones.set([]);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openMenu() {
    this.sidenavService.open();
  }

  detalle(e: Equipo) {
    this.route.navigate(['/team', e.code], {
      replaceUrl: true,
      queryParamsHandling: 'preserve',
    });
  }

  date(p: Partido): string {
    const fmt = new Intl.DateTimeFormat(navigator.languages, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    return fmt.format(new Date(p.fecha));
  }

  compareByCode(a?: { code: string } | null, b?: { code: string } | null) {
    return !!a && !!b && a.code === b.code;
  }
}
