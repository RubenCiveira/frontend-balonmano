import { Component } from '@angular/core';
import {
  SelectionStore,
  ViewMode,
} from '../../../liga/service/selection-store.service';
import {
  Categoria,
  Competicion,
  Fase,
  Temporada,
  Territorial,
} from '../../../liga/service/liga-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [
    MatButtonModule,
    TourMatMenuModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
  ],
  styles: [ `
  .team-card { max-width: 400px; }
    `],
  template: `
    @for (link of data; track link) {
    <mat-card class="team-card" appearance="outlined">
      <mat-card-header>
        <mat-card-title>{{ link.group }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          @for (item of link.equipos; track item) {
          <mat-list-item>
            <div matListItemTitle>{{ item.name }}</div>
            <button
              matIconButton
              matListItemMeta
              (click)="
                goTo(
                  'partidos',
                  link.territorial,
                  temporada,
                  item.categoria,
                  item.competicion,
                  item.fase
                )
              "
            >
              <mat-icon>sports_handball</mat-icon>
            </button>
            <button
              matIconButton
              matListItemMeta
              (click)="
                goTo(
                  'clasificacion',
                  link.territorial,
                  temporada,
                  item.categoria,
                  item.competicion,
                  item.fase
                )
              "
            >
              <mat-icon>format_list_numbered</mat-icon>
              Clasificación
            </button>
          </mat-list-item>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>
    }
  `,
})
export class HomeComponent {
  temporada = '2526';

  data = [
    {
      group: 'Carballiño',
      territorial: '20',
      equipos: [
        {
          name: 'Benjamines',
          categoria: '2605',
          competicion: '209564',
          fase: '1033718',
        },
        {
          name: 'Alevines 5',
          categoria: '2604',
          competicion: '209563',
          fase: '1033727',
        },
      ],
    },
  ];
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
