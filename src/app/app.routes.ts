import { Routes } from '@angular/router'
import { MainComponent } from './main/main.component';


export const ROUTES: Routes = [
    { path: ':id', component: MainComponent }
]
