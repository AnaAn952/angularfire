import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from './userData.service';
import { isFirebaseQuery } from '@angular/fire/database-deprecated/utils';
import { EventsService } from './fetch-books.service';

declare let $;

@Injectable()
export class DatabaseService {

    public currentUser: string;
    public elementSelectatDinPropuneri: any;
    public booksInModal: any = [];
    public itemForNewTrade: any = [];
    public tradeBooksForChosenBooks: any = [];
    public itemModalDetalii: any;
    public modalChosenSolicitate = { title: '', body: '', rightButton: '' };
    public solicitate: any = [];
    public editMyBook: any = {};
    public stergeMyBook: any = {};

    constructor(
        public db: AngularFireDatabase,
        public userData: UserDataService,
        public eventService: EventsService,
    ) {
        if (localStorage.getItem("email")) {
            this.currentUser = this.convertToDatabaseFormat(localStorage.getItem('email'));
        }
    }

    public addChosenBookAndTradeBooks() {
        let chosenBook = this.itemForNewTrade;
        let bookOwnerUser = this.convertToDatabaseFormat(chosenBook.proprietarCurent);

        let chosenByMeRef = this.db.list('/users/' + this.currentUser + '/chosenByMe');
        let solicitateRef = this.db.list('/users/' + bookOwnerUser + '/solicitate');

        chosenByMeRef.set(chosenBook.id, {
            id : chosenBook.id,
            cartiLaSchimb: this.tradeBooksForChosenBooks,
            utilizator: chosenBook.proprietarCurent,
            actiune: 'asteptare',
        });

        solicitateRef.set(chosenBook.id + '__' + this.currentUser, {
            id: chosenBook.id,
            cartiLaSchimb: this.tradeBooksForChosenBooks,
            utilizator: localStorage.getItem('email'),
            databaseKey: chosenBook.id + '__' + this.currentUser,
            actiune: 'asteptare',
        });

        $('#modal2').modal('hide');
        $('#modalDetalii').modal('hide');
    }

    public anuleazaRefuzaChosenSolicitate(buttonText, adaugaItem: any = {}) {
        let ref, id;
        switch (buttonText) {
            case "Anuleaza oferta":
                // sterg din lista lui PROPRIE
                this.databaseRemove('/users/'+ this.currentUser + '/chosenByMe', this.elementSelectatDinPropuneri.id);

                //actualizez in lista celuilalt
                ref = '/users/'+ this.convertToDatabaseFormat(this.elementSelectatDinPropuneri.proprietarCurent) + '/solicitate';
                id = this.elementSelectatDinPropuneri.id + "__" + this.convertToDatabaseFormat(this.userData.userData.email);
                this.db.object(ref + '/' + id).update({
                    actiune: 'anulat',
                });

                break;
            case "Refuza oferta":
                // sterg din lista lui PROPRIE
                this.databaseRemove('/users/' + this.currentUser + '/solicitate', this.elementSelectatDinPropuneri.databaseKey);

                // refuza schimbul
                ref = '/users/' + this.convertToDatabaseFormat(this.elementSelectatDinPropuneri.utilizator) + '/chosenByMe';
                id = this.convertToDatabaseFormat(this.elementSelectatDinPropuneri.id);
                let removeRef = this.db.object(ref + '/' + id);
                removeRef.update({actiune: "refuzat"});

                break;
        }

        $('#modalChosenSolicitate').modal('hide');
    }

    public adaugaLaSchimburiAcceptate(item: any) {
        console.log(this.currentUser);
        let chosenBook = item;
        let myBook = this.elementSelectatDinPropuneri;

        let dbReference = this.db.list('/users/' + this.currentUser + '/acceptate');
        dbReference.set(chosenBook.id + '__' + myBook.id,
            {
                carteaMea: myBook.id,
                carteaPrimita: chosenBook.id,
                databaseKey: chosenBook.id + '__' + myBook.id,
                utilizator: chosenBook.proprietarCurent,
            }
        );

        let bookOwnerRef = this.db.list('/users/' + this.convertToDatabaseFormat(chosenBook.proprietarCurent) + '/acceptate');
        bookOwnerRef.set(chosenBook.id + '__' + myBook.id,
            {
                carteaMea: chosenBook.id,
                carteaPrimita: myBook.id,
                databaseKey: chosenBook.id + '__' + myBook.id,
                utilizator: myBook.proprietarCurent,
            }
        );

        // sterg din lista mea de solicitate toate cereriele pentru carte
        for (let item of this.solicitate) {
            if (item.databaseKey.indexOf(myBook.id) >= 0) {
                this.databaseRemove('/users/' + this.currentUser + '/solicitate', item.databaseKey);
            }
        }

        // sterge din lista cererilor celuilalt
        let ref = '/users/' + this.convertToDatabaseFormat(chosenBook.proprietarCurent) + '/chosenByMe';
        let id = this.convertToDatabaseFormat(myBook.id);
        this.databaseRemove(ref, id);

        // cartile devin indispobibile
        let refMyBook = this.db.object("/cartile/" + this.convertToDatabaseFormat(myBook.id));
        let refOtherBook = this.db.object("/cartile/" + this.convertToDatabaseFormat(chosenBook.id));
        refMyBook.update({status: 'indisponibil'});
        refOtherBook.update({status: 'indisponibil'});

        // sterg din lista de solicitate a celuilat cartea
        let refOtherList = this.db.list('/users/' + this.convertToDatabaseFormat(chosenBook.proprietarCurent) + '/solicitate');
        let a = refOtherList.valueChanges().subscribe((data: any) => {
            let solicitate = data;
            if (solicitate.length) {
                for (let item of solicitate) {
                    if (item.databaseKey.indexOf(chosenBook.id) >= 0) {
                        this.databaseRemove('/users/' + this.convertToDatabaseFormat(chosenBook.proprietarCurent) + '/solicitate', item.databaseKey);
                    }
                }
            }
            a.unsubscribe();
        });

        $('#modalChosenSolicitate').modal('hide');
    }

