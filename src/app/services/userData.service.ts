import { Injectable } from '@angular/core';

@Injectable()
export class UserDataService {

    public userData: any = {
        username: '',
        email: '',
        carti: [],
        chosenByMe: {},
        solicitate: {},
        bookNumber: 0,
        acceptate: {},
    };

    constructor() {}

    public setUserData(data: any) {
        this.userData = data;
        if (this.userData.chosenByMe === undefined) {
            this.userData.chosenByMe = {};
        }

        if (this.userData.solicitate === undefined) {
            this.userData.solicitate = {};
        }
    }
}