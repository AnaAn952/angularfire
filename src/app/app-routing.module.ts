import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksCatalogueComponent } from './books-catalogue/books-catalogue.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileCanActivate } from './profile/profile-can-activate';
import { EventsComponent } from './events/events.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/books',
  },
  {
    path: 'books',
    component: BooksCatalogueComponent,
  },
  {
    path: 'profile',
    canActivate: [ProfileCanActivate],
    component: ProfileComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: '**',
    redirectTo: '/books'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
