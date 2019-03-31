import { Component, Input, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/database.service';

declare let $;

@Component({
    selector: 'catalogue-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent {
    @Input('item') item: any;
    @Input('pe_asta') pe_asta: any = false;
    @Input('allowedActiune') allowedActiune: any = false;
    @Input('alege_catalog') alege_catalog: any = false;
    @Input('useOthers') useOthers: any = false;
    @Input('squareSelector') squareSelector: any = false;
    @Input('carousel') carousel: any = false;
    @Input('profile') profile: any = false;
    @Input('category') category: any = "";

    @ViewChild('itemDiv') itemDiv: any;
    @ViewChild('button1') button1: any;
    @ViewChild('select') div: any;

    public showDeselect: any = false;

    constructor(
        public databaseService: DatabaseService,
    ) {}

    public setItemForNewTrade() {
        this.databaseService.itemForNewTrade = this.item;
    }

    public chooseBookTrade() {
        this.showDeselect = true;
        this.div.nativeElement.classList.add("square-background");
        this.databaseService.tradeBooksForChosenBooks += this.item.id + ",";
    }

    public anuleazaAlegerea() {
        this.showDeselect = false;
        this.div.nativeElement.classList = ["select-square"];
        let books = this.databaseService.tradeBooksForChosenBooks;

        this.databaseService.tradeBooksForChosenBooks = books.split(this.item.id + ',')[0] + books.split(this.item.id + ',')[1];
    }

    public acceptaAceastaCarte() {
        this.databaseService.adaugaLaSchimburiAcceptate(this.item);
    }

    public isNotMine() {
        if (!this.item) return false;
        return !(this.item.id.split('.com_')[0] + '.com' === localStorage.email);
    }

    public editMyBook() {
        $('#modalEditeazaCarte').modal('show');
        this.databaseService.editMyBook = this.item;
    }

    public removeMyBook() {
        $("#modalSterge").modal('show');
        this.databaseService.stergeMyBook = this.item;
    }

    public doAction() {
        if (this.isNotMine() && this.allowedActiune) {
            $('#modalDetalii').modal('show');
            this.databaseService.itemModalDetalii = this.item;
        } else if (this.alege_catalog && !this.showDeselect) {
            this.chooseBookTrade();
        } else if (this.alege_catalog && this.showDeselect) {
            this.anuleazaAlegerea();
        } else if (this.item && this.item.oferi_schimb && this.item.status === "disponibila") {
            $('#modalChosenSolicitate').modal('show');
            this.databaseService.seeBooksInExchange(this.item);
        } else if (this.item.zona_de_raspuns) {
            $('#modalChosenSolicitate').modal('show');
            this.databaseService.answerOffer(this.item);
        } else if (this.item && this.item.pe_asta && this.item.status !== "indisponibil") {
            this.acceptaAceastaCarte();
        }
    }
}