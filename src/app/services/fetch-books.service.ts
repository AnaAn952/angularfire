import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class EventsService {

    constructor() {}

    searchField = new EventEmitter<any> ();
    onLogin = new EventEmitter<any> ();
    resetMyBooks = new EventEmitter<any> ();
    resetChosenByMe = new EventEmitter<any> ();
    resetSolicitate = new EventEmitter<any> ();
    resetAcceptate = new EventEmitter<any> ();
    resetConfirmate = new EventEmitter<any> ();
    resetFinalizate = new EventEmitter<any> ();
    resetRaportate = new EventEmitter<any> ();
    resetAll = new EventEmitter<any> ();
}