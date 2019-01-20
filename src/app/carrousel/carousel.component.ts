import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AngularFireDatabase } from '@angular/fire/database';

declare let $: any;

@Component({
    selector: 'carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

    constructor(
        public databaseService: DatabaseService,
        private db: AngularFireDatabase,
    ) {}

    ngOnInit() {
        $('#carouselExample').on('slide.bs.carousel', function (e) {

            let $e = $(e.relatedTarget);
            let idx = $e.index();
            let itemsPerSlide = 4;
            let totalItems = $('.carousel-item').length;

            if (idx >= totalItems - (itemsPerSlide - 1)) {
                let it = itemsPerSlide - (totalItems - idx);
                for (let i = 0; i < it; i++) {
                    // append slides to end
                    if (e.direction == "left") {
                        $('.carousel-item').eq(i).appendTo('.carousel-inner');
                    }
                    else {
                        $('.carousel-item').eq(0).appendTo('.carousel-inner');
                    }
                }
            }
        });
    }
}