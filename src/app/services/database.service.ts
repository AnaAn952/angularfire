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
    public elementSelectatPentruRaspuns: any = '';
    public modal1 = { title: '', body: '', rightButton: '' };

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

        this.userData.userData.chosenByMe[customId] = {id: customId};
    }

    public refuza(buttonText) {
        let currentUser = localStorage.getItem('email').replace('.', '!');

        // sterg din lista lui PROPRIE
        let dbReference = this.db.list('/users/'+ currentUser + '/solicitate');

        dbReference.remove(this.elementSelectatDinPropuneri.databaseKey);

        // sterge din lista cererilor celuilalt

        let theOtherUser = this.elementSelectatDinPropuneri.trader.split(".").join("!");

        dbReference = this.db.list('/users/'+ theOtherUser + '/chosenByMe');

        dbReference.remove(this.elementSelectatDinPropuneri.id.split(".").join("!"));

        if (buttonText === "Anuleaza oferta") {
            // sterg din lista lui PROPRIE
            let dbReference = this.db.list('/users/'+ currentUser + '/chosenByMe');

            dbReference.remove(this.elementSelectatDinPropuneri.id);

            //sterg din lista celuilalt
            theOtherUser = this.elementSelectatDinPropuneri.id.split("_")[0];

            dbReference = this.db.list('/users/'+ theOtherUser + '/solicitate');

            dbReference.remove(this.elementSelectatDinPropuneri.id + "__" + this.userData.userData.email.split(".").join("!"));
        }

        $('#modal1').modal('hide');
        window.location.reload();
    }

    public trimiteOferta() {
        this.addChosenBook(this.itemForNewTrade);

        $('#modal2').modal('hide');
    }

    public adaugaLaSchimburiAcceptate(item: any) {
        let currentUser = localStorage.getItem('email').replace('.', '!');
        let bookOwnerUser = (item.id.split('!com_')[0] + '.com').replace('.', '!');

        let dbReference = this.db.list('/users/' + currentUser + '/acceptate');
        let bookOwner = this.db.list('/users/' + bookOwnerUser + '/acceptate');

        let customId1 = (item.id + '__' + this.elementSelectatDinPropuneri.id).split('.').join('!');

        dbReference.set(customId1, {mine: this.elementSelectatDinPropuneri.id.split('!').join('.'), not: item.id});
        bookOwner.set(customId1, {mine: item.id, not: this.elementSelectatDinPropuneri.id.split('!').join('.')});

        this.elementSelectatDinPropuneri = this.elementSelectatPentruRaspuns;
        this.refuza("Muta la acceptate");

        $('#modal1').modal('hide');
    }

    public getBookDetails(id: any) {
        let bookRef = this.db.object('/cartile/' + id);
        return bookRef.valueChanges();
    }

    public setBooksArray(bookIds: string[], placeToPush: any, add: any, mergeWith: any = []) {
        placeToPush.length = 0;

        for(let i in bookIds) {
            let a = this.getBookDetails(bookIds[i]).subscribe((details: any) => {

                let object = details;
                object.id = bookIds[i];
                for (let item of add) {
                    object[item] = true;
                }

                if (mergeWith.length) {
                    object = Object.assign(object, mergeWith[i]);
                }

                placeToPush.push(object);

                if(details) a.unsubscribe();
            });
        }
    }

    public rs(item: any): any {
        this.elementSelectatDinPropuneri = item;
        this.elementSelectatPentruRaspuns = item;

        this.modal1.title = "Detalii oferta";
        this.modal1.body = "Alege una dintre aceste carti pentru a accepta schimbul:";
        this.modal1.rightButton = "Refuza oferta";

        let ids = item.cartiLaSchimb.split(".").join("!").split(",");
        if (ids.length > 1) {
            ids.pop();
        }

        this.setBooksArray(ids, this.booksInModal, ["pe_asta"]);
    }

    public seeBooksInExchange(item: any) {
        this.elementSelectatDinPropuneri = item;

        let id = item.id;
        let currentUser = localStorage.getItem('email').replace('.', '!');

        this.modal1.title = "Cartile pe care le-ai propus";
        this.modal1.body = "";
        this.modal1.rightButton = "Anuleaza oferta";

        let booksRef = this.db.object('/users/' + currentUser + '/chosenByMe/' + id)
            .valueChanges().subscribe((data: any) => {
            let idCartiLaSchimb = data.cartiLaSchimb.split(".").join("!").split(",");
            if (idCartiLaSchimb.length > 1) {
                idCartiLaSchimb.pop();
            }
            this.setBooksArray(idCartiLaSchimb, this.booksInModal, []);

            booksRef.unsubscribe();
        });
    }
}