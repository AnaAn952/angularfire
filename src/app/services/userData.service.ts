import { Injectable } from '@angular/core';

@Injectable()
export class UserDataService {

    public userData: any = {
        username: '',
        email: '',
        carti: [],
        chosenBooks: {},
        bks: {},
    };

    constructor() {}

    public setUserData(data: any) {
        this.userData = data;
        if (this.userData.chosenBooks === undefined) {
            this.userData.chosenBooks = {};
        }

        if (this.userData.bks === undefined) {
            this.userData.bks = {};
        }

        console.log('data', this.userData);
    }
}