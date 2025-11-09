// src/app/features/results-explorer/results-explorer.component.ts
import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';


import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  LigaApi,
  Territorial,
  Temporada,
  Categoria,
  Competicion,
  Fase,
  Jornada,
  Partido,
  Clasificacion,
} from '../../service/liga-api.service';
import { firstValueFrom, map, startWith, Subscription } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  styles: [`
  `],
  template: `
    <!-- <mat-card> -->

    <div class="actions" style="margin-top:12px;">
      <mat-button-toggle-group
        [value]="viewMode()"
        (change)="viewMode.set($event.value)"
      >
        <mat-button-toggle value="partidos"
          ><mat-icon>sports_handball</mat-icon> Partidos</mat-button-toggle
        >
        <mat-button-toggle value="clasificacion"
          ><mat-icon>format_list_numbered</mat-icon>
          Clasificación</mat-button-toggle
        >
      </mat-button-toggle-group>
    </div>

    <mat-expansion-panel [expanded]="true">
         <mat-expansion-panel-header>
            <mat-panel-title> Competición </mat-panel-title>
         </mat-expansion-panel-header>

      <!-- Territorial -->
      <mat-form-field class="territorial" appearance="outline">
        <mat-label>Territorial</mat-label>
        <input
          type="text"
          placeholder="Territorial"
          matInput
          [formControl]="territorialControl"
          [matAutocomplete]="autoTerritoriales"
        />
        <mat-autocomplete
          #autoTerritoriales="matAutocomplete"
          [displayWith]="display"
          (optionSelected)="territorial.set($event.option.value)"
        >
          @for (option of filteredTerritorials(); track option.code) {
          <mat-option [value]="option">{{ option.label }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>

      <mat-form-field class="temporada" appearance="outline">
        <mat-label>Temporada</mat-label>
        <mat-select
          [disabled]="!territorial() || temporadas().length === 0"
          [value]="temporada()"
          (selectionChange)="temporada.set($event.value)"
        >
          @for (s of temporadas(); track s.code) {
          <mat-option [value]="s">{{ s.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field class="categoria" appearance="outline">
        <mat-label>Categoria</mat-label>
        <mat-select
          [disabled]="!temporada() || categorias().length === 0"
          [value]="categoria()"
          (selectionChange)="categoria.set($event.value)"
        >
          @for (s of categorias(); track s.code) {
          <mat-option [value]="s">{{ s.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field class="competicion" appearance="outline">
        <mat-label>Competicion</mat-label>
        <mat-select
          [disabled]="!categoria() || competiciones().length === 0"
          [value]="competicion()"
          (selectionChange)="competicion.set($event.value)"
        >
          @for (s of competiciones(); track s.code) {
          <mat-option [value]="s">{{ s.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field class="fase" appearance="outline">
        <mat-label>Fase</mat-label>
        <mat-select
          [disabled]="!categoria() || fases().length === 0"
          [value]="fase()"
          (selectionChange)="fase.set($event.value)"
        >
          @for (s of fases(); track s.code) {
          <mat-option [value]="s">{{ s.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </mat-expansion-panel>

    <div class="toolbar">

    </div>

    <mat-card style="margin-top:12px;">
      <mat-form-field appearance="outline">
        <mat-label>Jornada</mat-label>
        <mat-select
          [disabled]="!fase() || jornadas().length === 0"
          [value]="jornada()"
          (selectionChange)="jornada.set($event.value)"
        >
          @for (s of jornadas(); track s.code) {
          <mat-option [value]="s">{{ s.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      @if (loading()) {
      <div style="display:flex; gap:8px; align-items:center;">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="24"
        ></mat-progress-spinner>
        Cargando…
      </div>
      } @else { @if (viewMode() === 'partidos') {
      <p>Partidos</p>
      } @else {
      <p>Clasificacion</p>
      } }
    </mat-card>
  `,
})
export class ResultsExplorerComponent implements OnInit, OnDestroy {
  // selections (signals)
  territorialControl = new FormControl('');
  territorial = signal<Territorial | null>(null);
  territoriales = signal<Territorial[]>([]);
  filteredTerritorials = signal<Territorial[]>([]);

  temporada = signal<Temporada | null>(null);
  categoria = signal<Categoria | null>(null);
  competicion = signal<Competicion | null>(null);
  fase = signal<Fase | null>(null);
  jornada = signal<Jornada | null>(null);

  temporadas = signal<Temporada[]>([]);
  categorias = signal<Categoria[]>([]);
  competiciones = signal<Competicion[]>([]);
  fases = signal<Fase[]>([]);
  jornadas = signal<Jornada[]>([]);

  // data
  viewMode = signal<ViewMode>('partidos');
  matches = signal<Partido[]>([]);
  standings = signal<Clasificacion[]>([]);
  loading = signal<boolean>(false);

  subscription = new Subscription();

  constructor(private readonly api: LigaApi) {
    // Load territorials on start
    effect(() => {
      firstValueFrom(this.api.territoriales()).then((list) => {
        this.territoriales.set(list);
        this.territorial.set(null);
      });
    });
    effect(async () => {
      const territorial = this.territorial();
      if (territorial) {
        firstValueFrom(this.api.temporadas(territorial)).then((list) => {
          this.temporadas.set(list);
          this.temporada.set(null);
        });
      } else {
        setTimeout(() => {
          this.temporadas.set([]);
          this.temporada.set(null);
        });
      }
    });
    effect(() => {
      const temporada = this.temporada();
      if (temporada) {
        firstValueFrom(this.api.categorias(temporada)).then((list) => {
          this.categorias.set(list);
          this.categoria.set(null);
        });
      } else {
        setTimeout(() => {
          this.categorias.set([]);
          this.categoria.set(null);
        });
      }
    });
    effect(() => {
      const categoria = this.categoria();
      if (categoria) {
        firstValueFrom(this.api.competiciones(categoria)).then((list) => {
          this.competiciones.set(list);
          this.competicion.set(null);
        });
      } else {
        setTimeout(() => {
          this.competiciones.set([]);
          this.competicion.set(null);
        });
      }
    });
    effect(() => {
      const competicion = this.competicion();
      if (competicion) {
        firstValueFrom(this.api.fases(competicion)).then((list) => {
          this.fases.set(list);
          this.fase.set(null);
        });
      } else {
        setTimeout(() => {
          this.fases.set([]);
          this.fase.set(null);
        });
      }
    });
    effect(() => {
      const fase = this.fase();
      if (fase) {
        firstValueFrom(this.api.jornadas(fase)).then((list) => {
          this.jornadas.set(list);
          this.jornada.set(null);
        });
      } else {
        setTimeout(() => {
          this.jornadas.set([]);
          this.jornada.set(null);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription.add(
      this.territorialControl.valueChanges.subscribe((text) => {
        const list = this.territoriales();
        if (!(text as any).label) {
          this.filteredTerritorials.set(
            text
              ? list.filter((territorial) =>
                  text
                    ? territorial.label
                        .toUpperCase()
                        .includes(text.toUpperCase())
                    : false
                )
              : list
          );
        }
      })
    );
  }

  display(item: any) {
    return item?.label ?? '';
  }
}
