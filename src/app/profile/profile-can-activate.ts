import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../services/userData.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileCanActivate implements CanActivate {

    constructor(
        public userDataService: UserDataService,
        public router: Router,
    ) {
    }

    canActivate(): any {
        if (this.userDataService.userData.email) {
            return true;
        } else {
            setTimeout(() => {
                this.router.navigate(['/profile']);
            });
        }
    }
}