import { Routes } from '@angular/router'

import { SigninComponent } from './signin/signin.component'
import { FuseLoginComponent } from './login/login.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { LoginDeepcareComponent } from './login-deepcare/login-deepcare.component'


export const AuthenticationRoutes: Routes = [
    // {
    //     path: 'authentication/signin',
    //     component: SigninComponent,
    // },
    {
        path: 'deepcare',
        component: LoginDeepcareComponent
    },
    {
        path: 'login',
        component: FuseLoginComponent
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    }
]
