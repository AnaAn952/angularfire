import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class EventsService {

    constructor() {}

    searchField = new EventEmitter<any> ();
    onLogin = new EventEmitter<any> ();
}