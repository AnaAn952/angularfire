import { Component } from '@angular/core';

import { PDFJSStatic } from 'pdfjs-dist';
import { DatabaseService } from '../../services/database.service';

declare let require: any;
declare let $: any;
const PDFJS: PDFJSStatic = require('pdfjs-dist');

@Component({
    selector: 'pdf-convert',
    templateUrl: './pdf-convert.component.html',
    styleUrls: ['./pdf-convert.component.css'],
})
export class PdfConvertComponent {

    public src = null;

    constructor(
      public databaseService: DatabaseService,
    ) {}

    public updateazaInformatii(value: any) {
        this.src = null;
        let valueArray = this.convertToObjects(value);
        for (let item of valueArray) {
            this.databaseService.removePdfBooksNumber += item.carti.length;
        }

        for (let item of valueArray) {
            for (let elem of item.carti) {
                let a = this.databaseService.getBookDetails(elem).subscribe((details: any) => {
                    if (details) {
                        this.databaseService.removePdfBooksObject[details.proprietarCurent] ? this.databaseService.removePdfBooksObject[details.proprietarCurent].push(details.id)
                            : this.databaseService.removePdfBooksObject[details.proprietarCurent] = [details.id];
                        this.databaseService.handlePdfBook(details, item.user);
                    }
                    a.unsubscribe();
                });
            }
        }
    }

    public convertToObjects(value: any) {
        let values = [];
        let changes = value.split(";");
        for (let item of changes) {
            item = item.split("Utilizatorul ")[1];
            item = item.split(" a primit cartile cu id-urile ");
            let utilizator = item[0].replace(/\s/g, "");
            let carti = item[1].replace(/\s/g, "");
            values.push({
                user: utilizator,
                carti: carti.split(",")
            });
        }

        return values;
    }

    public getText(pdfUrl) {
        let pdf1 = PDFJS.getDocument(pdfUrl);
        return pdf1.then((pdf) => {
            let maxPages = pdf.numPages;
            let countPromises = [];
            for (let j = 1; j <= maxPages; j++) {
                if (pdf.getPage(j)) {
                    let page = pdf.getPage(j);

                    countPromises.push(page.then((page) => {
                        let textContent = page.getTextContent();
                        return textContent.then((text) => {
                            return text.items.map(s => s.str).join('');
                        });
                    }));
                }
            }
            return Promise.all(countPromises).then((texts) => {
                return texts.join('');
            });
        });
    }

    public onFileChange(e: any) {
        this.src = URL.createObjectURL(e.target.files[0]);
    }

    public adauga() {
        this.databaseService.removePdfBooksObject = {};
        this.getText(this.src).then((value) => {
            this.updateazaInformatii(value);
        });
        $("#modalPdf").modal('hide');
        $("#inputPdf").val("");
    }

}