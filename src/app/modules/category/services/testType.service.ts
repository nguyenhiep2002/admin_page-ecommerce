import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { ICategoryConfigService } from '@aratech/services/ara-category.service'
import { Http } from '@angular/http'
import { Constants } from 'app/shared/constants'
import { CategoryConfig, CategoryGridAction } from '@aratech/models/categoryConfig'
import { ControlType } from '@aratech/enums/controlType'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service'
import { delay, from, Observable } from 'rxjs'
import { StringUtils } from '@aratech/utils/stringUtils'
import { GridActionType } from '@aratech/enums/gridActionType'

@Injectable()
export class TestTypeService extends BaseService<any> implements ICategoryConfigService {
    static allTestTypes: any[] = undefined

    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.TestType.Resource, injector)
    }

    getAll(): Promise<any[]> {
        if (TestTypeService.allTestTypes) return Promise.resolve(TestTypeService.allTestTypes)
        else
            return this.get({}, 1, 999).then((rs) => {
                return rs.data
            })
    }

    public checkCodeExists(code: string, customerId: string): Observable<boolean> {
        const params = {
            code: `(${code})`,
            customerId: customerId
        }
        const promise = this.get(params)
            .then(
                response => {
                    return response.count && response.count > 0
                },
                err => {
                    throw err
                }
            )
        return from(promise)
    }

    getCategoryConfig(): Promise<CategoryConfig> {
        let updateservice: CategoryGridAction = {
            type: GridActionType.OpenDialog,
            icon: 'settings',
            title: 'DeviceTestCode.MappingStandardTest',
            dialogWidth: '800px',
            refreshAfterSuccess: true
        }

        return Promise.resolve({
            type: 'TestType',
            name: 'TestType.ShortTitle',
            title: 'TestType.Title',
            gridActions: [updateservice],
            fields: [
                {
                    type: ControlType.Text,
                    name: 'name',
                    tabIndex: 1,
                    title: 'TestType.Name',
                    required: true,
                    maxLength: 100,
                    showInGrid: true
                },
                {
                    type: ControlType.Number,
                    name: 'position',
                    tabIndex: 2,
                    title: 'TestType.Position',
                    required: false,
                    showInGrid: true,
                    width: '100px'
                },
                {
                    type: ControlType.Checkbox,
                    name: 'hasDetailTest',
                    tabIndex: 3,
                    title: 'TestType.HasDetailTest',
                    valueType: typeof Number,
                    showInGrid: true,
                    width: '150px'
                },
                {
                    type: ControlType.TextArea,
                    name: 'description',
                    tabIndex: 4,
                    rows: 3,
                    title: 'Common.Description',
                    required: false,
                    maxLength: 500,
                    showInGrid: true
                }
            ]
        })
    }
}

@Injectable()
export class TestTypeServiceResolve implements Resolve<any> {
    constructor(private service: TestTypeService, private navService: FuseNavigationService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this.service.getCategoryConfig().then((rs) => {
            if (!rs.icon) {
                this.navService.onNavigationChanged?.subscribe((x) => {
                    let flatNavs = this.navService.getFlatNavigation(this.navService.getCurrentNavigation())
                    let navItems = flatNavs.filter((x) => StringUtils.trim(x.link, '/') == StringUtils.trim(state.url, '/'))
                    rs.icon = navItems.length == 0 ? 'apps' : navItems[0].icon
                })
            }

            return {
                service: this.service,
                configs: rs
            }
        })
    }
}
