import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from '../../services/database.service';

declare let $: any;

@Component({
    selector: 'carousel-confirmate',
    templateUrl: './carousel-confirmate.component.html',
    styleUrls: ['./carousel-confirmate.component.css']
})
export class CarouselConfirmateComponent implements OnInit {

    @Input('items') items: any;

    constructor(
        public databaseService: DatabaseService,
        private db: AngularFireDatabase,
    ) {}

    ngOnInit() {
        $('#carouselExample6').on('slide.bs.carousel', function (e) {

            let $e = $(e.relatedTarget);
            let idx = $e.index();
            let itemsPerSlide = 4;
            let totalItems = $('.carousel-6 .carousel-item').length;

            if (idx >= totalItems - (itemsPerSlide - 1)) {
                let it = itemsPerSlide - (totalItems - idx);
                for (let i = 0; i < it; i++) {
                    // append slides to end
                    if (e.direction == "left") {
                        $('.carousel-6 .carousel-item').eq(i).appendTo('.carousel-6 .carousel-inner');
                    }
                    else {
                        $('.carousel-6 .carousel-item').eq(0).appendTo('.carousel-6 .carousel-inner');
                    }
                }
            }
        });
    }
}