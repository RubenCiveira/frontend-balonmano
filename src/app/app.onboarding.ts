import { IStepOption } from 'ngx-ui-tour-md-menu';

export function onboard(): any {
  return {
    '/': [
      {
        anchorId: 'go-to-partidos',
        title: 'Ver partidos',
        content: 'Ir a ver los partidos de la ultima jornada',
      },
      {
        anchorId: 'go-to-clasificacion',
        title: 'Ver clasificacion',
        content: 'Ir a ver las clasificacion de la ultima jornada',
      },
    ],
    '/partidos': [
      {
        anchorId: 'estado-partido',
        title: 'Estado',
        content: 'Indicación sobre si el partido está terminado o no',
      },
      {
        anchorId: 'resultado-partido',
        title: 'Resultado',
        content: 'Resultado del partido',
      },
      {
        anchorId: 'fecha-partido',
        title: 'Fecha y hora',
        content: 'La fecha y hora del partido: (planificada o pasada, según el estado)',
      },
      {
        anchorId: 'lugar-partido',
        title: 'Lugar del partido',
        content: 'El nombre del polideportivo donde se jugará el partido (o se ha jugado)',
      }
    ],
    '/clasificacion': [
      {
        anchorId: 'partidos-ganados',
        title: 'Partidos ganados',
        content: 'El número de partidos ganados de los jugados',
      },
      {
        anchorId: 'partidos-empatados',
        title: 'Partidos empatados',
        content: 'El número de partidos empatados de los jugados',
      },
      {
        anchorId: 'partidos-perdidos',
        title: 'Partidos perdidos',
        content: 'El número de partidos perdidos de los jugados',
      },
      {
        anchorId: 'goles-marcados',
        title: 'Goles marcados',
        content: 'Cantidad de goles marcados por el equipo',
      },
      {
        anchorId: 'goles-recividos',
        title: 'Goles recividos',
        content: 'Cantidad de goles recividos por el equipo',
      },
    ],
  };
}
