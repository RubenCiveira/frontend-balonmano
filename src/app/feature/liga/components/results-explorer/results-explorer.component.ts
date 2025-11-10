import { Component, effect, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  LigaApi,
  Partido,
  Clasificacion,
} from '../../service/liga-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionStore } from '../../service/selection-store.service';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { RouterModule } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { SidenavService } from '../../service/sidenav.service';

@Component({
  selector: 'app-results-explorer',
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
  styleUrls: ['./results-explorer.component.scss'],
  templateUrl: './results-explorer.component.html',
})
export class ResultsExplorerComponent {
  partidos = signal<Partido[]>([]);
  clasificaciones = signal<Clasificacion[]>([]);
  loading = signal<boolean>(true);

  constructor(
    public readonly store: SelectionStore,
    private readonly sidenavService: SidenavService,
    private readonly api: LigaApi
  ) {
    // Load territorials on start
    effect(() => {
      const view = this.store.viewMode();
      const jornada = this.store.jornada();
      const fase = this.store.fase();
      if (fase) {
        setTimeout(() => {
          this.loading.set(true);
          if (view === 'partidos') {
            if (jornada) {
              this.api.partidos(jornada).subscribe((p) => {
                this.partidos.set(p);
                this.loading.set(false);
              });
            } else {
              this.api.ultimosPartidos(fase).subscribe((p) => {
                this.partidos.set(p);
                this.loading.set(false);
              });
            }
          } else {
            if (jornada) {
              this.api.clasificacion(jornada).subscribe((p) => {
                this.clasificaciones.set(p);
                this.loading.set(false);
              });
            } else {
              this.api.ultimaClasificacion(fase).subscribe((p) => {
                this.clasificaciones.set(p);
                this.loading.set(false);
              });
            }
          }
        });
      } else {
        setTimeout(() => {
          this.partidos.set([]);
          this.clasificaciones.set([]);
        });
      }
    });
  }

  openMenu() {
    this.sidenavService.open();
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
