import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class FetchBooksService {

    constructor(
    ) {}

    data = new EventEmitter<any> ();
}