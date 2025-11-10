// src/app/core/handball-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Territorial {
  code: string;
  label: string;
}
export interface Temporada {
  code: string;
  label: string;
  territorial: Territorial;
}
export interface Categoria {
  code: string;
  label: string;
  temporada: Temporada;
}
export interface Competicion {
  code: string;
  label: string;
  categoria: Categoria;
}
export interface Fase {
  code: string;
  label: string;
  competicion: Competicion;
}
export interface Jornada {
  code: string;
  label: string;
  fase: Fase;
}
export interface Cancha {
  code: string;
  label: string;
}
export interface Equipo {
  code: string;
  label: string;
  territorial: Territorial;
  logo: string;
}
export interface Partido {
  code: string;
  label: string;
  jornada: Jornada;
  local: Equipo;
  visitante: Equipo;
  estado: string;
  puntosLocal?: number;
  puntosVisitante: number;
  fecha: string;
  lugar?: Cancha;
}

export interface Clasificacion {
  code: string;
  label: string;
  jornada: Jornada;
  equipo: Equipo;
  posicion: number;
  puntos: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  golesMarcados: number;
  golesRecividos: number;
}

@Injectable({ providedIn: 'root' })
export class LigaApi {
  private base = 'https://balonmano.civeira.net/api/';
  private http = inject(HttpClient);

  territoriales(): Observable<Territorial[]> {
    return this.http.get<Territorial[]>(this.base + 'territorial');
  }
  temporadas(territorial: Territorial): Observable<Temporada[]> {
    // const params = new HttpParams().set('territorialId', territorialId);
    return this.http.get<Temporada[]>(
      this.base + 'territorial/' + territorial.code + '/temporada'
    );
  }
  categorias(temporada: Temporada): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(
      this.base +
        'territorial/' +
        temporada.territorial.code +
        '/temporada/' +
        temporada.code +
        '/categoria'
    );
  }
  competiciones(categoria: Categoria): Observable<Competicion[]> {
    return this.http.get<Competicion[]>(
      this.base +
        'territorial/' +
        categoria.temporada.territorial.code +
        '/temporada/' +
        categoria.temporada.code +
        '/categoria/' +
        categoria.code +
        '/competicion'
    );
  }
  fases(competicion: Competicion): Observable<Fase[]> {
    return this.http.get<Fase[]>(
      this.base +
        'territorial/' +
        competicion.categoria.temporada.territorial.code +
        '/temporada/' +
        competicion.categoria.temporada.code +
        '/categoria/' +
        competicion.categoria.code +
        '/competicion/' +
        competicion.code +
        '/fase'
    );
  }
  jornadaActual(fase: Fase): Observable<Jornada> {
    return this.http.get<Jornada>(
      this.base +
        'territorial/' +
        fase.competicion.categoria.temporada.territorial.code +
        '/temporada/' +
        fase.competicion.categoria.temporada.code +
        '/categoria/' +
        fase.competicion.categoria.code +
        '/competicion/' +
        fase.competicion.code +
        '/fase/' +
        fase.code +
        '/jornada-actual'
    );
  }
  jornadas(fase: Fase): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(
      this.base +
        'territorial/' +
        fase.competicion.categoria.temporada.territorial.code +
        '/temporada/' +
        fase.competicion.categoria.temporada.code +
        '/categoria/' +
        fase.competicion.categoria.code +
        '/competicion/' +
        fase.competicion.code +
        '/fase/' +
        fase.code +
        '/jornada'
    );
  }
  ultimosPartidos(fase: Fase): Observable<Partido[]> {
    return this.http.get<Partido[]>(
      this.base +
        'territorial/' +
        fase.competicion.categoria.temporada.territorial.code +
        '/temporada/' +
        fase.competicion.categoria.temporada.code +
        '/categoria/' +
        fase.competicion.categoria.code +
        '/competicion/' +
        fase.competicion.code +
        '/fase/' +
        fase.code +
        '/partido'
    );
  }
  ultimaClasificacion(fase: Fase): Observable<Clasificacion[]> {
    return this.http.get<Clasificacion[]>(
      this.base +
        'territorial/' +
        fase.competicion.categoria.temporada.territorial.code +
        '/temporada/' +
        fase.competicion.categoria.temporada.code +
        '/categoria/' +
        fase.competicion.categoria.code +
        '/competicion/' +
        fase.competicion.code +
        '/fase/' +
        fase.code +
        '/clasificacion'
    );
  }
  partidos(jornada: Jornada): Observable<Partido[]> {
    return this.http.get<Partido[]>(
      this.base +
        'territorial/' +
        jornada.fase.competicion.categoria.temporada.territorial.code +
        '/temporada/' +
        jornada.fase.competicion.categoria.temporada.code +
        '/categoria/' +
        jornada.fase.competicion.categoria.code +
        '/competicion/' +
        jornada.fase.competicion.code +
        '/fase/' +
        jornada.fase.code +
        '/jornada/' +
        jornada.code +
        '/partido'
    );
  }
  clasificacion(jornada: Jornada): Observable<Clasificacion[]> {
    return this.http.get<Clasificacion[]>(
      this.base +
        'territorial/' +
        jornada.fase.competicion.categoria.temporada.territorial.code +
        '/temporada/' +
        jornada.fase.competicion.categoria.temporada.code +
        '/categoria/' +
        jornada.fase.competicion.categoria.code +
        '/competicion/' +
        jornada.fase.competicion.code +
        '/fase/' +
        jornada.fase.code +
        '/jornada/' +
        jornada.code +
        '/clasificacion'
    );
  }
}
