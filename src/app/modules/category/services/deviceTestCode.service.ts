import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { ICategoryConfigService } from '@aratech/services/ara-category.service'
import { Headers } from '@angular/http'
import { Constants } from 'app/shared/constants'
import { TextFieldConfig } from '@aratech/models/textFieldConfig'
import { ControlType } from '@aratech/enums/controlType'
import { CheckBoxFieldConfig } from '@aratech/models/checkBoxFieldConfig'
import { TextAreaFieldConfig } from '@aratech/models/textareaFieldConfig'
import { BaseFieldConfig } from '@aratech/models/baseFieldConfig'
import {
    QuickSearchConfig,
    AraQuickSearchComponent
} from '@aratech/components/ara-quick-search/ara-quick-search.component'
import { StandardTestService } from './standardTest.service'
import { CategoryGridAction, CategoryConfig } from '@aratech/models/categoryConfig'
import { GridActionType } from '@aratech/enums/gridActionType'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { DeviceService } from './device.service'
import { Observable, from } from 'rxjs'
import { ComboboxFieldConfig } from '@aratech/models/comboboxFieldConfig'
import { AddRuleComponent } from '../add-rule/add-rule.component'
import { ProcesscodeService } from './processcode.service'

@Injectable()
export class DeviceTestCodeService extends BaseService<any> implements ICategoryConfigService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.DeviceTestCode.Resource, injector)
    }

    async exportConfig(deviceId: string) {
        const url = `${this.svUrl}/Export/${deviceId}`
        const headers = new HttpHeaders()
        return await this.httpGet(url, { responseType: 'blob', observe: 'response', headers: headers })
            .then(
                (response) => response,
                (err) => err.error
            )
    }

    async importConfig(deviceId: string, file: any) {
        const url = `${this.svUrl}/Import/${deviceId}`
        const body: FormData = new FormData()
        body.append('file', file)
        return await this.httpPost(url, body)
            .then(
                (response) => response,
                (err) => err.error
            )
    }

    async getSID(deviceIds: string, listDevice: any[]) {
        const params = {
            deviceId: `(${deviceIds})`
        }
        return await this.get(params, 1, 999)
            .then(response => {
                if (!response || response.count === 0) return []

                return response.data.map(x => ({
                    ...x,
                    deviceName: listDevice.find(z => z.id == x.deviceId)?.name
                }))
            })
            .catch(error => console.log(error))
    }

    // async getAsync(params?: any, page?: number, limit?: number): Promise<any> {
    //   return await this.get(params, page, limit)
    // }

    // get(params?: any, page?: number, limit?: number): Promise<any> {
    //   let headers: Headers = new Headers()
    //   let url = this.svUrl
    //   let xLimit = limit ? limit : 20
    //   let skip = ((page ? page : 1) - 1) * xLimit
    //   url += '?skip=' + skip + '&top=' + xLimit

    //   if (params && Object.keys(params).length > 0) {
    //     for (const key of Object.keys(params)) {
    //       url += '&' + key + '=' + encodeURIComponent(params[key])
    //     }
    //   }

    //   return this.httpGet(url, { headers: headers }).then(
    //     (response) => {
    //       return response.data.map((x) => {
    //         x.standardTestName = x.standardTest ? x.standardTest.name : 'Chưa ánh xạ mã: ' + x.code
    //         return x
    //       })
    //     },
    //     (err) => {
    //       throw err
    //     }
    //   )
    // }
    public checkCodeExists(valueCode: string, deviceId: string, filename: string, urlCheckCode: string): Observable<boolean> {
        let headers: HttpHeaders = new HttpHeaders()
        let url = `${this.svUrl}/${urlCheckCode}`
        url += `?${filename}=${valueCode}`
        url += `&deviceId=${deviceId}`

        var promise = this.httpGet(url, { headers: headers })
            .then(response => {
                    return response
                },
                err => {
                    throw err
                })
        return from(promise)
    }

    linkStandardTest(standardTest: any, item: any) {
        let updateItem = Object.assign({}, item)
        updateItem.standardTest = undefined
        updateItem.standardTestId = standardTest.id
        return this.put(updateItem, updateItem.id)
    }

    unlinkStandardTest(item: any) {
        let updateItem = Object.assign({}, item)
        updateItem.standardTest = undefined
        updateItem.standardTestId = undefined
        return this.put(updateItem, updateItem.id)
    }

    getCategoryConfig() {
        let code: TextFieldConfig = {
            title: 'DeviceTestCode.Code',
            name: 'code',
            maxLength: 250,
            type: ControlType.Text,
            showInGrid: true,
            required: true
        }

        // let processCode : TextFieldConfig = {
        //     title: 'DeviceTestCode.ProcessCode',
        //     name: 'processCode',
        //     maxLength: 250,
        //     type: ControlType.Text,
        //     showInGrid: true,
        //     required: true,
        // };
        let processCode: ComboboxFieldConfig = {
            title: 'DeviceTestCode.ProcessCode',
            name: 'processCode',
            type: ControlType.Autocomplete,
            valueField: 'code',
            displayField: 'code',
            objectField: 'processCode',
            referenceService: ProcesscodeService,
            showInGrid: true,
            required: false,
            getReferenceServiceParams: (item) => {
                return {
                    deviceType: item.type
                }
            }
        }

        let isBidirection: CheckBoxFieldConfig = {
            title: 'DeviceTestCode.IsBidirection',
            name: 'isBidirection',
            type: ControlType.Checkbox,
            valueType: typeof Number,
            showInGrid: true,
            defaultValue: 0
        }
        // let deviceTestCodeRule: ComboboxFieldConfig = {
        //     title: 'DeviceTestCode.Rule',
        //     name: 'deviceTestCodeRule',
        //     type: ControlType.Combobox,
        //     valueField: 'id',
        //     displayField: 'name',
        //     comboData: [
        //         { id: '1-2s', name: '1-2s' },
        //         { id: '1-3s', name: '1-3s' },
        //         { id: '2-2s', name: '2-2s' },
        //         { id: '4-1s', name: '4-1s' },
        //         { id: '10x', name: '10x' },
        //         { id: 'R-4s', name: 'R-4s' },
        //         { id: '2of3-2s', name: '2of3-2s' },
        //         { id: '3-1s', name: '3-1s' },
        //         { id: '12x', name: '12x' },
        //         { id: '9x', name: '9x' },
        //         { id: '8x', name: '8x' },
        //         { id: '6x', name: '6x' },
        //         { id: 'Shift', name: 'Shift' },
        //         { id: 'Trend', name: 'Trend' },
        //     ],
        //     multiple: true,
        //     showInGrid: true,
        //     required: false
        // };

        let description: TextAreaFieldConfig = {
            type: ControlType.TextArea,
            name: 'description',
            rows: 3,
            title: 'Common.Description',
            required: false,
            maxLength: 500,
            showInGrid: false
        }

        let deviceName: BaseFieldConfig = {
            type: ControlType.RefInfo,
            name: 'standardTestName',
            title: 'StandardTest.ShortTitle',
            required: false,
            showInGrid: true
        }
        let me = this
        let quickSearchConfig: QuickSearchConfig = {
            service: StandardTestService,
            getSubTitle: function(deviceTestCode: any): string {
                return deviceTestCode && deviceTestCode.code ? deviceTestCode.code : undefined
            },
            resolve: function(item: any, forwardParams: any): Promise<any> {
                return me.linkStandardTest(item, forwardParams)
            }
        }

        let addRule: CategoryGridAction = {
            type: GridActionType.OpenDialog,
            icon: 'bar_chart',
            component: AddRuleComponent,
            title: 'Luật check mặc định',
            dialogWidth: '700px',
            refreshAfterSuccess: true
        }

        let linkAction: CategoryGridAction = {
            type: GridActionType.OpenDialog,
            icon: 'link',
            component: AraQuickSearchComponent,
            dynamicConfig: quickSearchConfig,
            title: 'DeviceTestCode.MappingStandardTest',
            dialogWidth: '800px',
            refreshAfterSuccess: true
        }

        let unlinkAction: CategoryGridAction = {
            type: GridActionType.Function,
            resolve: function(rowItem) {
                return me.unlinkStandardTest(rowItem)
            },
            disabled: function(rowItem) {
                return !rowItem.standardTestId
            },
            icon: 'link_off',
            title: 'DeviceTestCode.UnMappingStandardTest',
            refreshAfterSuccess: true
        }

        let categoryConfig: CategoryConfig = {
            type: 'DeviceTestCode',
            icon: 'apps',
            name: 'DeviceTestCode.ShortTitle',
            title: 'DeviceTestCode.Title',
            width: '400px',
            noPaging: true,
            gridActions: [addRule, linkAction, unlinkAction],
            fields: [code, processCode, isBidirection, description, deviceName]
        }

        return Promise.resolve(categoryConfig)
    }
}

@Injectable()
export class DeviceTestCodeServiceResolve implements Resolve<any> {
    constructor(private service: DeviceTestCodeService, private deviceService: DeviceService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return Promise.all([this.deviceService.getDetail(route.params.id), this.service.getCategoryConfig()]).then(
            (values) => {
                values[1].subTitle = values[0].name
                return {
                    service: this.service,
                    configs: values[1],
                    params: { deviceId: route.params.id, type: values[0].type }
                }
            }
        )
    }
}
