import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { UserDataService } from './userData.service';
import { TranslateService } from './translate.service';

@Injectable({
    providedIn: 'root'
})
export class TranslationsCanActivate implements Resolve<boolean> {

    constructor(
        public userDataService: UserDataService,
        public router: Router,
        public translationService: TranslateService,
    ) {
    }

    resolve(): Promise<any> {
        return new Promise(resolve => {
            let a = setInterval(() => {
                if (this.userDataService.userData.email && this.translationService.trans) {
                    clearInterval(a);
                    resolve(true);
                }
            }, 10);
        });
    }
}