import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { UserService } from 'app/shared/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserValidator } from '../user-validator';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    providers: [TranslatePipe],
    encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    oldPassword: FormControl;
    password: FormControl;
    confirmPassword: FormControl;
    item: any;

    constructor(private service: UserService,
        public dialogRef: MatDialogRef<ResetPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private translate: TranslatePipe) {

        this.item = this.data.user;
        this.formErrors = {
            oldPassword: {},
            password: {},
            confirmPassword: {}
        };
    }

    ngOnInit() {
        this.oldPassword = new FormControl('', Validators.required);
        this.password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30), 
            UserValidator.weakPassword, UserValidator.notEqualsTo(this.oldPassword)]));
        this.confirmPassword = new FormControl('', Validators.compose([Validators.required, UserValidator.comparisonValidator(this.password)]));
        this.form = this.formBuilder.group({
            oldPassword: this.oldPassword,
            password: this.password,
            confirmPassword: this.confirmPassword
        });
        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    onFormValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid && !control.pending) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }

    processResponse(res, msg?) {
        if (res) {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateSuccess'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
            this.dialogRef.close(res);
        }
        else {
            var key = 'User.Msg.ChangePasswordFailed';
            if (msg == "WrongOldPassword")
                key = 'User.Msg.ChangePasswordFailedWrongOldPass';

            this.snackBar.open(this.translate.transform(key), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        }
    }

    save(): void {
        if (this.password.value != this.confirmPassword.value) {
            this.snackBar.open(this.translate.transform('User.Msg.Password.Confirm'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
            return;
        }

        var model = { oldPassword: this.oldPassword.value, password: this.password.value, confirmPassword: this.confirmPassword.value };
        this.service.resetPassword(model)
            .then(() => {
                this.processResponse(true);
            },
            (err) => {
                this.processResponse(false, err.error);
            });
    }
}
