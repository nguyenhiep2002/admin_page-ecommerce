import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AraAutocompleteComponent } from '@aratech/controls/ara-autocomplete/ara-autocomplete.component';
import { BranchUserService } from '../services/branch-user.service';
import { ArrayUtils } from '@aratech/utils/arrayUtils';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'branch-user',
    templateUrl: './branch-user.component.html',
    styleUrls: ['./branch-user.component.scss'],
    providers: [TranslatePipe, BranchUserService],
    encapsulation: ViewEncapsulation.None
})
export class BranchUserComponent implements OnInit {
    branch: any = {};
    selectedUser: any;
    users: any[] = [];
    @ViewChild(AraAutocompleteComponent, { static: true }) userInput: AraAutocompleteComponent;

    constructor(private translate: TranslatePipe
        , public branchUserService: BranchUserService
        , public snackBar: MatSnackBar
        , public dialogRef: MatDialogRef<BranchUserComponent>
        , @Inject(MAT_DIALOG_DATA) public data: any
        , public dialog: MatDialog) {
        this.branch = this.data.item;
    }

    ngOnInit() {
        this.branchUserService.getUsers(this.branch.id).then(res => {
            this.users = res;
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

    async save() {
        try {
            let userIds = this.users.map(o => o.id);
            await this.branchUserService.saveUsers(this.branch.id, userIds);
            this.processResponse(true);
        }
        catch (ex) {
            this.processResponse(false);
        }
    }

    processResponse(res) {
        if (res) {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateSuccess'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
            this.dialogRef.close(res);
        }
        else {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateError'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        }
    }

    selectUser(user: any) {
        if (user) {
            setTimeout(() => {
                this.userInput.clear();
            }, 100);
            
            var exists = this.users.find(x => x.id == user.id);
            if (exists) return;                
            this.users.push(user);
        }
    }

    removeUser(user: any) {
        ArrayUtils.removeItem(this.users, user);
    }

    getDisplayText = (item) => {
        if (item.branchName)
            return `${item.name} (${item.branchName})`;
        
        return item.name;
    }
}
