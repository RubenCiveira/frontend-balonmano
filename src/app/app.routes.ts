import { Routes } from '@angular/router';
import { ResultsExplorerComponent } from './feature/liga/components/results-explorer/results-explorer.component';
import { HomeComponent } from './feature/home/components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'partidos', component: ResultsExplorerComponent },
  { path: 'clasificacion', component: ResultsExplorerComponent },
];