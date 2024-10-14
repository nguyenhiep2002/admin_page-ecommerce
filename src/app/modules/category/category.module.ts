import { TestTypeService, TestTypeServiceResolve } from './services/testType.service'
import { RouterModule } from '@angular/router'
import { CategoryRoutes } from './category.routing'
import { AraCoreModule } from '@aratech/ara-core.module'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialogModule } from '@angular/material/dialog'
import { MatRippleModule } from '@angular/material/core'
import { TranslateModule,TranslatePipe } from '@ngx-translate/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { FuseSharedModule } from '@fuse/shared.module'
import { AraCommonModule } from '@aratech/ara-common.module'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { DynamicCategoryService, DynamicCategoryServiceResolve } from './services/category.service'
import { CategoryTypeService, CategoryTypeServiceResolve } from './services/categoryType.service'
import { StandardTestServiceResolve, StandardTestService } from './services/standardTest.service'
import { BranchUserService } from './services/branch-user.service'
import { BranchService, BranchServiceResolve } from './services/branch.service'
import { BranchUserComponent } from './branch-user/branch-user.component'
import { DeviceService, DeviceServiceResolve } from './services/device.service'
import { AddRuleComponent } from './add-rule/add-rule.component'
import { DeviceTestCodeService, DeviceTestCodeServiceResolve } from './services/deviceTestCode.service'
import { TestTypeComponent } from './test-type/test-type.component'
import { AddTestTypeComponent } from './test-type/add-test-type/add-test-type.component';
import { HocmapComponent } from './hocmap/hocmap.component'


export const importModules = [
    RouterModule.forChild(CategoryRoutes),
    FuseSharedModule,
    AraCoreModule,
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
    AraCommonModule,
    DragDropModule
]

@NgModule({
    declarations: [
        TestTypeComponent,
        BranchUserComponent,
        AddRuleComponent,
        AddTestTypeComponent,
        HocmapComponent,
    ],
    imports: importModules,
    providers: [
        TranslatePipe,
        // DynamicCategoryServiceResolve,
        // DynamicCategoryService,
        // CategoryTypeServiceResolve,
        // CategoryTypeService,
        TestTypeServiceResolve,
        TestTypeService,
        AddTestTypeComponent,
        BranchService,
        BranchServiceResolve,
        BranchUserService,
        
    ],
    
    exports: [],
    bootstrap: [BranchUserComponent, AddRuleComponent,AddTestTypeComponent],
})
export class CategoryModule {
}
