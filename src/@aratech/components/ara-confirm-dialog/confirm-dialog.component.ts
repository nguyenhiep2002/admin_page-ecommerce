import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'ara-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class AraConfirmDialogComponent implements OnInit
{
    public confirmMessage: string;

    constructor(public dialogRef: MatDialogRef<AraConfirmDialogComponent>)
    {
    }

    ngOnInit()
    {
    }

}
