
import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { BaseService } from '@aratech/services/base.service';
import { Constants } from "app/shared/constants";

@Injectable()
export class SignUpService extends BaseService<any> {
    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.SignUp.Resource, injector);
    }
    register(item: any): Promise<any> {
        let url = `${this.svUrl}/${Constants.ApiResources.SignUp.Register}`;
       // let waitingId = this.waitingService.startWaiting()
        // return this.httpPost(url, item
        // )
        //     .then(response => {
        //         return response;
        //     });
        let response = this.http.post(url, item, {}).toPromise();
       // this.waitingService.stopWaiting(waitingId);
        return response;
    }
}

