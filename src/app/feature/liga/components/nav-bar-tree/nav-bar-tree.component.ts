import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  LigaApi,
  Territorial,
  Temporada,
  Categoria,
  Competicion,
  Fase,
} from '../../service/liga-api.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

type NodeKind =
  | 'territorial'
  | 'temporada'
  | 'categoria'
  | 'competicion'
  | 'fase';

interface TreeNode<T = unknown> {
  kind: NodeKind;
  label: string;
  value: T;
  children?: TreeNode[];
  loaded?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'app-nav-bar-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    MatTreeModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: 10px;
      }
    `,
  ],
  template: `
    <mat-form-field appearance="fill">
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
    <mat-form-field class="temporada" appearance="fill">
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

    <mat-form-field class="categoria" appearance="fill">
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
    <mat-form-field class="competicion" appearance="fill">
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
    <mat-form-field class="fase" appearance="fill">
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
  `,
})
export class NavBarTreeComponent implements OnInit, OnDestroy {
  territorialControl = new FormControl('');
  territorial = signal<Territorial | null>(null);
  territoriales = signal<Territorial[]>([]);
  filteredTerritorials = signal<Territorial[]>([]);

  temporada = signal<Temporada | null>(null);
  categoria = signal<Categoria | null>(null);
  competicion = signal<Competicion | null>(null);
  fase = signal<Fase | null>(null);

  temporadas = signal<Temporada[]>([]);
  categorias = signal<Categoria[]>([]);
  competiciones = signal<Competicion[]>([]);
  fases = signal<Fase[]>([]);

  private subscription = new Subscription();

  constructor(private readonly api: LigaApi, private readonly router: Router) {
    // Carga raíz (territoriales)
    effect(() => {
      firstValueFrom(this.api.territoriales()).then((list) => {
        this.territoriales.set(list);
        this.territorial.set(null);
      });
    });
    effect(async () => {
      const territorial = this.territorial();
      if (territorial) {
        this.router.navigate(['t', territorial.code]);
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
        this.router.navigate([
          't',
          temporada.territorial.code,
          's',
          temporada.code,
        ]);
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
        this.router.navigate([
          't',
          categoria.temporada.territorial.code,
          's',
          categoria.temporada.code,
          'cat',
          categoria.code,
        ]);
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
        this.router.navigate([
          't',
          competicion.categoria.temporada.territorial.code,
          's',
          competicion.categoria.temporada.code,
          'cat',
          competicion.categoria.code,
          'comp',
          competicion.categoria.code,
        ]);
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
        this.router.navigate([
          't',
          fase.competicion.categoria.temporada.territorial.code,
          's',
          fase.competicion.categoria.temporada.code,
          'cat',
          fase.competicion.categoria.code,
          'comp',
          fase.competicion.categoria.code,
          'f',
          fase.code,
        ]);
      } else {
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
