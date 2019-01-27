import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BooksCatalogueComponent } from './books-catalogue/books-catalogue.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { ItemComponent } from './item/item.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { FetchBooksService } from './services/fetch-books.service';
import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { UserDataService } from './services/userData.service';
import { DatabaseService } from './services/database.service';
import { ProfileCanActivate } from './profile/profile-can-activate';
import { TwoItemsContainer } from './two-items-container/two-items-container.component';
import { CarouselComponent } from './carrousel/carousel.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { EventsComponent } from './events/events.component';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BooksCatalogueComponent,
    SearchFormComponent,
    ItemComponent,
    ProfileComponent,
    TwoItemsContainer,
    CarouselComponent,
    EventsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFontAwesomeModule,
    AngularFireStorageModule,
  ],
  providers: [
    AuthService,
    DatabaseService,
    FetchBooksService,
    UserDataService,
    ProfileCanActivate,
    AngularFireStorage,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }