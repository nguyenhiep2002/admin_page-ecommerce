import { Component, ViewEncapsulation } from '@angular/core';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import {Location} from '@angular/common';

@Component({
    selector     : 'error-404',
    templateUrl  : './error-404.component.html',
    styleUrls    : ['./error-404.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error404Component
{
    /**
     * Constructor
     */
    constructor(public _splashScreenService: FuseSplashScreenService, private _location: Location)
    {
        setTimeout(() => {
            this._splashScreenService.hide();
        })
    }

    back() {
        this._location.back();
    }
}
