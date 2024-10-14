import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class UserInfoService {
    isAdmin: boolean = false

    constructor() {
    }

    setAdmin(isAdmin: boolean) {
        this.isAdmin = isAdmin
    }

    getAdmin() {
        return this.isAdmin
    }
}
