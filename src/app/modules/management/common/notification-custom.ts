import { Component, Inject, Injectable, inject } from '@angular/core'
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar'
import { fuseAnimations } from '@fuse/animations'
import { TranslatePipe } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class NotificationCustom {
  constructor(public snackBar: MatSnackBar, public translate: TranslatePipe) {}

  success(message: string, any?: any) {
    this.snackBar.openFromComponent(NotificationSuccess, {
      verticalPosition: 'top',
      duration: 2000,
      data: this.translate.transform(message)
    })
    any
  }

  info(message: string, any?: any) {
    this.snackBar.openFromComponent(NotificationInfo, {
      verticalPosition: 'top',
      duration: 2000,
      data: this.translate.transform(message)
    })
    any
  }

  warning(message: string, any?: any) {
    this.snackBar.openFromComponent(NotificationWarning, {
      verticalPosition: 'top',
      duration: 2000,
      data: this.translate.transform(message)
    })
    any
  }

  error(message: string, any?: any) {
    this.snackBar.openFromComponent(NotificationError, {
      verticalPosition: 'top',
      duration: 2000,
      data: this.translate.transform(message)
    })
    any
  }
}

@Component({
  templateUrl: 'snack-bar/notification-succsess.html',
  animations: fuseAnimations
})
export class NotificationSuccess {
  message: string
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data
  }
  snackBarRef = inject(MatSnackBarRef)
}

@Component({
  templateUrl: 'snack-bar/notification-warning.html',
  animations: fuseAnimations
})
export class NotificationWarning {
  message: string
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data
  }
  snackBarRef = inject(MatSnackBarRef)
}

@Component({
  templateUrl: 'snack-bar/notification-error.html',
  animations: fuseAnimations
})
export class NotificationError {
  message: string
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data
  }
  snackBarRef = inject(MatSnackBarRef)
}

@Component({
  templateUrl: 'snack-bar/notification-info.html',
  animations: fuseAnimations
})
export class NotificationInfo {
  message: string
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data
  }
  snackBarRef = inject(MatSnackBarRef)
}
