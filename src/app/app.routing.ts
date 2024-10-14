import { Route } from '@angular/router'
import { AuthGuard } from './shared/auth.guard'

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/layout/layout.module').then((m) => m.LayoutModule)
  },
  {
    path: 'authentication',
    loadChildren: () => import('app/modules/authentication/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: 'errors',
    loadChildren: () => import('app/modules/errors/errors.module').then((m) => m.ErrorsModule)
  },
  {
    path: '**',
    redirectTo: 'errors/error-404'
  }
]
