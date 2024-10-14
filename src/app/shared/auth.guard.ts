import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '@aratech/services/AuthenticationService';
import { Constants } from './constants';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenService: AuthenticationService
    ) { }

    async canActivate() {
        try {
            const x = await this.authenService.isLoggedIn();
            if (!x) {
                this.router.navigate([
                    Constants.Router_Login
                ]);
                return false;
            }
            return true;
        }
        catch (e) {
            this.router.navigate([
                Constants.Router_Login
            ]);
            return false;
        }
    }
}
