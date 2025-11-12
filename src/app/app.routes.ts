import { Routes } from '@angular/router';
import { ResultsExplorerComponent } from './feature/liga/components/results-explorer/results-explorer.component';
import { HomeComponent } from './feature/home/components/home/home.component';
import { TeamComponent } from './feature/liga/components/team/team.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'partidos', component: ResultsExplorerComponent },
  { path: 'clasificacion', component: ResultsExplorerComponent },
  { path: 'team/:team', component: TeamComponent },
];