import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

    public dbBooks: any;
    public myBooks: any[];
    public chosenBooks: any[];

    constructor(
        public userDataService: UserDataService,
        private db: AngularFireDatabase,
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

            if (this.myBooks)
                x.unsubscribe();
        });
    }

}