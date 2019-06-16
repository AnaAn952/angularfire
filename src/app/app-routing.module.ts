import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksCatalogueComponent } from './books-catalogue/books-catalogue.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileCanActivate } from './profile/profile-can-activate';
import { ChatComponent } from './chat/chat.component';
import { OrganizedEventsComponent } from './organized-events/organized-events.component';
import { LoginComponent } from './login/login.component';
import { AccessGuard } from './services/access-guard';
import { TranslationsCanActivate } from './services/translations-can-activate';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'books',
    component: BooksCatalogueComponent,
    data: { needsLogin: true },
    canActivate: [ AccessGuard ],
    resolve: {translate: TranslationsCanActivate},
  },
  {
    path: 'profile',
    canActivate: [ProfileCanActivate],
    resolve: {translate: TranslationsCanActivate},
    component: ProfileComponent,
  },

  {
    path: 'events',
    component: OrganizedEventsComponent,
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

