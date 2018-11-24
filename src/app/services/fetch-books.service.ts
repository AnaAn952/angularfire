import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class FetchBooksService {

    constructor() {}

    data = new EventEmitter<any> ();

    getBooks(key: string): any {
        if (key === 'fiction') {
            return [
                {
                    img: 'image.png',
                    title: 'Moara cu noroc'
                },
                {
                    img: 'image.png',
                    title: 'Moara cu noroc'
                },
                {
                    img: 'image.png',
                    title: 'Moara cu noroc'
                }
            ]
        } else return 'sorry';
    }
}