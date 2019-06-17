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
import { EventsService } from './services/fetch-books.service';
import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { UserDataService } from './services/userData.service';
import { DatabaseService } from './services/database.service';
import { ProfileCanActivate } from './profile/profile-can-activate';
import { TwoItemsContainer } from './two-items-container/two-items-container.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { ChatComponent } from './chat/chat.component';
import { EventItemComponent } from './organized-events/event-item/event-item.component';
import { OrganizedEventsComponent } from './organized-events/organized-events.component';
import { PersonItemComponent } from './person/person-item/person-item.component';
import { CarouselCustomComponent } from './carrousel/carousel-custom/carousel-custom.component';
import { CarouselOneComponent } from './carrousel/carousel-chosenByMe/carousel-1.component';
import { CarouselTwoComponent } from './carrousel/carousel-solicitate/carousel-2.component';
import { CarouselComponent } from './carrousel/carousel-myBooks/carousel.component';
import { AccessGuard } from './services/access-guard';
import { BookTrackingComponent } from './book-tracking/book-tracking.component';
import { GraphService } from './graph/graph.service';
import { PdfConvertComponent } from './organized-events/pdf-convert/pdf-convert.component';
import { CarouselFinalizateComponent } from './carrousel/carousel-finalizate/carousel-finalizate.component';
import { CarouselConfirmateComponent } from './carrousel/carousel-confirmate/carousel-confirmate.component';
import { CarouselRaportateComponent } from './carrousel/carousel-raportate/carousel-raportate.component';
import { TranslateService } from './services/translate.service';
import { TranslationsCanActivate } from './services/translations-can-activate';
import { TranslationsRes } from './services/translations-res';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BooksCatalogueComponent,
    SearchFormComponent,
    ItemComponent,
    ProfileComponent,
    TwoItemsContainer,
    ChatComponent,
    OrganizedEventsComponent,
    EventItemComponent,
    PersonItemComponent,
    CarouselComponent,
    CarouselCustomComponent,
    CarouselOneComponent,
    CarouselTwoComponent,
    CarouselFinalizateComponent,
    CarouselConfirmateComponent,
    CarouselRaportateComponent,
    BookTrackingComponent,
    PdfConvertComponent,
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
    EventsService,
    UserDataService,
    ProfileCanActivate,
    AngularFireStorage,
    AccessGuard,
    GraphService,
    TranslateService,
    TranslationsCanActivate,
    TranslationsRes,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }