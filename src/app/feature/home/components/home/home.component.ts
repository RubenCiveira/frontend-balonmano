import { Component } from '@angular/core';
import {
  SelectionStore,
  ViewMode,
} from '../../../liga/service/selection-store.service';
import { Route, Router } from '@angular/router';
import {
  Categoria,
  Competicion,
  Fase,
  Temporada,
  Territorial,
} from '../../../liga/service/liga-api.service';
import { MatButtonModule } from '@angular/material/button';

// territorial=20&temporada=2526&categoria=2605&competicion=209564&fase=1033718
@Component({
    imports: [MatButtonModule],
    template: `
    <p></p>
    <p>Carballiño</p>
    <ul>
      <li>
        Benjamines:
        <button
          mat-raised-button
          (click)="
            goTo('partidos', '20', '2526', '2605', '209564', '1033718')
          "
        >
          Partidos
        </button>
        <button
          mat-raised-button
          (click)="
            goTo('clasificacion', '20', '2526', '2605', '209564', '1033718')
          "
        >
          Clasificación
        </button>
      </li>
    </ul>
  `
})
export class HomeComponent {
  public constructor(private readonly store: SelectionStore) {}

  goTo(
    mode: ViewMode,
    territorial: string,
    temporada: string,
    categoria: string,
    competicion: string,
    fase: string
  ) {
    this.store.setViewMode(mode);
    setTimeout(() => {
        this.goToFase(territorial, temporada, categoria, competicion, fase);
    });
  }
  goToFase(
    territorial: string,
    temporada: string,
    categoria: string,
    competicion: string,
    fase: string
  ) {
    const t = {
      code: territorial,
      label: territorial,
    } as Territorial;
    const s = {
      code: temporada,
      label: temporada,
      territorial: t,
    } as Temporada;
    const ctg = {
      code: categoria,
      label: categoria,
      temporada: s,
    } as Categoria;
    const cpt = {
      code: competicion,
      label: competicion,
      categoria: ctg,
    } as Competicion;
    const fs = {
      code: fase,
      label: fase,
      competicion: cpt,
    } as Fase;
    this.store.setFase(fs);
  }
}
