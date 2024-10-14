import { saveAs } from 'file-saver';

export class DownloadFileUtils {

    static exportFile(data: any, excel: boolean) {
        var filename = DownloadFileUtils.getFilenameFromHeader(data);
        if (excel) {
            this.downloadFile(data, filename);
        }
        else {
            this.viewPDF(data, filename);
        }
    }

    static viewOrDownloadFile(data: any, download: boolean) {
        var filename = DownloadFileUtils.getFilenameFromHeader(data);
        if (download) {
            this.downloadFile(data, filename);
        }
        else {
            this.viewPDF(data, filename);
        }
    }

    static downloadFile(data: any, filename: string) {
        // const blob = new Blob([data.body]);
        //const url = window.URL.createObjectURL(blob);
        saveAs(data.body, filename);
        //window.open(url);
    }

    static viewPDF(data: any, filename: string) {
        const blob = new Blob([data.body], {type: 'application/pdf'});
        const blobUrl = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        // iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
    }

    static printPDF(data: any) {
        const blob = new Blob([data.body], {type: 'application/pdf'});
        const blobUrl = URL.createObjectURL(blob);
        let iframe = document.getElementById('iframePdfPrinter') as HTMLIFrameElement;

        if (iframe) {
            iframe.remove();            
        }
        
        iframe = document.createElement('iframe');
        iframe.id = 'iframePdfPrinter';
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
    }

    static saveAsBlobUrl(data: any) {
        const blob = new Blob([data.body]);
        var filename = DownloadFileUtils.getFilenameFromHeader(data);
        const blobUrl = window.URL.createObjectURL(blob);
        return {
            url: blobUrl,
            filename: filename
        };
    }

    static saveAsBlobObject(data: any) {
        const blob = new Blob([data.body]);
        var filename = DownloadFileUtils.getFilenameFromHeader(data);
        return {
            blob: blob,
            filename: filename
        };
    }

    static getFilenameFromHeader(data) {
        var filename = "";
        var disposition = data.headers.get('content-disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var index = disposition.indexOf('filename*');
            if (index !== -1) {
                let filenameRegex = /filename\*=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/gi;
                
                let matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    return decodeURIComponent( matches[1]);
                }
            }
            
            let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/gi;
            let matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        return filename;
    }
}