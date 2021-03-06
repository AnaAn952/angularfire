import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/index';

@Injectable()
export class AuthService {

    public user: Observable<firebase.User>;
    public userDetails: firebase.User;

    constructor(
        private _fAuth: AngularFireAuth,
    ) {
        this.user = _fAuth.authState;

        this.user.subscribe(
            (user) => {
                if (user) {
                    this.userDetails = user;
                }
                else {
                    this.userDetails = null;
                }
            }
        );
    }

    public logout(): void {
        this._fAuth.auth.signOut();
    }

    resetPassword(email: string) {
        let auth = this._fAuth.auth;
        return auth.sendPasswordResetEmail(email);
    }

    signInRegular(email, password) {
        return this._fAuth.auth.signInWithEmailAndPassword(email, password);
    }

    createNewUser(email, password) {
        return this._fAuth.auth.createUserWithEmailAndPassword(email, password);
    }
}
