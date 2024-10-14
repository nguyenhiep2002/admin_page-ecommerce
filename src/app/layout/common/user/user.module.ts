import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserComponent } from 'app/layout/common/user/user.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip'
import { LanguagesModule } from '../languages/languages.module'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
    declarations: [
        UserComponent
    ],
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    SharedModule,
    MatTooltipModule,
    LanguagesModule,
    TranslateModule
  ],
    exports     : [
        UserComponent
    ]
})
export class UserModule
{
}
