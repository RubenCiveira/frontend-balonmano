import {
  Component,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  LigaApi,
  Partido,
  Clasificacion,
} from '../../service/liga-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionStore } from '../../service/selection-store.service';
import { ActivatedRoute, Router } from '@angular/router';

type ViewMode = 'partidos' | 'clasificacion';

@Component({
  selector: 'app-results-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  styles: [``],
  template: `
    <!-- <mat-card> -->
    <div class="actions" style="margin-top:12px;">
      <mat-button-toggle-group
        [value]="store.viewMode()"
        (change)="store.setViewMode($event.value)"
      >
        <mat-button-toggle value="partidos"
          ><mat-icon>sports_handball</mat-icon> Partidos</mat-button-toggle
        >
        <mat-button-toggle value="clasificacion"
          ><mat-icon>format_list_numbered</mat-icon>
          Clasificación</mat-button-toggle
        >
      </mat-button-toggle-group>
      <mat-form-field appearance="outline">
        <mat-label>Jornada</mat-label>
        <mat-select
          [disabled]="!store.fase() || store.jornadas().length === 0"
          [value]="store.jornada()"
          [compareWith]="compareByCode"
          (selectionChange)="store.setJornada($event.value)"
        >
          @for (s of store.jornadas(); track s.code) {
          <mat-option [value]="s">{{ s.label }} {{ s.code === store.jornadaActual()?.code ? '(Actual)' : '' }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>

    <mat-card style="margin-top:12px;">

      @if (loading()) {
      <div style="display:flex; gap:8px; align-items:center;">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="24"
        ></mat-progress-spinner>
        Cargando…
      </div>
      } @else { @if (viewMode() === 'partidos') {
      <div>
        @for(p of partidos(); track p.code) {
        <p>{{ date(p) }}</p>
        <p>
          {{ p.local.label }}
          <img [src]="p.local.logo" style="width: 25px; height: 25px" />
          Vs
          <img [src]="p.visitante.logo" style="width: 25px; height: 25px" />
          {{ p.visitante.label }}
        </p>
        <p>{{ p.estado }}: {{ p.lugar?.label ?? 'PDTE.' }}</p>
        }
      </div>
      } @else {
      <p>Clasificacion</p>
      @for(c of clasificaciones(); track c.code) {
      <p>
        {{ c.posicion }} ( {{ c.puntos }})
        <img [src]="c.equipo.logo" style="width: 25px; height: 25px" />
        {{ c.equipo.label }}
        Partidos: {{ c.ganados + c.empatados + c.perdidos }} [ {{ c.ganados }} /
        {{ c.empatados }} / {{ c.perdidos }} ] Goles: +{{ c.golesMarcados }} /
        -{{ c.golesRecividos }}
      </p>
      } } }
    </mat-card>
  `,
})
export class ResultsExplorerComponent {
  // data
  viewMode = signal<ViewMode>('partidos');
  partidos = signal<Partido[]>([]);
  clasificaciones = signal<Clasificacion[]>([]);
  loading = signal<boolean>(false);

  constructor(
    public readonly store: SelectionStore,
    private readonly api: LigaApi,
    private router: Router,
    private route: ActivatedRoute
  ) {

    // Load territorials on start
    effect(() => {
      const view = this.viewMode();
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
      }
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
