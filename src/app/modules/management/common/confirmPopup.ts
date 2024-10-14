import { Injectable } from '@angular/core'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { TranslatePipe } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class Confirm {
  constructor(private _fuseConfirmationService: FuseConfirmationService
  ,private translate: TranslatePipe,) {}

  danger({ title, message, ...props }, handler: () => Promise<void>): void {
    this._fuseConfirmationService
      .open({
        title: title,
        message: message,
        actions: {
          confirm: {
            label: this.translate.transform("Common.Confirm")
          },
          cancel: {
            label: this.translate.transform("Common.Close")
          }
        },
        ...props
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirmed') {
          handler()
        }
      })
  }

  warn({ title, message, ...props }, handler: () => Promise<void>) {
    this._fuseConfirmationService
      .open({
        title: title,
        message: message,
        icon: {
          show: true,
          name: 'mat_outline:cancel',
          color: 'warning'
        },
        actions: {
          confirm: {
            label: this.translate.transform("Common.Confirm"),
            color: 'primary'
          },
          cancel: {
            label: this.translate.transform("Common.Close")
          }
        },
        ...props
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirmed') {
          handler()
        }
      })
  }

  success({ title, message, ...props }, handler: () => Promise<void>) {
    this._fuseConfirmationService
      .open({
        title: title,
        message: message,
        icon: {
          show: true,
          name: 'heroicons_outline:badge-check',
          color: 'success'
        },
        actions: {
          confirm: {
            label: this.translate.transform("Common.Confirm"),
            color: 'primary'
          },
          cancel: {
            label: this.translate.transform("Common.Close")
          }
        },
        ...props
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirmed') {
          handler()
        }
      })
  }
}
