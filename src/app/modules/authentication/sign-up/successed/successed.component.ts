import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    templateUrl: './successed.component.html',
    styleUrls: ['./successed.component.scss'],
    providers: [TranslatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class SuccessedComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<SuccessedComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
    }

    cancel() {
        this.dialogRef.close();
    }
}
