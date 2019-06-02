import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from './services/userData.service';
import { EventsService } from './services/fetch-books.service';
import { GraphService } from './graph/graph.service';
import { TranslateService } from './services/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
      public authService: AuthService,
      public db: AngularFireDatabase,
      public userDataService: UserDataService,
      public eventsService: EventsService,
      public graphService: GraphService,
      public translate: TranslateService,
  ) {
    // check if there is already a logged in user -> there is already an email in the local storage
    let email = localStorage.getItem('email');
    // it should make the userData service have all the necessary details about the user
    this.resetUserData(email);
  }

  ngOnInit() {
    // set user data each time a user logs in
    this.eventsService.onLogin.subscribe((email: string) => {
      this.resetUserData(email);
    });

    this.translate.ref.valueChanges().subscribe((data: any) => {
      this.translate.trans = data;
    });
  }

  public resetUserData(email: any) {
    if (!email) return;
    let list = this.db.list('/users', ref => ref.orderByChild('email').equalTo(email));
    let a = list.valueChanges().subscribe((userData: any) => {
      if (userData[0].email) {
        this.userDataService.setUserData(userData[0]);
      }
      a.unsubscribe();
    });
  }

}
