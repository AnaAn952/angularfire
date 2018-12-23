import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

    public username: string;
    public dbRef: any;
    public dbBooks: any;
    public email: any;
    public books: any[];

    constructor(
        public userDataService: UserDataService,
        private db: AngularFireDatabase,
        public route: ActivatedRoute,
    ) {
        console.log('this', this.route.snapshot.data);

        this.dbRef = db.list('/users');
        this.dbBooks = db.list('/cartile');

        if (this.userDataService.userData) {
            this.username = this.userDataService.userData.username;
            this.email = this.userDataService.userData.email;
        }
    }

    ngOnInit() {
            // console.log('TRYING TO INITIALIZE');
            // this.username = this.userDataService.userData.username;
            // this.email = localStorage.getItem('email') || this.userDataService.userData.email;
            // console.log('profile data', this.userDataService.userData);


            let x = this.dbBooks.valueChanges().subscribe((items: any) => {
                this.books = items;

                console.log(this.books);

                if(this.books) x.unsubscribe();
            });
    }

}