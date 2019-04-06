import { Injectable } from '@angular/core';

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
        acceptate: {},
        profilePicture: '',
    };

    public defaultProfilePicture = "https://firebasestorage.googleapis.com/v0/b/book-website-sharing.appspot.com/o/2ydq27fp2wg?alt=media&token=8c44703d-b739-4d35-ad2f-e383ac4d4780";

    constructor() {}

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
    }
}