    public setBookQuality(id, quality) {
        //aici o sa facem un nou posesor al cartii
        let ref: any = this.db.object("/cartile/" + id),
            itemAcceptate;

        ref.update({
            stareCarte: quality,
            proprietarCurent: this.userData.userData.email,
            status: "disponibila",
        });
        let historyRef = this.db.list("/cartile/" + id + "/istorie");
        historyRef.push({
            data: new Date().toLocaleDateString(),
            proprietar: this.userData.userData.email,
        });

        //stergem cartea din schimburile acceptate ale userului
        for (let item in this.userData.userData.acceptate) {
            if (item.indexOf(id) >= 0) {
                itemAcceptate = this.userData.userData.acceptate[item];
                this.databaseRemove("/users/" + this.currentUser + "/acceptate", item);
                break;
            }
        }

        //adaugam idul cartii in lista userului
        let userRef = this.db.list("/users/" + this.currentUser + "/idurileCartilorMele");
        userRef.push(itemAcceptate.carteaPrimita);

        //stergem idul cartii din lista celuilalt user
        let userReef = this.db.object("/users/" + this.convertToDatabaseFormat(itemAcceptate.utilizator) + "/idurileCartilorMele");
        let a = userReef.valueChanges().subscribe(((data: any) => {
            console.log(data);
            let index = Object.values(data).indexOf(itemAcceptate.carteaPrimita);
            let dataOk = Object.values(data).slice();
            console.log("set data", data);
            dataOk.splice(index, 1);
            if (data) {
                a.unsubscribe();
                console.log("set the data", dataOk);
                userReef.set(dataOk);
            }
        }));

        //mutam schimbul la schimburi confirmate de mine
        if (itemAcceptate.confirmat !== "true") {
            ref = this.db.list("/users/" + this.currentUser + "/confirmate_de_mine");
            ref.set(itemAcceptate.databaseKey, itemAcceptate);
            let reff = this.db.object("/users/" + this.convertToDatabaseFormat(itemAcceptate.utilizator) + "/acceptate/" + itemAcceptate.databaseKey);
            reff.update({
               confirmat: "true"
            });
        } else {
            ref = this.db.list("/users/" + this.currentUser + "/finalizate");
            ref.set(itemAcceptate.databaseKey, itemAcceptate);
            this.databaseRemove("/users/" + this.convertToDatabaseFormat(itemAcceptate.utilizator) + '/confirmate_de_mine', itemAcceptate.databaseKey);
            let reff = this.db.list("/users/" + this.convertToDatabaseFormat(itemAcceptate.utilizator) + "/finalizate");
            reff.set(itemAcceptate.databaseKey, {
                carteaMea: itemAcceptate.carteaPrimita,
                carteaPrimita: itemAcceptate.carteaMea,
                utilizator: localStorage.getItem("email"),
                databaseKey: itemAcceptate.databaseKey
            });
        }
    }

    public raporteaza(motiv, mesaj, id) {
        let itemAcceptate: any;

        //stergem cartea din schimburile acceptate ale userului
        for (let item in this.userData.userData.acceptate) {
            if (item.indexOf(id) >= 0) {
                itemAcceptate = this.userData.userData.acceptate[item];
                this.databaseRemove("/users/" + this.currentUser + "/acceptate", item);
                break;
            }
        }
        //mutam schimbul la schimburi raportate
        let ref = this.db.list("/users/" + this.currentUser + "/raportate");
        ref.set(itemAcceptate.databaseKey, {
            carteaMea: itemAcceptate.carteaMea,
            carteaPrimita: itemAcceptate.carteaPrimita,
            utilizator: itemAcceptate.utilizator,
            motiv: motiv,
            detalii: mesaj,
            databaseKey: itemAcceptate.databaseKey
        });
    }

