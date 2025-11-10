import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Territorial } from '../../service/liga-api.service';
import { SelectionStore } from '../../service/selection-store.service';

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
        (optionSelected)="store.setTerritorial($event.option.value)"
      >
        @for (option of filteredTerritorials(); track option.code) {
        <mat-option [value]="option">{{ option.label }}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
    <mat-form-field class="temporada" appearance="fill">
      <mat-label>Temporada</mat-label>
      <mat-select
        [disabled]="!store.territorial() || store.temporadas().length === 0"
        [value]="store.temporada()"
        [compareWith]="compareByCode"
        (selectionChange)="store.setTemporada($event.value)"
      >
        @for (s of store.temporadas(); track s.code) {
        <mat-option [value]="s">{{ s.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>

    <mat-form-field class="categoria" appearance="fill">
      <mat-label>Categoria</mat-label>
      <mat-select
        [disabled]="!store.temporada() || store.categorias().length === 0"
        [value]="store.categoria()"
        [compareWith]="compareByCode"
        (selectionChange)="store.setCategoria($event.value)"
      >
        @for (s of store.categorias(); track s.code) {
        <mat-option [value]="s">{{ s.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
    <mat-form-field class="competicion" appearance="fill">
      <mat-label>Competicion</mat-label>
      <mat-select
        [disabled]="!store.categoria() || store.competiciones().length === 0"
        [value]="store.competicion()"
        [compareWith]="compareByCode"
        (selectionChange)="store.setCompeticion($event.value)"
      >
        @for (s of store.competiciones(); track s.code) {
        <mat-option [value]="s">{{ s.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
    <mat-form-field class="fase" appearance="fill">
      <mat-label>Fase</mat-label>
      <mat-select
        [disabled]="!store.categoria() || store.fases().length === 0"
        [value]="store.fase()"
        [compareWith]="compareByCode"
        (selectionChange)="store.setFase($event.value)"
      >
        @for (s of store.fases(); track s.code) {
        <mat-option [value]="s">{{ s.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class NavBarTreeComponent implements OnInit, OnDestroy {
  territorialControl = new FormControl('');
  filteredTerritorials = signal<Territorial[]>([]);

  private subscription = new Subscription();

  constructor(public readonly store: SelectionStore) {
    effect(() => {
      const t = this.store.territorial();
      this.territorialControl.setValue(t as any, { emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription.add(
      this.territorialControl.valueChanges.subscribe((text) => {
        const list = this.store.territoriales();
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

  compareByCode(a?: { code: string } | null, b?: { code: string } | null) {
    return !!a && !!b && a.code === b.code;
  }
}
