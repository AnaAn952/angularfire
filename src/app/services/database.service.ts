import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from './userData.service';

declare let $;

@Injectable()
export class DatabaseService {

    public currentUser: string;
    public elementSelectatDinPropuneri: any;
    public booksInModal: any = [];
    public itemForNewTrade: any = [];
    public tradeBooksForChosenBooks: any = '';
    public itemModalDetalii: any;
    public modalChosenSolicitate = { title: '', body: '', rightButton: '' };

    constructor(
        public db: AngularFireDatabase,
        public userData: UserDataService,
    ) {
        this.currentUser = this.convertToDatabaseFormat(localStorage.getItem('email'));
    }

    public addChosenBookAndTradeBooks() {
        let chosenBook = this.itemForNewTrade;
        let bookOwnerUser = this.convertToDatabaseFormat(chosenBook.id.split('.com_')[0] + '.com');

        let chosenByMeRef = this.db.list('/users/' + this.currentUser + '/chosenByMe');
        let solicitateRef = this.db.list('/users/' + bookOwnerUser + '/solicitate');

        chosenByMeRef.set(this.convertToDatabaseFormat(chosenBook.id), {
            id : chosenBook.id,
            cartiLaSchimb: this.tradeBooksForChosenBooks,
        });

        solicitateRef.set(this.convertToDatabaseFormat(chosenBook.id) + '__' + this.currentUser, {
            id: chosenBook.id,
            trader: localStorage.getItem('email'),
            cartiLaSchimb: this.tradeBooksForChosenBooks,
            databaseKey: this.convertToDatabaseFormat(chosenBook.id) + '__' + this.currentUser,
        });

        $('#modal2').modal('hide');
        $('#modalDetalii').modal('hide');

        this.userData.userData.chosenByMe[this.convertToDatabaseFormat(chosenBook.id)] = {id: this.convertToDatabaseFormat(chosenBook.id)};
    }

    public chosenSolicitateAction(buttonText) {
        // the user who proposed the offer cancels it
        switch (buttonText) {
            case "Anuleaza oferta":
                // sterg din lista lui PROPRIE
                this.databaseRemove('/users/'+ this.currentUser + '/chosenByMe', this.elementSelectatDinPropuneri.id);

                //sterg din lista celuilalt
                let ref = '/users/'+ this.elementSelectatDinPropuneri.id.split("_")[0] + '/solicitate',
                    id = this.elementSelectatDinPropuneri.id + "__" + this.convertToDatabaseFormat(this.userData.userData.email);
                this.databaseRemove(ref, id);

                break;
            case "Refuza oferta":
            case "Muta la acceptate":
                // sterg din lista lui PROPRIE
                this.databaseRemove('/users/' + this.currentUser + '/solicitate', this.elementSelectatDinPropuneri.databaseKey);

                // sterge din lista cererilor celuilalt
                let ref = '/users/' + this.convertToDatabaseFormat(this.elementSelectatDinPropuneri.trader) + '/chosenByMe',
                    id = this.convertToDatabaseFormat(this.elementSelectatDinPropuneri.id);
                this.databaseRemove(ref, id);

                break;
        }

        $('#modalChosenSolicitate').modal('hide');
        window.location.reload();
    }

    public adaugaLaSchimburiAcceptate(item: any) {
        let dbReference = this.db.list('/users/' + this.currentUser + '/acceptate');
        dbReference.set(this.convertToDatabaseFormat(item.id + '__' + this.elementSelectatDinPropuneri.id),
            {
                mine: this.convertFromDatabaseFormat(this.elementSelectatDinPropuneri.id),
                not: item.id,
            }
        );

        let bookOwnerRef = this.db.list('/users/' + this.convertToDatabaseFormat(item.id.split('!com_')[0] + '.com') + '/acceptate');
        bookOwnerRef.set(this.convertToDatabaseFormat(item.id + '__' + this.elementSelectatDinPropuneri.id),
            {
                mine: item.id,
                not: this.convertFromDatabaseFormat(this.elementSelectatDinPropuneri.id),
            }
        );

        this.chosenSolicitateAction("Muta la acceptate");
        $('#modalChosenSolicitate').modal('hide');
    }

    public answerOffer(item: any): any {
        this.elementSelectatDinPropuneri = item;

        this.modalChosenSolicitate.title = "Detalii oferta";
        this.modalChosenSolicitate.body = "Alege una dintre aceste carti pentru a accepta schimbul:";
        this.modalChosenSolicitate.rightButton = "Refuza oferta";

        let ids = this.convertToDatabaseFormat(item.cartiLaSchimb).split(",");
        if (ids.length > 1) {
            ids.pop();
        }

        this.setBooksArray(ids, this.booksInModal, ["pe_asta"]);
    }

    public seeBooksInExchange(item: any) {
        this.elementSelectatDinPropuneri = item;

        this.modalChosenSolicitate.title = "Cartile pe care le-ai propus";
        this.modalChosenSolicitate.body = "";
        this.modalChosenSolicitate.rightButton = "Anuleaza oferta";

        let booksRef = this.db.object('/users/' + this.currentUser + '/chosenByMe/' + item.id)
            .valueChanges().subscribe((data: any) => {
                let idCartiLaSchimb = this.convertToDatabaseFormat(data.cartiLaSchimb).split(",");
                if (idCartiLaSchimb.length > 1) {
                    idCartiLaSchimb.pop();
                }
                this.setBooksArray(idCartiLaSchimb, this.booksInModal, []);

                booksRef.unsubscribe();
            });
    }

    addNewBook(downloadUrl: string, title: string) {
        let booksRef = this.db.list('/cartile');
        let bookNumber = this.userData.userData.bookNumber + 1;
        this.userData.userData.bookNumber ++;
        booksRef.set(this.convertToDatabaseFormat(localStorage.getItem('email')) + "_" + bookNumber,
            {
                id: localStorage.getItem('email') + "_" + bookNumber,
                titlu: title,
                poza: downloadUrl
            }
        );
        let dbReference = this.db.object('/users/' + this.currentUser);

        dbReference.update({bookNumber: bookNumber});
    }

    updateProfilePicture(downloadUrl: string) {
        let dbReference = this.db.object('/users/' + this.currentUser);

        dbReference.update({profilePicture: downloadUrl});
    }

    public sendChatResponse(a: any) {
        let dbReference = this.db.list('/chat/');
        dbReference.push(a);
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

    public getBookDetails(id: any) {
        let bookRef = this.db.object('/cartile/' + id);
        return bookRef.valueChanges();
    }


    convertToDatabaseFormat(value: string) {
        return value.split(".").join("!");
    }

    convertFromDatabaseFormat(value: string) {
        return value.split("!").join(".");
    }

    public databaseRemove(ref, id) {
        let dbReference = this.db.list(ref);
        dbReference.remove(id);
    }
}