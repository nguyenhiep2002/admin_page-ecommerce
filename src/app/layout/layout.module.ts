import { NgModule } from '@angular/core'
import { LayoutComponent } from 'app/layout/layout.component'
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module'
import { CenteredLayoutModule } from 'app/layout/layouts/horizontal/centered/centered.module'
import { EnterpriseLayoutModule } from 'app/layout/layouts/horizontal/enterprise/enterprise.module'
import { MaterialLayoutModule } from 'app/layout/layouts/horizontal/material/material.module'
import { ModernLayoutModule } from 'app/layout/layouts/horizontal/modern/modern.module'
import { ClassicLayoutModule } from 'app/layout/layouts/vertical/classic/classic.module'
import { ClassyLayoutModule } from 'app/layout/layouts/vertical/classy/classy.module'
import { CompactLayoutModule } from 'app/layout/layouts/vertical/compact/compact.module'
import { DenseLayoutModule } from 'app/layout/layouts/vertical/dense/dense.module'
import { FuturisticLayoutModule } from 'app/layout/layouts/vertical/futuristic/futuristic.module'
import { ThinLayoutModule } from 'app/layout/layouts/vertical/thin/thin.module'
import { SettingsModule } from 'app/layout/common/settings/settings.module'
import { SharedModule } from 'app/shared/shared.module'
import { RouterModule, Routes } from '@angular/router'
import { TestTypeComponent } from 'app/modules/category/test-type/test-type.component'
import { AddTestTypeComponent } from 'app/modules/category/test-type/add-test-type/add-test-type.component'

const mainRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: TestTypeComponent
      },
      {
        path: 'category',
        loadChildren: () => import('app/modules/category/category.module').then((m) => m.CategoryModule)
      },
      {
        path: 'management',
        loadChildren: () => import('app/modules/management/management.module').then((m) => m.ManagementModule)
      }
    ]
  }
]

const layoutModules = [
  // Empty
  EmptyLayoutModule,

  // Horizontal navigation
  CenteredLayoutModule,
  EnterpriseLayoutModule,
  MaterialLayoutModule,
  ModernLayoutModule,

  // Vertical navigation
  ClassicLayoutModule,
  ClassyLayoutModule,
  CompactLayoutModule,
  DenseLayoutModule,
  FuturisticLayoutModule,
  ThinLayoutModule
]

@NgModule({
  declarations: [LayoutComponent],
  imports: [SharedModule, RouterModule.forChild(mainRoutes), SettingsModule, ...layoutModules],
  exports: [LayoutComponent, ...layoutModules],
  providers:[AddTestTypeComponent]
})
export class LayoutModule {}
