import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import {
  LigaApi,
  Territorial,
  Temporada,
  Categoria,
  Competicion,
  Fase,
  Jornada,
} from '../service/liga-api.service';
import { firstValueFrom } from 'rxjs';

export type ViewMode = 'partidos' | 'clasificacion';

@Injectable({ providedIn: 'root' })
export class SelectionStore {
  viewMode = signal<ViewMode>('partidos');

  // ----------------- state (selecciones) -----------------
  territorial = signal<Territorial | null>(null);
  temporada = signal<Temporada | null>(null);
  categoria = signal<Categoria | null>(null);
  competicion = signal<Competicion | null>(null);
  fase = signal<Fase | null>(null);
  jornadaActual = signal<Jornada | null>(null);
  jornada = signal<Jornada | null>(null);

  // ----------------- listas -----------------
  territoriales = signal<Territorial[]>([]);
  temporadas = signal<Temporada[]>([]);
  categorias = signal<Categoria[]>([]);
  competiciones = signal<Competicion[]>([]);
  fases = signal<Fase[]>([]);
  jornadas = signal<Jornada[]>([]);

  // ----------------- URL sync toggles -----------------
  private syncingFromRoute = false;
  private routeParams: Signal<any>;
  private routePath: Signal<any>;

  constructor(
    private readonly api: LigaApi,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.routeParams = toSignal(
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith(null),
        map(() => this.collectParamsFromSnapshot())
      ),
      { initialValue: this.collectParamsFromSnapshot() }
    );
    effect(() => {
      // Cada vez que cambie la ruta → sincroniza menús
      this.syncFromRoute();
    });
    this.routePath = toSignal(
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith(null),
        map(() => this.getPrimaryPath(this.route.root.snapshot)) // '', 'partidos', 'clasificacion'
      ),
      { initialValue: this.getPrimaryPath(this.route.root.snapshot) }
    );
    effect(() => {
      const seg = this.routePath();
      setTimeout(() => {
        this.syncingFromRoute = true;
        try {
          // mapea '' a 'partidos' como valor por defecto
          const mode: ViewMode =
            seg === 'clasificacion' ? 'clasificacion' : 'partidos';
          this.viewMode.set(mode);
        } finally {
          this.syncingFromRoute = false;
        }
      });
    });
  }

  // ----------------- setters públicos (desde UI) -----------------
  setViewMode(mode: ViewMode) {
    if (this.syncingFromRoute) {
      return;
    }
    // path = '' para 'partidos' si quieres que la home sea partidos;
    // o usa 'partidos' explícito si prefieres URL /partidos
    const commands = mode === 'partidos' ? ['partidos'] : ['clasificacion'];
    this.router.navigate(commands, {
      // queryParams: this.buildCurrentQueryParams(), // conserva la selección actual
      replaceUrl: true,
      queryParamsHandling: 'preserve',
    });
  }
  setTerritorial(t: Territorial) {
    if (this.syncingFromRoute) {
      return;
    }
    this.router.navigate([], {
      queryParams: { territorial: t.code },
      replaceUrl: true,
    });
  }
  setTemporada(s: Temporada) {
    if (this.syncingFromRoute) {
      return;
    }
    this.router.navigate([], {
      queryParams: { territorial: s.territorial.code, temporada: s.code },
      replaceUrl: true,
    });
  }
  setCategoria(c: Categoria) {
    if (this.syncingFromRoute) {
      return;
    }
    this.router.navigate([], {
      queryParams: {
        territorial: c.temporada.territorial.code,
        temporada: c.temporada.code,
        categoria: c.code,
      },
      replaceUrl: true,
    });
  }
  setCompeticion(cmp: Competicion) {
    if (this.syncingFromRoute) {
      return;
    }
    this.router.navigate([], {
      queryParams: {
        territorial: cmp.categoria.temporada.territorial.code,
        temporada: cmp.categoria.temporada.code,
        categoria: cmp.categoria.code,
        competicion: cmp.code,
      },
      replaceUrl: true,
    });
  }
  setFase(f: Fase) {
    if (this.syncingFromRoute) {
      return;
    }
    this.router.navigate([], {
      queryParams: {
        territorial: f.competicion.categoria.temporada.territorial.code,
        temporada: f.competicion.categoria.temporada.code,
        categoria: f.competicion.categoria.code,
        competicion: f.competicion.code,
        fase: f.code,
      },
      replaceUrl: true,
    });
  }
  setJornada(j: Jornada) {
    if (this.syncingFromRoute) {
      return;
    }
    this.router.navigate([], {
      queryParams: {
        territorial: j.fase.competicion.categoria.temporada.territorial.code,
        temporada: j.fase.competicion.categoria.temporada.code,
        categoria: j.fase.competicion.categoria.code,
        competicion: j.fase.competicion.code,
        fase: j.fase.code,
        jornada: j.code,
      },
      replaceUrl: true,
    });
  }

  // ----------------- hidratar desde URL (opcional) -----------------
  private syncFromRoute() {
    const p = this.routeParams();
    setTimeout(async () => {
      try {
        this.syncingFromRoute = true;
        // 1) Territoriales
        let territoriales = this.territoriales();
        if (!territoriales.length) {
          territoriales = await firstValueFrom(this.api.territoriales());
          this.territoriales.set(territoriales);
        }
        if (p.territorial) {
          this.territorial.set(
            p.territorial
              ? territoriales.find((t) => t.code === p.territorial) ?? null
              : null
          );
        }

        const terr = this.territorial();
        // 2) Temporadas
        if (terr) {
          const temps = await firstValueFrom(this.api.temporadas(terr));
          this.temporadas.set(temps);
          this.temporada.set(
            p.temporada
              ? temps.find((s) => s.code === p.temporada) ?? null
              : null
          );
        } else {
          this.temporadas.set([]);
          this.temporada.set(null);
        }

        // 3) Categorías
        const temp = this.temporada();
        if (temp) {
          const cats = await firstValueFrom(this.api.categorias(temp));
          this.categorias.set(cats);
          this.categoria.set(
            p.categoria
              ? cats.find((c) => c.code === p.categoria) ?? null
              : null
          );
        } else {
          this.categorias.set([]);
          this.categoria.set(null);
        }

        // 4) Competiciones
        const cat = this.categoria();
        if (cat) {
          const comps = await firstValueFrom(this.api.competiciones(cat));
          this.competiciones.set(comps);
          this.competicion.set(
            p.competicion
              ? comps.find((cmp) => cmp.code === p.competicion) ?? null
              : null
          );
        } else {
          this.competiciones.set([]);
          this.competicion.set(null);
        }

        // 5) Fases
        const cmp = this.competicion();
        if (cmp) {
          const fases = await firstValueFrom(this.api.fases(cmp));
          this.fases.set(fases);
          this.fase.set(
            p.fase ? fases.find((f) => f.code === p.fase) ?? null : null
          );
        } else {
          this.fases.set([]);
          this.fase.set(null);
        }

        // 6) Jornada
        const fase = this.fase();
        if (fase) {
          const jornadaActual = await firstValueFrom(
            this.api.jornadaActual(fase)
          );
          this.jornadaActual.set(jornadaActual);
          const jornadas = await firstValueFrom(this.api.jornadas(fase));
          this.jornadas.set(jornadas);
          this.jornada.set(
            p.jornada
              ? jornadas.find((f) => f.code === p.jornada) ?? null
              : null
          );
        } else {
          this.jornadas.set([]);
          this.jornada.set(null);
        }
      } finally {
        this.syncingFromRoute = false;
      }
    });
  }

  private getPrimaryPath(snap: ActivatedRouteSnapshot): string {
    // baja por la rama primaria y devuelve el primer path ('' | 'partidos' | 'clasificacion')
    let r: ActivatedRouteSnapshot | null = snap;
    while (r?.firstChild) r = r.firstChild;
    // si la ruta final no tiene pathConfig, sube un nivel
    const node = r?.routeConfig?.path ? r : snap.firstChild;
    return node?.routeConfig?.path ?? ''; // '' si es la home
  }

  private collectParamsFromSnapshot() {
    let r: any = this.route.snapshot.queryParamMap;
    return {
      territorial: r.get('territorial'),
      temporada: r.get('temporada'),
      categoria: r.get('categoria'),
      competicion: r.get('competicion'),
      fase: r.get('fase'),
      jornada: r.get('jornada'),
    };
  }
}
