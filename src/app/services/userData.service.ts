import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { EventsService } from './fetch-books.service';

@Injectable()
export class UserDataService {

    public userData: any = {
        username: '',
        email: '',
        telefon: '',
        oras: '',
        varsta: '',
        ocupatie: '',
        carti: [],
        chosenByMe: {},
        solicitate: {},
        idurileCartilorMele: [],
        confirmate_de_mine: {},
        finalizate: {},
        raportate: {},
        acceptate: {},
        profilePicture: '',
    };

    public defaultProfilePicture = "https://firebasestorage.googleapis.com/v0/b/book-website-sharing.appspot.com/o/2ydq27fp2wg?alt=media&token=8c44703d-b739-4d35-ad2f-e383ac4d4780";

    constructor(
        public db: AngularFireDatabase,
        public eventService: EventsService,
    ) {
        this.resetUserData(localStorage.getItem("email"));
    }

    public setUserData(data: any) {
        this.userData = data;
        console.log(data);
        if (this.userData.chosenByMe === undefined) {
            this.userData.chosenByMe = {};
        }

        if (this.userData.solicitate === undefined) {
            this.userData.solicitate = {};
        }

        if (this.userData.acceptate === undefined) {
            this.userData.acceptate = {};
        }

        if (this.userData.idurileCartilorMele === undefined) {
            this.userData.idurileCartilorMele = [];
        }

        if (this.userData.confirmate_de_mine === undefined) {
            this.userData.confirmate_de_mine = {};
        }

        if (this.userData.finalizate === undefined) {
            this.userData.finalizate = {};
        }

        if (this.userData.raportate === undefined) {
            this.userData.raportate = {};
        }
    }

    public resetUserData(email: any) {
        if (!email) return;
        let idurileCartilorMele = JSON.stringify(this.userData.idurileCartilorMele);
        let chosenByMe = JSON.stringify(this.userData.chosenByMe);
        let solictiate = JSON.stringify(this.userData.solicitate);
        let acceptate = JSON.stringify(this.userData.acceptate);
        let confirmate = JSON.stringify(this.userData.confirmate_de_mine);
        let finalizate = JSON.stringify(this.userData.finalizate);
        let raportate = JSON.stringify(this.userData.raportate);
        let list = this.db.list('/users', ref => ref.orderByChild('email').equalTo(email));
        list.valueChanges().subscribe((userData: any) => {
            if (userData[0].email) {
                this.setUserData(userData[0]);
            }
            console.log(this.userData);
            if (idurileCartilorMele !== JSON.stringify(this.userData.idurileCartilorMele)) {
                console.log(idurileCartilorMele, JSON.stringify(this.userData.idurileCartilorMele));
                idurileCartilorMele =  JSON.stringify(this.userData.idurileCartilorMele);
                this.eventService.resetMyBooks.emit();
            }
            if (chosenByMe !== JSON.stringify(this.userData.chosenByMe)) {
                chosenByMe = JSON.stringify(this.userData.chosenByMe);
                this.eventService.resetChosenByMe.emit();
            }
            if (solictiate !== JSON.stringify(this.userData.solicitate)) {
                solictiate = JSON.stringify(this.userData.solicitate);
                this.eventService.resetSolicitate.emit();
            }
            if (acceptate !== JSON.stringify(this.userData.acceptate)) {
                acceptate = JSON.stringify(this.userData.acceptate);
                this.eventService.resetAcceptate.emit();
            }
            if (confirmate !== JSON.stringify(this.userData.confirmate_de_mine)) {
                confirmate = JSON.stringify(this.userData.confirmate_de_mine);
                this.eventService.resetConfirmate.emit();
            }
            if (finalizate !== JSON.stringify(this.userData.finalizate)) {
                finalizate = JSON.stringify(this.userData.finalizate);
                this.eventService.resetFinalizate.emit();
            }
            if (raportate !== JSON.stringify(this.userData.raportate)) {
                raportate = JSON.stringify(this.userData.raportate);
                this.eventService.resetRaportate.emit();
            }
        });
    }
}