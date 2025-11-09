import { Routes } from '@angular/router';
import { ResultsExplorerComponent } from './feature/liga/components/results-explorer/results-explorer.component';

export const routes: Routes = [
  { path: '', component: ResultsExplorerComponent },
  { path: 't/:territorial', component: ResultsExplorerComponent },
  { path: 't/:territorial/s/:temporada', component: ResultsExplorerComponent },
  { path: 't/:territorial/s/:temporada/cat/:categoria', component: ResultsExplorerComponent },
  { path: 't/:territorial/s/:temporada/cat/:categoria/comp/:competicion', component: ResultsExplorerComponent },
  { path: 't/:territorial/s/:temporada/cat/:categoria/comp/:competicion/f/:fase', component: ResultsExplorerComponent },
  { path: 't/:territorial/s/:temporada/cat/:categoria/comp/:competicion/f/:fase/v/:view', component: ResultsExplorerComponent },
  { path: 't/:territorial/s/:temporada/cat/:categoria/comp/:competicion/f/:fase/j/:jornada/v/:view', component: ResultsExplorerComponent },
];