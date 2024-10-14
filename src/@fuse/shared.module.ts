import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';

// import { FlexLayoutModule } from '@angular/flex-layout';

// import { FuseDirectivesModule } from '@fuse/directives/directives';
// import { FusePipesModule } from '@fuse/pipes/pipes.module';

@NgModule({
    imports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule
        // FlexLayoutModule,

        // FuseDirectivesModule,
        // FusePipesModule
    ],
    exports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule
        // FlexLayoutModule,

        // FuseDirectivesModule,
        // FusePipesModule
    ]
})
export class FuseSharedModule
{
}
