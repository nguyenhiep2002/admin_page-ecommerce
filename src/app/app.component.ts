import { Component } from '@angular/core';
import { Configs } from '@aratech/utils/configs';
import { Constants } from './shared/constants';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor()
    {
        Configs.setConfig('Router_Login', Constants.Router_Login);
        Configs.setConfig('LoginUrl', Constants.LoginUrl);

    }
}
