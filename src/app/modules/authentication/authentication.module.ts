
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutes } from './authentication.routing';
import { SigninComponent } from './signin/signin.component';
import { FuseLoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordService } from './services/forgot-password.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SuccessedComponent } from './sign-up/successed/successed.component';
import { AuthenticationService } from '@aratech/services/AuthenticationService';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AraCoreModule } from '@aratech/ara-core.module';
import { AraCommonModule } from '@aratech/ara-common.module';
import { FuseConfigService } from '@fuse/services/config';
import { LoginDeepcareComponent } from './login-deepcare/login-deepcare.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    FuseSharedModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatRippleModule,
    TranslateModule,
    AraCoreModule,
    AraCommonModule,
  ],
  declarations: [ 
    SigninComponent, 
    FuseLoginComponent,
    ForgotPasswordComponent, 
    SignUpComponent, 
    SuccessedComponent, LoginDeepcareComponent
  ],
  providers: [
    AuthenticationService, 
    FuseConfigService, 
    ForgotPasswordService
  ]
})

export class AuthenticationModule { }
``