import { Component, Input } from '@angular/core';
import * as firebase from 'firebase';
import { DatabaseService } from '../../services/database.service';

declare let $: any;

@Component({
    selector: 'event-item',
    templateUrl: './event-item.component.html',
    styleUrls: ['./event-item.component.css'],
})
export class EventItemComponent {
    @Input("item") item: any;

    constructor(
        public databaseService: DatabaseService,
    ) {
    }

    public participanti = [];
    public participantiDetaliat = [];

    modalParticipanti() {
        this.participanti = [];
        this.participantiDetaliat = [];
        for (let item in this.item.participanti) {
            this.participanti.push(item);
        }

        this.databaseService.setPersonsArray(this.participanti.filter(elem => this.item.participanti[elem] == "going"), this.participantiDetaliat);
        $("#modalParticipanti").modal("show");
    }

    participa() {
        this.item.participanti[this.databaseService.convertToDatabaseFormat(localStorage.getItem("email"))] = "going";
        this.databaseService.participateAtEvent(this.item.databaseKey, this.item.participanti);
    }

    retrageTe() {
        this.item.participanti[this.databaseService.convertToDatabaseFormat(localStorage.getItem("email"))] = "anulat";
        this.databaseService.participateAtEvent(this.item.databaseKey, this.item.participanti);
    }

    arataButonParticipa() {
        return this.item.participanti[this.databaseService.convertToDatabaseFormat(localStorage.getItem("email"))] !== "going";
    }
}