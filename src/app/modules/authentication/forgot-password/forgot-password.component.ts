import { FuseConfigService } from '@fuse/services/config';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective,
    NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { ForgotPasswordService } from '../services/forgot-password.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        const invalidCtrl = !!(
            control &&
            control.invalid &&
            control.parent.dirty
        );
        const invalidParent = !!(
            control &&
            control.parent &&
            control.parent.invalid &&
            control.parent.dirty
        );

        return invalidCtrl || invalidParent;
    }
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    providers: [ForgotPasswordService, TranslatePipe],
    animations: fuseAnimations,
})
export class ForgotPasswordComponent implements OnInit {
    item: any = {};
    saveMail: any;

    form: FormGroup;
    verificationForm: FormGroup;
    resetForm: FormGroup;
    identifier: FormControl;
    formErrors: any;
    isValid: boolean;
    public errorMessage: string = '';
    @ViewChild('stepper') private myStepper: MatStepper;
    matcher = new MyErrorStateMatcher();
    constructor(
        // private service: ForgotPasswordService,
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private translate: TranslatePipe,
        private router: Router
    ) {
        this.fuseConfig.config({
            layout: {
                navigation: 'none',
                toolbar: 'none',
                footer: 'none',
                class: '',
            },
        });

        this.formErrors = {
            email: {},
            verificationCode: {},
            newPassword: {},
            confirmPassword: {},
        };
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: new FormControl(this.item.email, [
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
                ]),
            ]),
        });
        this.verificationForm = this.formBuilder.group({
            verificationCode: new FormControl(this.item.verificationCode, [
                Validators.compose([Validators.required]),
            ]),
        });
        this.resetForm = this.formBuilder.group(
            {
                newPassword: new FormControl(this.item.newPassword, [
                    Validators.compose([Validators.required]),
                ]),
                confirmPassword: new FormControl(this.item.confirmPassword, [
                    Validators.compose([Validators.required]),
                ]),
            },
            { validators: this.checkPasswords }
        );

        this.form.valueChanges.subscribe(() => {
            this.onValuesChanged();
        });
    }

    onValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    checkPasswords(group: FormGroup) {
        // here we have the 'passwords' group
        const newPassword = group.get('newPassword').value;
        const confirmPassword = group.get('confirmPassword').value;

        return newPassword === confirmPassword ? null : { notSame: true };
    }

    onSubmit() {
        // this.testService.post(this.item).subscribe(rs =>{
        //     // if(rs.status == true){
        //     //     this.myStepper.next();
        //     // } else {
        //     //     this.isValid = true;
        //     // }
        // })
        // this.myStepper.next();
    }

    confirmCode() {
        // this.testService.post(this.item).subscribe(rs =>{
        //     this.myStepper.next();
        // })
    }

    rsPassword() {
        // this.testService.post(this.item).subscribe(rs =>{
        //     this.myStepper.next();
        // })
    }
}