    public rating(stars, user) {
        // let ref = this.db.object("/users/" + this.convertToDatabaseFormat(user) + "")
    }

    public answerOffer(item: any): any {
        this.elementSelectatDinPropuneri = item;

        this.modalChosenSolicitate.title = "Detalii oferta";
        this.modalChosenSolicitate.body = "Alege una dintre aceste carti pentru a accepta schimbul:";
        this.modalChosenSolicitate.rightButton = "Refuza oferta";

        let ids = item.cartiLaSchimb;
        this.setBooksArray(ids, this.booksInModal, ["pe_asta"]);
    }

    public seeBooksInExchange(item: any) {
        item.id = this.convertToDatabaseFormat(item.id);
        this.elementSelectatDinPropuneri = item;

        this.modalChosenSolicitate.title = "Cartile pe care le-ai propus";
        this.modalChosenSolicitate.body = "";
        this.modalChosenSolicitate.rightButton = "Anuleaza oferta";

        let booksRef = this.db.object('/users/' + this.currentUser + '/chosenByMe/' + item.id)
            .valueChanges().subscribe((data: any) => {
                let idCartiLaSchimb = data.cartiLaSchimb;
                this.setBooksArray(idCartiLaSchimb, this.booksInModal,  ["exchange"]);

                booksRef.unsubscribe();
            });
    }

    addNewBook(downloadUrl: string, title: string) {
        let userRef = this.db.list('/users/' + this.currentUser + '/idurileCartilorMele');
        let booksRef = this.db.list('/cartile');
        let id = Math.floor(Math.random()*100000000000000000).toString();
        booksRef.set(id,
            {
                id: id,
                titlu: title,
                poza: downloadUrl,
                status: "disponibila",
                proprietarCurent: localStorage.getItem("email"),
                istorie: [{
                    data: new Date().toLocaleDateString(),
                    proprietar: localStorage.getItem("email"),
                }],
            }
        );
        userRef.push(id);
    }

    editExistingBook(downloadUrl: string, title: string) {
        let booksRef = this.db.object('/cartile/' + this.convertToDatabaseFormat(this.editMyBook.id));
        if (title === this.editMyBook.title) {
            title = null;
        }
        if (downloadUrl && !title) {
            booksRef.update({poza: downloadUrl});
        }
        if (title && !downloadUrl) {
            booksRef.update({titlu: title});
        }
        if (title && downloadUrl) {
            booksRef.update({poza: downloadUrl, titlu: title});
        }
        this.eventService.resetAll.emit();
    }

    updateProfilePicture(downloadUrl: string) {
        let dbReference = this.db.object('/users/' + this.currentUser);

        dbReference.update({profilePicture: downloadUrl});
    }

    changeInformation(values: any) {
        let dbReference = this.db.object('/users/' + this.currentUser);

        dbReference.update(values);
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
                if (add[0] !== "myBooks") {
                    for (let item of add) {
                        object[item] = true;
                    }
                }

                if (mergeWith.length) {
                    object = Object.assign(object, mergeWith[i]);
                }

                if (object.status !== "sters") {
                    placeToPush.push(object);
                }

                if (add[0] === "myBooks") {
                    placeToPush.sort(this.sortAvailable);
                }

                if(details) a.unsubscribe();
            });
        }
    }

    public sortAvailable(a, b) {
        if (a.status === b.status) {
            return 0;
        }
        if (a.status === "indisponibil") {
            return 1;
        }
        return -1;
    }

    public getBookDetails(id: any) {
        let bookRef = this.db.object('/cartile/' + id);
        return bookRef.valueChanges();
    }

    public removeMyBook() {
        let ref = this.db.object('/cartile/' + this.stergeMyBook.id);
        ref.update({status: 'sters'});
    }

    public setPersonsArray(ids: any[], placeToPush: any[], mergeWith: any[] = []) {
        placeToPush.length = 0;

        for (let i in ids) {
            let a = this.getPersonDetails(ids[i]).subscribe((details: any) => {
                let object = details;

                if (mergeWith.length) {
                    object = Object.assign(object, mergeWith[i]);
                }

                placeToPush.push(object);

                console.log(placeToPush);
                if(details) {
                    console.log(details);
                    a.unsubscribe();
                }
            });
        }
    }

    public getPersonDetails(id: any) {
        let personRef = this.db.object('/users/' + id);
        return personRef.valueChanges();
    }

    public participateAtEvent(name: string, values: any) {
        let event = this.db.object('/events/' + name);
        event.update({participanti: values});
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

    public stergeElementAnulat(id) {
        this.databaseRemove("/users/" + this.currentUser + '/solicitate', id);
    }

    public stergeElementRefuzat(id) {
        this.databaseRemove("/users/" + this.currentUser + '/chosenByMe', id);
    }

}