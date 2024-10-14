import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { BooleanInput } from '@angular/cdk/coercion'
import { Subject } from 'rxjs'
import { User } from 'app/core/user/user.types'
import { UserService } from 'app/core/user/user.service'
import { AuthenticationService } from '@aratech/services/AuthenticationService'
import { TranslatePipe } from '@ngx-translate/core'

@Component({
    selector: 'user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true
    user: User = {
        id: 'xxx',
        email: 'default@email.com',
        name: 'Default',
        avatar: 'assets/images/avatars/default-02.png'
    }

    private _unsubscribeAll: Subject<any> = new Subject<any>()

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private translate: TranslatePipe,
        private authServ: AuthenticationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        await this._userService.getUser()
        this.user = {
            id: this._userService.user.id,
            name: this._userService.user.name ?? this._userService.user.userName,
            email: this._userService.user.email,
            avatar: this._userService.user.avatar ?? 'assets/images/avatars/default-03.png'
        }
        this._changeDetectorRef.markForCheck()
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        this.authServ.logout()
        await this._router.navigate(['/authentication/login'])
    }
}
