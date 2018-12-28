import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from './userData.service';

@Injectable()
export class DatabaseService {

    public userRef: any;
    public booksRef: any;

    constructor(
        public db: AngularFireDatabase,
        public userData: UserDataService,
    ) {
        this.userRef = db.list('/users');
        this.booksRef = db.list('/books');
    }

    public addChosenBook(item: any) {
        let dbReference = this.db.list('/users/'+ localStorage.getItem('email').split('.com')[0] + '/chosenBooks');
        dbReference.push({id : item.id});

        this.userData.userData.chosenBooks[item.id] = {id: item.id};

        let bookOwner = this.db.list('/users/' + item.id.split('.com')[0] + '/trades');
        bookOwner.push({id: item.id});
    }
}