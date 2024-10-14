import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Constants } from 'app/shared/constants';
import { BaseService } from '@aratech/services/base.service';

@Injectable()
export class BranchUserService extends BaseService<any> {
    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.Branch.Resource, injector);
    }

    get(params?: any, page?: number, limit?: number): Promise<any> {        
        let headers: Headers = new Headers();
        let url = `${this.svUrl}/getAllUsers`;
        let xLimit = limit ? limit : 20;
        let skip = ((page ? page : 1) - 1) * xLimit;
        url += '?skip=' + skip + '&top=' + xLimit;

        if (params && Object.keys(params).length > 0) {
            for (const key of Object.keys(params)) {
                if (params[key] != null && params[key] != undefined)
                    url += '&' + key + '=' + encodeURIComponent(params[key]);
            }
        }

        return this.httpGet(url, { headers: headers })
            .then(response => {
                return response.json();
            },
            err => { throw err });
    }

    getDetail(id: string): Promise<any> {
        let headers = new Headers();
        let url = `${this.svUrl.replace(Constants.ApiResources.Branch.Resource, Constants.ApiResources.User.Resource)}/${id}`;

        return this.httpGet(url, { headers: headers })
            .then(response => {
                return response.json();
            },
            err => { throw err });
    }

    getUsers(branchId: string): Promise<any> {        
        let headers: Headers = new Headers();
        let url = `${this.svUrl}/${branchId}/getUsers?top=-1`;

        return this.httpGet(url, { headers: headers })
            .then(response => {
                return response.json();
            },
            err => { throw err });
    }

    saveUsers(branchId: string, userIds: string[]): Promise<any> {
        let headers = new Headers();
        let url = `${this.svUrl}/${branchId}/saveUsers`;

        return this.httpPost(url, userIds, { headers: headers })
            .then(response => {
                return response.json();
            },
            err => { throw err });
            
    }
}