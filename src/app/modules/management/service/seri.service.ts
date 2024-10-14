import { Injectable, Injector } from '@angular/core'
import { BaseService } from '../../../../@aratech/services/base.service'
import { HttpClient } from '@angular/common/http'
import { Constants } from '../../../shared/constants'

@Injectable({
    providedIn: 'root'
})
export class SeriService extends BaseService<any> {

    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.Seri.Resource, injector)
    }

}
