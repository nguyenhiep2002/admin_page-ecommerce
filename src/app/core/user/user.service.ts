import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, ReplaySubject } from 'rxjs'
import { User } from 'app/core/user/user.types'
import { UserService as AraUserService } from 'app/shared/services/user.service'
import { NavigationService } from '../navigation/navigation.service'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1)

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _araUserService: AraUserService, private _navigationService: NavigationService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: any) {
        this._araUserService.setUserInfo(value)
        this._user.next(value)
    }

    get user(): any {
        const user = this._araUserService.getUserInfo().id
            ? this._araUserService.getUserInfo()
            : JSON.parse(localStorage.getItem('user_info'))

        return {
            id: user.id,
            name: user.name ?? user.userName,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    async getUser(): Promise<any> {
        const userInfo = await this._araUserService.getUserInfoAsync().then(user => user)
        this._user.next(userInfo)
        this._navigationService.set(this._araUserService.getMyMenus())
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return of({})
        // return this._httpClient.patch<User>('api/common/user', {user}).pipe(
        //     map((response) => {
        //         this._user.next(response);
        //     })
        // );
    }
}
