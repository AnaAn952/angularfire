import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/index';

@Injectable()
export class AuthService {

    private user: Observable<firebase.User>;
    private userDetails: firebase.User = null;

    constructor(
        private _fAuth: AngularFireAuth,
        private router: Router
    ) {
        this.user = _fAuth.authState;

        this.user.subscribe(
            (user) => {
                if (user) {
                    this.userDetails = user;
                    console.log(this.userDetails);
                }
                else {
                    this.userDetails = null;
                }
            }
        );
    }

    public googleSignIn() {
        return this._fAuth.auth.signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        )
    }

    public loggedIn(): boolean {
        return !!this.userDetails;
    }

    public logout(): void {
        this._fAuth.auth.signOut()
            .then((res) => this.router.navigate(['/']));
    }

    signInRegular(email, password) {
        const credential = firebase.auth.EmailAuthProvider.credential( email, password );
        return this._fAuth.auth.signInWithEmailAndPassword(email, password)
    }

    createNewUser(email, password) {
        const credential = firebase.auth.EmailAuthProvider.credential( email, password );
        return this._fAuth.auth.createUserWithEmailAndPassword(email, password);
    }
}
