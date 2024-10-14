import { BaseService } from '@aratech/services/base.service'
import { HttpClient } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Constants } from 'app/shared/constants'
@Injectable({
  providedIn: 'root'
})
export class ResultDetailService extends BaseService<any> {
    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.ResultDetail.Resource, injector)
    }

    async mappingResultDetail(item: object): Promise<any> {
      let headers: Headers = new Headers()
      let url = `${this.svUrl}/MappingResultDetail`

      return this.httpPost(url, item, { headers: headers }).then(
        (response) => {
            return response
        },
        (err) => {
            throw err
        }
    )
  }
    
}
