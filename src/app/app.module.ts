import { HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router'
import { FuseModule } from '@fuse'
import { FuseConfigModule } from '@fuse/services/config'
import { FuseMockApiModule } from '@fuse/lib/mock-api'
import { CoreModule } from 'app/core/core.module'
import { appConfig } from 'app/core/config/app.config'
import { LayoutModule } from 'app/layout/layout.module'
import { AppComponent } from 'app/app.component'
import { appRoutes } from 'app/app.routing'
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { AuthenticationService } from '@aratech/services/AuthenticationService'
import { WaitingService } from '@aratech/services/waiting.service'
import { MatPaginatorIntlCro } from './shared/MatPaginatorIntlCro'
import { AuthGuard } from './shared/auth.guard'
import { ConfigProvider, configProviderFactory } from './shared/config.provider'
import { TranslateModule, TranslatePipe } from '@ngx-translate/core'
import { ManagementModule } from './modules/management/management.module'

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled'
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),
    TranslateModule,
    // Fuse, FuseConfig & FuseMockAPI
    FuseModule,
    FuseConfigModule.forRoot(appConfig),
    TranslateModule.forRoot(),

    // Core module of your application
    CoreModule,
    HttpClientModule,
    // Layout module of your application
    LayoutModule,

    // ManagementModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
    AuthenticationService,
    WaitingService,
    ConfigProvider,
    TranslatePipe,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true } },
    { provide: APP_INITIALIZER, useFactory: configProviderFactory, deps: [ConfigProvider], multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
