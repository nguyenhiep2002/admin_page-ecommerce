import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { Constants } from 'app/shared/constants'

@Injectable({
  providedIn: 'root'
})
export class DeepcareSyncService extends BaseService<any> {
  constructor(http: HttpClient, injector: Injector) {
    super(http, Constants.ApiResources.Deepcare.Resource, injector)
  }

  syncTestListRetrieval(customerCode: string): Promise<any> {
    let headers = new HttpHeaders()
    let url = `${this.svUrl}/SyncTestListRetrieval`

    return this.httpPost(url, { customer: customerCode }, { headers: headers }).then(
      (response) => {
        return response
      },
      (err) => {
        throw err
      }
    )
  }
}
