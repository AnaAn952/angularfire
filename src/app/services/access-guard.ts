import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/index';
import { UserDataService } from './userData.service';

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(
        public router: Router,
        public userDataService: UserDataService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        const needsLogin = (route.data && route.data["needsLogin"]) || false;
        if (needsLogin) {
            if (!window.localStorage.getItem("email")) {
                this.router.navigate(['login']);
            } else {}
            return true;
        }
        return true;
    }
}