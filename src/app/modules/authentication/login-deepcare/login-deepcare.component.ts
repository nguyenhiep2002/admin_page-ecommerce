import { Component, Inject, ViewEncapsulation } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'
import { fuseAnimations } from '../../../../@fuse/animations'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GrantType } from '../../../../assets/configs/config.interface'
import { Configs } from '../../../../@aratech/utils/configs'
import { FuseSplashScreenService } from '../../../../@fuse/services/splash-screen'
import { AuthenticationService } from '../../../../@aratech/services/AuthenticationService'
import { Router } from '@angular/router'
import { DOCUMENT } from '@angular/common'

@Component({
    selector: 'app-login-deepcare',
    templateUrl: './login-deepcare.component.html',
    styleUrls: ['./login-deepcare.component.scss'],
    providers: [TranslatePipe],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginDeepcareComponent {
    loginForm: FormGroup
    loginFormErrors: any
    grant_type: GrantType = Configs.getConfig('GrantType')
    saveLogin: boolean = false
    loggingIn: boolean = false
    loggingInDeepcare: boolean = false
    loginAccount: boolean = false
    showAlert: boolean = false
    alert: any = {}
    optionLogin: any = this.grant_type.DeepCare

    public errorMessage: string = ''

    constructor(
        public _splashScreenService: FuseSplashScreenService,
        private formBuilder: FormBuilder,
        private authenService: AuthenticationService,
        public translate: TranslatePipe,
        private router: Router,
        @Inject(DOCUMENT) private document: any
    ) {
        setTimeout(() => {
            this._splashScreenService.hide()
        })
        this.loginFormErrors = {
            username: {},
            password: {}
        }
    }

    ngOnInit() {
        for (let i = 0; i < this.document.body.classList.length; i++) {
            const className = this.document.body.classList[i]
            if (className.startsWith('theme-')) {
                this.document.body.classList.remove(className)
            }
        }
        this.document.body.classList.add('theme-default')
        let usr = ''
        let pws = ''
        this.loginForm = this.formBuilder.group({
            username: [usr, [Validators.required]],
            password: [pws, Validators.required],
            saveLogin: [this.saveLogin],
            loginAccount: [this.loginAccount]
        })
        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged()
        })
    }

    async login(keyCode: Number) {
        if (keyCode == 13) {
            await this.onSubmit()
        }
    }

    async onSubmit() {
        const grant_type = this.optionLogin
        this.errorMessage = ''
        if (this.loginForm.valid) {
            if (grant_type == this.grant_type.DeepCare) {
                this.loggingInDeepcare = true
                this.loginAccount = true
            }
            if (grant_type == this.grant_type.Password) {
                this.loggingIn = true
                this.loginAccount = false
            }
            let usr = this.loginForm.controls['username'].value
            let pws = this.loginForm.controls['password'].value
            const resp = await this.authenService.login(usr, pws, this.loginAccount)
            if (resp) {
                if (this.saveLogin) {
                    localStorage.setItem('tnthvn_usr', usr)
                    localStorage.setItem('tnthvn_pws', pws)
                    localStorage.setItem('tnthvn_save', 'true')
                } else {
                    localStorage.removeItem('tnthvn_usr')
                    localStorage.removeItem('tnthvn_pws')
                    localStorage.removeItem('tnthvn_save')
                }
                await this.router.navigate([''])
            } else {
                this.alert = {
                    type: 'error',
                    message: this.translate.transform('Tài khoản hoặc mật khẩu không đúng')
                }
                this.showAlert = true
            }
            this.loggingIn = false
            this.loggingInDeepcare = false
        }
    }

    onLoginFormValuesChanged() {
        for (const field in this.loginFormErrors) {
            if (!this.loginFormErrors.hasOwnProperty(field)) {
                continue
            }

            // Clear previous errors
            this.loginFormErrors[field] = {}

            // Get the control
            const control = this.loginForm.get(field)

            if (control && control.dirty && !control.valid) {
                this.loginFormErrors[field] = control.errors
            }
        }
    }

}
