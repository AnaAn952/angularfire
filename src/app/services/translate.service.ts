import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from './userData.service';

@Injectable()
export class TranslateService {

    public ref: any;
    public trans: any;

    constructor(
        public db: AngularFireDatabase,
        public userData: UserDataService,
    ) {
        this.ref = db.object("traduceri");
    }

    public tr(value: any) {
        if (this.userData.userData.limba === "engleza") {
            return this.trans[value];
        } else return value;
    }
}