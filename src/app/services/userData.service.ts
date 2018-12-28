import { Injectable } from '@angular/core';

@Injectable()
export class UserDataService {

    public userData: any = {
        username: '',
        email: '',
        carti: [],
        chosenBooks: {},
    };

    constructor() {}

    public setUserData(data: any) {
        this.userData = data;
        console.log('data', this.userData);
    }
}