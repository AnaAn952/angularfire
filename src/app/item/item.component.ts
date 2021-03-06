import { Component, Input, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { TranslateService } from '../services/translate.service';

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
        public translate: TranslateService,
    ) {
        $("#modal2").on("hide.bs.modal", () => {
            if (this.div) {
                this.showDeselect = false;
                this.div.nativeElement.classList = ["select-square"];
            }
        });
    }

    public setItemForNewTrade() {
        this.databaseService.itemForNewTrade = this.item;
    }

    public chooseBookTrade() {
        this.showDeselect = true;
        this.div.nativeElement.classList.add("square-background");
        this.databaseService.tradeBooksForChosenBooks.push(this.item.id);
    }

    public anuleazaAlegerea() {
        this.showDeselect = false;
        this.div.nativeElement.classList = ["select-square"];
        let index = this.databaseService.tradeBooksForChosenBooks.indexOf(this.item.id);

        this.databaseService.tradeBooksForChosenBooks.splice(index, 1);
    }

    public acceptaAceastaCarte() {
        this.databaseService.adaugaLaSchimburiAcceptate(this.item);
    }

    public isNotMine() {
        if (!this.item) return false;
        return !(this.item.proprietarCurent === localStorage.email);
    }

    public editMyBook() {
        $('#modalEditeazaCarte').modal('show');
        this.databaseService.editMyBook = this.item;
    }

    public removeMyBook() {
        $("#modalSterge").modal('show');
        this.databaseService.stergeMyBook = this.item;
    }

    public stergeElementRefuzat() {
        console.log(this.item);
        this.databaseService.stergeElementRefuzat(this.item.id);
    }

    public stergeElementAnulat() {
        this.databaseService.stergeElementAnulat(this.item.databaseKey);
    }

    public doAction() {
        if (this.allowedActiune) {
            $('#modalDetalii').modal('show');
            this.databaseService.itemModalDetalii = this.item;
            this.databaseService.tradeBooksForChosenBooks = [];
        } else if (this.alege_catalog && !this.showDeselect) {
            this.chooseBookTrade();
        } else if (this.alege_catalog && this.showDeselect) {
            this.anuleazaAlegerea();
        } else if (this.item && this.item.oferi_schimb && this.item.actiune === "refuzat") {
            return;
        } else if (this.item && this.item.zona_de_raspuns && this.item.actiune === "anulat") {
            return;
        } else if (this.item && this.item.oferi_schimb && this.item.status === "disponibila") {
            $('#modalChosenSolicitate').modal('show');
            this.databaseService.seeBooksInExchange(this.item);
        } else if (this.item.zona_de_raspuns) {
            $('#modalChosenSolicitate').modal('show');
            this.databaseService.answerOffer(this.item);
        }
    }
}