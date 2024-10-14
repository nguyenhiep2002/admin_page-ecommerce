import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { DownloadFileUtils } from '@aratech/utils/downloadFileUtils';

@Component({
    selector: 'ara-view-pdf',
    templateUrl: './ara-view-pdf.component.html',
    styleUrls: ['./ara-view-pdf.component.scss'],
})
export class AraViewPdfComponent implements OnInit {
    options: any = {};
    dataSource: any;
    fileData: any;
    @Output() downloadClick: EventEmitter<any> = new EventEmitter();

    constructor(public dialogRef: MatDialogRef<AraViewPdfComponent>,
        private domSanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.options = data;        

        if (data.blobData) {
            this.fileData = data.blobData;
            var reader = new FileReader();
            var me = this;
            reader.readAsArrayBuffer(data.blobData); 
            reader.onloadend = function() {
                let buffer = reader.result as ArrayBuffer;
                me.dataSource = new Uint8Array(buffer);
            }
        }

        if (data.streamData) {
            this.fileData = data.streamData;
            const blob = new Blob([data.streamData.body], {type: 'application/pdf'});
            this.dataSource = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        }
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close();
    }

    download() {
        if (this.fileData && this.options.ext == 'pdf') {
            DownloadFileUtils.viewOrDownloadFile(this.fileData, true);
        }
        else {
            this.downloadClick.emit();
        }
    }
}
