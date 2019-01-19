import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from './userData.service';

declare let $;

@Injectable()
export class DatabaseService {

    public userRef: any;
    public booksRef: any;
    public elementSelectatDinPropuneri: any;
    public booksInModal: any = [];
    public itemForNewTrade: any = [];
    public chosenBookTrade: any = '';
    public modal1 = { title: '', body: '' };

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

        let chosenByMeRef = this.db.list('/users/' + currentUser + '/chosenByMe');
        let solicitateRef = this.db.list('/users/' + bookOwnerUser + '/solicitate');

        let customId = item.id.replace('.', '!');

        chosenByMeRef.set(customId, {
            id : item.id,
            cartiLaSchimb: this.chosenBookTrade,
        });

        solicitateRef.set(customId + '__' + currentUser, {
            id: item.id,
            trader: localStorage.getItem('email'),
            cartiLaSchimb: this.chosenBookTrade,
            databaseKey: customId + '__' + currentUser,
        });

        this.userData.userData.chosenByMe[item.id] = {id: item.id};
    }

    public refuza() {
        let currentUser = localStorage.getItem('email').replace('.', '!');

        // sterg din lista lui PROPRIE
        let dbReference = this.db.list('/users/'+ currentUser + '/solicitate');

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

        let dbReference = this.db.list('/users/' + currentUser + '/acceptate');
        let bookOwner = this.db.list('/users/' + bookOwnerUser + '/acceptate');

        let customId1 = (item.id + '__' + this.elementSelectatDinPropuneri.id).split('.').join('!');

        dbReference.set(customId1, {mine: this.elementSelectatDinPropuneri.id, not: item.id});
        bookOwner.set(customId1, {mine: item.id, not: this.elementSelectatDinPropuneri.id});
    }

    public getBookDetails(id: any) {
        let bookRef = this.db.object('/cartile/' + id);
        return bookRef.valueChanges();
    }

    public setBooksArray(bookIds: string[], placeToPush: any, add: any, mergeWith: any = []) {
        placeToPush.length = 0;
        for(let i of bookIds) {
            let a = this.getBookDetails(i).subscribe((details: any) => {
                let object = details;
                object.id = i;
                for (let item of add) {
                    object[item] = true;
                }

                console.log(object);
                placeToPush.push(object);

                if (mergeWith.length) {
                    for (let i in mergeWith) {
                        placeToPush[i] = Object.assign(placeToPush[i], mergeWith[i]);
                    }
                }

                if(details) a.unsubscribe();
            });
        }
    }

    public rs(item: any): any {
        this.elementSelectatDinPropuneri = item;

        let ids = item.cartiLaSchimb.split(".").join("!").split(",");
        if (ids.length > 1) {
            ids.pop();
        }

        this.setBooksArray(ids, this.booksInModal, ["pe_asta"]);
    }

    public seeBooksInExchange(id: any) {
        let currentUser = localStorage.getItem('email').replace('.', '!');

        this.modal1.title = "Cartile pe care le-ai propus";
        this.modal1.body = "";

        let booksRef = this.db.object('/users/' + currentUser + '/chosenByMe/' + id);
        booksRef.valueChanges().subscribe((data: any) => {
            let idCartiLaSchimb = data.cartiLaSchimb.split(".").join("!").split(",");
            if (idCartiLaSchimb.length > 1) {
                idCartiLaSchimb.pop();
            }
            this.setBooksArray(idCartiLaSchimb, this.booksInModal, []);
        });
    }
}