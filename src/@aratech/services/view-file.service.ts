import { Injectable, Injector } from "@angular/core";
import { BaseService } from '@aratech/services/base.service';
import { DownloadFileUtils } from '@aratech/utils/downloadFileUtils';
import { AraViewPdfComponent } from '@aratech/components/ara-view-pdf/ara-view-pdf.component';
import { AraViewExcelComponent } from '@aratech/components/ara-view-excel/ara-view-excel.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Constants } from "app/shared/constants";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
})
export class ViewFileService extends BaseService<any> {
    static allActions: any[];
    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.ViewFiles.Resource, injector);
    }

    async getFileStreamById(fileId: string, dialog: MatDialog) {
        let headers = new HttpHeaders();
        let url = `${this.svUrl}/GetById/${fileId}`;

        try {
            const response = await this.httpGet(url, { responseType: 'blob', observe: 'response', headers: headers });
            var filename = DownloadFileUtils.getFilenameFromHeader(response);
            var arrName = filename.split('.');
            var ext = arrName[arrName.length - 1].toLowerCase();
            
            if (dialog && (ext === 'pdf')) {                
                var dialogRef = dialog.open(AraViewPdfComponent, {
                    panelClass: 'dialog-fullscreen',
                    data: {
                        streamData: response,
                        filename: filename,
                        extension: ext,
                        fileId: fileId
                    }
                });

                dialogRef.componentInstance.downloadClick.subscribe(() => {
                    this.downloadFile(fileId);
                });
            }
            // else if (dialog && (ext === 'xlsx' || ext === 'xls')) {                
            //     dialog.open(AraViewExcelComponent, {
            //         panelClass: 'dialog-fullscreen',
            //         data: {
            //             streamData: response,
            //             filename: filename
            //         }
            //     });
            // }
            else {
                DownloadFileUtils.viewOrDownloadFile(response, true);
            }
        }
        catch (err) {
            throw err;
        }
    }

    async downloadFile(fileId: string) {
        let headers = new HttpHeaders();
        let url = `${this.svUrl}/getById/${fileId}`;

        try {
            const response = await this.httpGet(url, { responseType: 'blob', observe: 'response', headers: headers });
            DownloadFileUtils.viewOrDownloadFile(response, true);
        }
        catch (err) {
            throw err;
        }
    }

    async getViewImgById(fileId: string) {
        let headers = new Headers();
        let url = this.svUrl.replace(Constants.ApiResources.ViewFiles.Resource, Constants.ApiResources.ViewFiles.ResourceImage) + fileId;
        
        try {
            let  stream = await this.httpGet(url, { headers: headers });
            if(stream)
            return stream.url
        }
        catch (err) {
            throw err;
        }
    }
    getUrlImageById(fileId: string) {
        return this.svUrl.replace(Constants.ApiResources.ViewFiles.Resource, Constants.ApiResources.ViewFiles.ResourceImage) + fileId;
    }


}