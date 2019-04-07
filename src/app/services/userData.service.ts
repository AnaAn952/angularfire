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
        // setInterval(() => {
            this.resetUserData(localStorage.getItem("email"));
        // }, 4000);
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
        let currentUserData = JSON.stringify(this.userData);
        let list = this.db.list('/users', ref => ref.orderByChild('email').equalTo(email));
        list.valueChanges().subscribe((userData: any) => {
            console.log("changed");
            if (userData[0].email) {
                console.log(userData[0]);
                this.setUserData(userData[0]);
            }
            if (currentUserData !== JSON.stringify(this.userData)) {
                console.log("changed", this.userData.acceptate);
                this.eventService.resetProfileData.emit();
            }
        });
    }
}