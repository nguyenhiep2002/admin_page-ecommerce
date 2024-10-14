import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from '@aratech/services/base.service';
import { ICategoryConfigService } from '@aratech/services/ara-category.service';
import { Http } from '@angular/http';
import { Constants } from 'app/shared/constants';
import { CategoryConfig, CategoryGridAction } from '@aratech/models/categoryConfig';
import { ControlType } from '@aratech/enums/controlType';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Observable } from 'rxjs';
import { StringUtils } from '@aratech/utils/stringUtils';
import { TextAreaFieldConfig } from '@aratech/models/textareaFieldConfig';
import { TextFieldConfig } from '@aratech/models/textFieldConfig';
import { GridActionType } from '@aratech/enums/gridActionType';
import { BranchUserComponent } from '../branch-user/branch-user.component';

@Injectable()
export class BranchService extends BaseService<any>  implements ICategoryConfigService {
    static allTestTypes: any[] = undefined;

    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.Branch.Resource, injector);
    }

    getCategoryConfig() {
        let code: TextFieldConfig = {
            title: 'Branch.Code',
            name: 'code',
            maxLength: 100,
            type: ControlType.Text,
            showInGrid: true,
            required: true,
            fitRowWidth: false,
            width: '200px',
        };
        let name: TextFieldConfig = {
            title: 'Branch.Name',
            name: 'name',
            maxLength: 250,
            type: ControlType.Text,
            showInGrid: true,
            required: true,
            fitRowWidth: false
        };
        let description: TextAreaFieldConfig = {
            type: ControlType.TextArea,
            name: 'description',
            rows: 3,
            title: 'Common.Description',
            required: false,
            maxLength: 500,
            fitRowWidth: true,
            showInGrid: false
        };
        var action: CategoryGridAction = {
            type: GridActionType.OpenDialog,
            icon: 'group',
            component: BranchUserComponent,
            title: 'Cấu hình người dùng theo chi nhánh',
            dialogWidth: '600px',
        }

        let categoryConfig: CategoryConfig = {
            type: 'Branch',
            name: 'Branch.ShortTitle',
            title: 'Branch.Title',
            width: '450px',
            gridActions: [action],
            pageSize: 50,
            fields: [code, name, description]
        };

        return Promise.resolve(categoryConfig);
    }
}

@Injectable()
export class BranchServiceResolve implements Resolve<any> {
    constructor(private service: BranchService, private navService: FuseNavigationService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        return this.service.getCategoryConfig()
        .then(rs => {
            if (!rs.icon) {
                this.navService.onNavigationChanged.subscribe(x => {
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