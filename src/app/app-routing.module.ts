import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksCatalogueComponent } from './books-catalogue/books-catalogue.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books',
  },
  {
    path: 'books',
    component: BooksCatalogueComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
