import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from '../../services/database.service';

declare let $: any;

@Component({
    selector: 'carousel-raportate',
    templateUrl: './carousel-raportate.component.html',
    styleUrls: ['./carousel-raportate.component.css']
})
export class CarouselRaportateComponent implements OnInit {

    @Input('items') items: any;

    constructor(
        public databaseService: DatabaseService,
        private db: AngularFireDatabase,
    ) {}

    ngOnInit() {
        $('#carouselExample7').on('slide.bs.carousel', function (e) {

            let $e = $(e.relatedTarget);
            let idx = $e.index();
            let itemsPerSlide = 4;
            let totalItems = $('.carousel-7 .carousel-item').length;

            if (idx >= totalItems - (itemsPerSlide - 1)) {
                let it = itemsPerSlide - (totalItems - idx);
                for (let i = 0; i < it; i++) {
                    // append slides to end
                    if (e.direction == "left") {
                        $('.carousel-7 .carousel-item').eq(i).appendTo('.carousel-7 .carousel-inner');
                    }
                    else {
                        $('.carousel-7 .carousel-item').eq(0).appendTo('.carousel-7 .carousel-inner');
                    }
                }
            }
        });
    }
}