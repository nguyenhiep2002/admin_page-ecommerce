import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from '@aratech/services/base.service';
import { ICategoryConfigService } from '@aratech/services/ara-category.service';
import { Constants } from 'app/shared/constants';
import { TextFieldConfig } from '@aratech/models/textFieldConfig';
import { ControlType } from '@aratech/enums/controlType';
import { TextAreaFieldConfig } from '@aratech/models/textareaFieldConfig';
import { CategoryConfig } from '@aratech/models/categoryConfig';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Observable } from 'rxjs';
import { StringUtils } from '@aratech/utils/stringUtils';

@Injectable()
export class ManufactoryService extends BaseService<any>  implements ICategoryConfigService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.Manufactory.Resource, injector);
    }

    getCategoryConfig() {
        let name : TextFieldConfig = {
            title: 'Manufactory.Name',
            name: 'name',
            maxLength: 250,
            type: ControlType.Text,
            showInGrid: true,
            required: true,
            fitRowWidth: true
        };

        let description : TextAreaFieldConfig = {
            type: ControlType.TextArea,
            name: 'description',
            rows: 3,
            title: 'Common.Description',
            required: false,
            maxLength: 500,
            fitRowWidth: true,  
            showInGrid: true
        };

        let categoryConfig: CategoryConfig = {
            type: 'Manufactory',
            name: 'Manufactory.ShortTitle',
            title: 'Manufactory.Title',
            width: '400px',
            fields: [name, description]
        };
        
        return Promise.resolve(categoryConfig);
    }
}

@Injectable()
export class ManufactoryServiceResolve implements Resolve<any> {
    constructor(private service: ManufactoryService, private navService: FuseNavigationService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        return this.service.getCategoryConfig()
        .then(rs => {
            if (!rs.icon) {
                this.navService.onNavigationChanged?.subscribe(x => {
                    let flatNavs = this.navService.getFlatNavigation(this.navService.getCurrentNavigation());
                    let navItems = flatNavs.filter(x => StringUtils.trim(x.link, '/') == StringUtils.trim(state.url, '/'));
                    rs.icon = navItems.length == 0 ? 'apps' : navItems[0].icon;
                });
            }
            
            return {
                service: this.service,
                configs: rs
            }
        });
    }
}