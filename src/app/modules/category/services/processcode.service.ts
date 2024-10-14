import { HttpClient } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Http } from '@angular/http'
import { BaseService } from '@aratech/services/base.service'
import { Constants } from 'app/shared/constants'

@Injectable({
  providedIn: 'root'
})
export class ProcesscodeService extends BaseService<any> {
  constructor(http: HttpClient, injector: Injector) {
    super(http, Constants.ApiResources.ProcessCode.Resource, injector)
  }
}
