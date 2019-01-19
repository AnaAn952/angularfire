import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from './userData.service';

declare let $;

@Injectable()
export class DatabaseService {

    public userRef: any;
    public booksRef: any;
    public elementSelectatDinPropuneri: any;
    public thatPersonsBooks: any = [];
    public itemForNewTrade: any = [];
    public chosenBookTrade: any = '';

    constructor(
        public db: AngularFireDatabase,
        public userData: UserDataService,
    ) {
        this.userRef = db.list('/users');
        this.booksRef = db.list('/books');
    }

    public addChosenBook(item: any) {
        let currentUser = localStorage.getItem('email').replace('.', '!');
        let bookOwnerUser = (item.id.split('.com_')[0] + '.com').replace('.', '!');

        let dbReference = this.db.list('/users/' + currentUser + '/chosenBooks');
        let bookOwner = this.db.list('/users/' + bookOwnerUser + '/bks');

        let customId = item.id.replace('.', '!');

        dbReference.set(customId, {id : item.id});

        bookOwner.set(customId + '__' + currentUser, {id: item.id, trader: localStorage.getItem('email'), book: this.chosenBookTrade});

        this.userData.userData.chosenBooks[item.id] = {id: item.id};
    }

    public refuza() {
        let currentUser = localStorage.getItem('email').replace('.', '!');

        // sterg din lista lui PROPRIE
        let dbReference = this.db.list('/users/'+ currentUser + '/bks');

        dbReference.remove(this.elementSelectatDinPropuneri.databaseKey);
        $('#modal1').modal('hide');

        // sterge din lista cererilor celuilalt

        window.location.reload();
    }

    public trimiteOferta() {
        this.addChosenBook(this.itemForNewTrade);

        $('#modal2').modal('hide');
    }

    public adaugaLaSchimburiAcceptate(item: any) {
        let currentUser = localStorage.getItem('email').replace('.', '!');
        let bookOwnerUser = (item.id.split('.com_')[0] + '.com').replace('.', '!');

        let dbReference = this.db.list('/users/' + currentUser + '/ac');
        let bookOwner = this.db.list('/users/' + bookOwnerUser + '/ac');

        let customId1 = (item.id + '__' + this.elementSelectatDinPropuneri.id).split('.').join('!');

        dbReference.set(customId1, {mine: this.elementSelectatDinPropuneri.id, not: item.id});
        bookOwner.set(customId1, {mine: item.id, not: this.elementSelectatDinPropuneri.id});
    }
}