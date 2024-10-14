import { NgModule } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRippleModule } from '@angular/material/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'
import { AraCommonModule } from '@aratech/ara-common.module'
import { AraCoreModule } from '@aratech/ara-core.module'
import { FuseSharedModule } from '@fuse/shared.module'
import { TranslateModule, TranslatePipe } from '@ngx-translate/core'
import { ManagementRoutes } from './management.routing'
import { FuseDrawerModule } from '../../../@fuse/components/drawer/drawer.module'
import { FuseCardModule } from '@fuse/components/card'

import { FuseConfirmationModule } from '@fuse/services/confirmation'
import { AngularSplitModule } from 'angular-split'
import {
    NotificationError,
    NotificationInfo,
    NotificationSuccess,
    NotificationWarning
} from './common/notification-custom'

import { OverlayModule } from '@angular/cdk/overlay'


import { TrackingComponent } from './tracking/tracking.component'
import { TrackingSearchComponent } from './tracking/tracking-search/tracking-search.component'
import { TrackingDialogComponent } from './tracking/tracking-dialog/tracking-dialog.component'


const importModules = [
    RouterModule.forChild(ManagementRoutes),
    FuseSharedModule,
    AraCoreModule,
    AraCommonModule,
    FormsModule,

    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatRippleModule,
    TranslateModule,
    MatToolbarModule,
    DragDropModule,
    FuseDrawerModule,
    FuseCardModule,
    FuseConfirmationModule,
    AngularSplitModule,
    OverlayModule
]

@NgModule({
    declarations: [
        NotificationSuccess,
        NotificationWarning,
        NotificationError,
        NotificationInfo,
        TrackingComponent,
        TrackingSearchComponent,
        TrackingDialogComponent,
    ],
    providers: [TranslatePipe],
    exports: [],
    bootstrap: [],
    entryComponents: [],
    imports: importModules
})
export class ManagementModule {
}
