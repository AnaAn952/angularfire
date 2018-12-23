import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class DatabaseService {

    public userRef: any;
    public booksRef: any;

    constructor(
        public db: AngularFireDatabase
    ) {
        this.userRef = db.list('/users');
        this.booksRef = db.list('/books');
    }

}