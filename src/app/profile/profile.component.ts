import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from '../services/database.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

    public dbBooks: any;
    public myBooks: any[] = [];
    public chosenBooks: any[] = [];
    public bks: any[] = [];

    constructor(
        public userDataService: UserDataService,
        private db: AngularFireDatabase,
        public databaseService: DatabaseService,
    ) {
        this.dbBooks = db.list('/cartile');
    }

    ngOnInit() {
        let x = this.dbBooks.valueChanges().subscribe((items: any) => {
            this.myBooks = items.filter((book) => {
                return book.id.split('.com_')[0] + '.com' === this.userDataService.userData.email;
            });

            this.chosenBooks = items.filter((book) => {
                let chosenBooksArray = Object.keys(this.userDataService.userData.chosenBooks).map((key) => {
                    return this.userDataService.userData.chosenBooks[key];
                });

                let chosenBooksIds: any[] = chosenBooksArray.map((book) => book.id);

                for (let i of chosenBooksIds) {
                    if (i == book.id)
                        return true;
                }
                return false;
            });

            // cartile din bks cu tot cu object key-ul
            let chosenBksArray = Object.keys(this.userDataService.userData.bks).map((key) => {
                let bk = this.userDataService.userData.bks[key];
                bk['databaseKey'] = key;
                return bk;
            });

            this.bks = chosenBksArray.map((book) => {
                let bookDetails = items.filter((item) => {
                    return item.id == book.id;
                })[0];
                Object.assign(book, bookDetails);
                return book;
            });

            if (this.myBooks)
                x.unsubscribe();
        });
    }

}