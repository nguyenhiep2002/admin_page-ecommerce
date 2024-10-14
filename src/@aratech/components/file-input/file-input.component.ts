import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { faFileWord, faFileExcel, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileService } from '@aratech/services/uploadFile.service';
import { ViewFileService } from '@aratech/services/view-file.service';

@Component({
    selector: 'file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit, OnChanges {
    @Input() filename: string;
    @Input() accept: string;
    @Input() label: string;
    @Input() value: any;
    @Input() viewOnly: boolean = false;
    @Input() required: boolean = false;
    @Input() id: string;
    @Output() dataFile: EventEmitter<any> = new EventEmitter();
    @Output() valueChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('fileInput', { static: true }) fileInput:ElementRef;

    fileList: FileList;
    edited: boolean = false;
    extension: string;
    fileWordIcon: any;
    fileExcelIcon: any;
    filePdfIcon: any;
    fileIcon: any;

    constructor(public uploadFileService: UploadFileService
        , public viewFileService: ViewFileService
        , public dialog: MatDialog) { 

        this.fileWordIcon = faFileWord;
        this.fileExcelIcon = faFileExcel;
        this.filePdfIcon = faFilePdf;
        this.fileIcon = faFileAlt;
    }

    ngOnInit() {
        if (this.value) {
            this.filename = this.value.filename;
            this.extension = this.getFileExtension(this.filename);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.ngOnInit();
        }
    }

    clear() {
        this.filename = undefined;
        this.extension = undefined;
        this.fileList = undefined;
        this.value = undefined;
        this.fileInput.nativeElement.value = '';
        this.valueChange.emit(this.value);
        this.dataFile.emit(this.value);
    }

    chooseFile() {
        this.fileInput.nativeElement.click();
    }

    fileChange(event) {
        this.fileList = event.target.files;
        if(this.fileList.length > 0) {
            this.filename = this.fileList[0].name;
            this.extension = this.getFileExtension(this.filename);
        }
        this.dataFile.emit(this.fileList);
    }

    async uploadFiles() : Promise<any> {
        if(this.fileList && this.fileList.length > 0) {
            let formData:FormData = new FormData();
            Array.from(this.fileList).forEach(f => {
                formData.append('files', f, f.name);
            });
            
            const rs = await this.uploadFileService.uploadFiles(formData);
            if (rs && rs.uploadedFiles && rs.uploadedFiles.length > 0)
                this.value = rs.uploadedFiles[0];
            else
                this.value = undefined;
            this.fileList = undefined;
            this.valueChange.emit(this.value);
            this.dataFile.emit(this.value);
        }

        return Promise.resolve(this.value);
    }

    viewFile(file: any) {
        if (file.id) {
            this.viewFileService.getFileStreamById(file.id, this.dialog);
        }
    }

    getFileExtension(filename: string) {
        if (!filename)
            return '';
        
        let arr = filename.split('.');
        let ext =  arr[arr.length - 1].toLowerCase();
        let defaultExts = ['pdf', 'xls', 'xlsx', 'doc', 'docx'];

        if (defaultExts.indexOf(ext) > -1)
            return ext;
        else 
            return 'file';
    }
}
