import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'tracking-dialog',
  templateUrl: './tracking-dialog.component.html',
  styleUrls: ['./tracking-dialog.component.scss']
})
export class TrackingDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<TrackingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
        ,
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
