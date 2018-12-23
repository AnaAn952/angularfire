import { Injectable } from '@angular/core';

@Injectable()
export class UserDataService {

    public userData: any = {
        username: '',
        email: '',
        carti: [],
        set: false,
    };

    constructor() {}

    public setUserData(data: any) {
        this.userData = data;
        this.userData.set = true;
    }
}