import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from '@aratech/services/base.service';
import { Constants } from 'app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService extends BaseService<any>{

    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.ForgotPassword.Resource, injector);
    }
}
