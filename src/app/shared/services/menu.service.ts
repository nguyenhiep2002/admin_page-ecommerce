import { Injectable, Injector } from "@angular/core";
import { Constants } from "../constants";
import { BaseService } from '@aratech/services/base.service';
import { ConfigProvider } from '../config.provider';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class MenuService extends BaseService<any> {
    static allMenus: any[] = [];
    constructor(http: HttpClient, injector: Injector, private configProvider: ConfigProvider) {
        super(http, Constants.ApiResources.Menu.Resource, injector);
    }

    async getMyMenu() {
        let headers = new HttpHeaders();
        let appCode = this.configProvider.getConfig('AppCode');
        let url = `${this.svUrl}/${Constants.ApiResources.Menu.GetMyMenuUrl}?appCode=${appCode}`;

        return this.httpGet(url, { headers: headers })
            .then(response => {
                let myMenu = response.json().data;
                return this.convertTreeData(myMenu, '0');
            });

        // return Promise.resolve([{
        //     'id'      : 'applications',
        //     'translate': 'NAV.APPLICATIONS',
        //     'type'    : 'group',
        //     'children': [{
        //         'id'   : 'intro',
        //         'translate': 'User.Title',
        //         'type' : 'item',
        //         'url'  : '/test'
        //     }
        // ]
        // }]);
    }

    private convertTreeData(data: any[], parentId: string) {
        let results: any[] = [];

        if (data.length == 0)
            return results;

        let childs = data.filter(r => {
            return r.parentId === parentId || (parentId === '0' && !r.parentId);
        });

        let grandChilds = data.filter(r => {
            return !(r.parentId === parentId || (parentId === '0' && !r.parentId));
        });

        if (childs.length > 0) {
            childs.forEach(child => {                
                child.children = this.convertTreeData(grandChilds, child.id);
                child.translate = child.name;
                child.type = parentId == '0' ? 'group' : child.children.length > 0 ? 'collapse': 'item';
                results.push(child);
            });
        }

        return results;
    }
}