import { Routes } from '@angular/router'
import { AraManagementComponent } from '@aratech/components/ara-management/ara-management.component'
import { DynamicCategoryServiceResolve } from './services/category.service'
import { CategoryTypeServiceResolve } from './services/categoryType.service'

import { TestTypeComponent } from './test-type/test-type.component'
import { HocmapComponent } from './hocmap/hocmap.component'

export const CategoryRoutes: Routes = [
  // {
  //   path: 'cattype',
  //   component: AraManagementComponent,
  //   resolve: {
  //     category: CategoryTypeServiceResolve
  //   }
  // },
  // {
  //   path: 'cat',
  //   component: AraManagementComponent,
  //   resolve: {
  //     category: DynamicCategoryServiceResolve
  //   }
  // },
  {
    path: 'testtype',
    component: TestTypeComponent
  },
  {
    path: 'hocmap',
    component: HocmapComponent
  }
]
