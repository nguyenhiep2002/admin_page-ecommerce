import { FuseConfigService } from '@fuse/services/config';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { SignUpService } from '../services/signUp.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    providers: [SignUpService, TranslatePipe],
    animations: fuseAnimations
})
export class SignUpComponent implements OnInit {
    item: any = {};
    signUpForm: FormGroup;
    signUpFormErrors: any;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private signUpService: SignUpService,
        public snackBar: MatSnackBar,
        private translate: TranslatePipe,
    ) {
        this.fuseConfig.config({
            layout: {
                navigation: 'none',
                toolbar: 'none',
                footer: 'none',
                class: ''
            }
        });

        this.signUpFormErrors = {
            name: {},
            email: {},
        };
    }

    ngOnInit(): void {
        this.signUpForm = this.formBuilder.group({
            name: new FormControl(this.item.name, [Validators.compose([Validators.required])]),
            email: new FormControl(this.item.email, [Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)])]),
            phone: this.item.phone,
            adress: this.item.adress,
        });

        this.signUpForm.valueChanges.subscribe(() => {
            this.onSignUpFormValuesChanged();
        });
    }

    onSignUpFormValuesChanged() {
        for (const field in this.signUpFormErrors) {
            if (!this.signUpFormErrors.hasOwnProperty(field)) {
                continue;
            }
            this.signUpFormErrors[field] = {};
            const control = this.signUpForm.get(field);

            if (control && control.dirty && !control.valid && !control.pending) {
                this.signUpFormErrors[field] = control.errors ? control.errors : {};
            }
        }
    }

    save() {
        this.signUpService.register(this.item).then(res => {
            this.processResponse(true);
        },
            err => {
                this.processResponse(false);
            }
        );
    }

    processResponse(res) {
        if (res) {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateSuccess'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        }
        else {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateError'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        }
    }
}
