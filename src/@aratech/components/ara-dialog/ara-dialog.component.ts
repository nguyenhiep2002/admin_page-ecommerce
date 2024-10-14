import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AraFormComponent } from '../ara-form/ara-form.component';

@Component({
    selector: 'ara-dialog',
    templateUrl: './ara-dialog.component.html',
    styleUrls: ['./ara-dialog.component.scss']
})
export class AraDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<AraFormComponent>,
        @Inject(MAT_DIALOG_DATA) public options: any) { }

    ngOnInit() {
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
