import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  DetalleEquipo,
  Equipo,
  Fase,
  LigaApi,
} from '../../service/liga-api.service';
import { SelectionStore } from '../../service/selection-store.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  styleUrl: './team.component.scss',
  templateUrl: './team.component.html',
})
export class TeamComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  loading = signal<boolean>(true);
  team = signal<Equipo | null>(null);
  detalle = signal<DetalleEquipo | null>(null);

  public constructor(
    private readonly api: LigaApi,
    public readonly store: SelectionStore,
    private readonly location: Location,
    private readonly route: Router,
    private readonly actived: ActivatedRoute
  ) {
    effect(() => {
      const fase = this.store.fase();
      const equipo = this.team();
      if (fase && equipo) {
        this.loadEquipo(fase, equipo);
      }
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.actived.params.subscribe((p) => {
        this.team.set({ code: p['team'], label: p['team'] } as Equipo);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  volver() {
    this.location.back();
  }

  verPartidos() {
    this.route.navigate(['/partidos'], {
      replaceUrl: true,
      queryParamsHandling: 'preserve',
    });
  }

  verClasificacion() {
    this.route.navigate(['/clasificacion'], {
      replaceUrl: true,
      queryParamsHandling: 'preserve',
    });
  }

  private loadEquipo(fase: Fase | null, equipo: Equipo | null) {
    if (fase && equipo) {
      setTimeout(() => {
        this.loading.set(true);
        this.subscription.add(
          this.api.detalleEquipo(fase, equipo).subscribe((d) => {
            this.detalle.set(d);
            this.loading.set(false);
          })
        );
      });
    }
  }
}
