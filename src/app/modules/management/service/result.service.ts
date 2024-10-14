import { BaseService } from '@aratech/services/base.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Constants } from 'app/shared/constants'
@Injectable({
  providedIn: 'root'
})
// service lưu trữ trạng thái (subscription)
export class ResultService extends BaseService<any> {
    constructor(http: HttpClient, injector: Injector) {
      super(http, Constants.ApiResources.Result.Resource, injector)
    }
}