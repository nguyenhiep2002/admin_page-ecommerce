import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { ICategoryConfigService } from '@aratech/services/ara-category.service'
import { Constants } from 'app/shared/constants'
import { TextFieldConfig } from '@aratech/models/textFieldConfig'
import { ControlType } from '@aratech/enums/controlType'
import { ComboboxFieldConfig } from '@aratech/models/comboboxFieldConfig'
import { TextAreaFieldConfig } from '@aratech/models/textareaFieldConfig'
import { CategoryConfig } from '@aratech/models/categoryConfig'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service'
import { StringUtils } from '@aratech/utils/stringUtils'
import { CategoryTypeService } from './categoryType.service'
import * as _ from 'underscore'
import { CheckBoxFieldConfig } from '@aratech/models/checkBoxFieldConfig'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { from, Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class DynamicCategoryService extends BaseService<any> implements ICategoryConfigService {
  private static cacheData: any = {}
  public typeCode: string
  public typeId: string
  extraProps: string[] = []

  constructor(http: HttpClient, injector: Injector, public categoryTypeService: CategoryTypeService) {
    super(http, Constants.ApiResources.Category.Resource, injector)
  }

  async getCatalogByTypeCode(typeCode: string) {
    try {
      typeCode = typeCode ? typeCode.toLowerCase() : ''
      let data = DynamicCategoryService.cacheData[typeCode]
      if (!data || _.values(data).length == 0) {
        var rs = await this.get({ typeCode: typeCode }, 1, 9999)
        DynamicCategoryService.cacheData[typeCode] = _.indexBy(rs.data, 'id')
      }
      return DynamicCategoryService.cacheData[typeCode]
    } catch {
      return {}
    }
  }

  async getNameById(id: string, typeCode: string) {
    var catalog = await this.getCatalogByTypeCode(typeCode)
    var category = catalog[id]
    return category ? category.name : undefined
  }

  async getUsingCache(params?: any, page?: number, limit?: number): Promise<any> {
    var data = await this.getCatalogByTypeCode(params.typeCode)
    return { data: _.values(data) }
  }

  get(params?: any, page?: number, limit?: number): Promise<any> {
    if (!params) params = { typeCode: this.typeCode }
    params.categoryTypeId = this.typeId
    return super.get(params, page, limit).then((rs) => {
      rs.data = rs.data.map((x) => {
        if (x.extraProperties) {
          let props = _.indexBy(x.extraProperties, 'key')
          for (const field of this.extraProps) {
            if (props[field]) x[field] = props[field].value
          }
        }
        return x
      })
      return rs
    })
  }

  async getAsync(params?: any, page?: number, limit?: number): Promise<any> {
    if (!params) params = { typeCode: this.typeCode }
    params.categoryTypeId = this.typeId
    return await super.getAsync(params, page, limit).then((rs) => {
      rs.data = rs.data.map((x) => {
        if (x.extraProperties) {
          let props = _.indexBy(x.extraProperties, 'key')
          for (const field of this.extraProps) {
            if (props[field]) x[field] = props[field].value
          }
        }
        return x
      })
      return rs
    })
  }

  post(item: any, id?: any): Promise<any> {
    DynamicCategoryService.cacheData = undefined
    if (this.typeId) item['categoryTypeId'] = this.typeId

    item.extraProperties = []
    for (const field of this.extraProps) {
      if (item[field]) {
        item.extraProperties.push({ key: field, value: item[field] })
      }
    }
    return super.post(item, id)
  }

  put(item: any, id?: any): Promise<any> {
    DynamicCategoryService.cacheData = undefined
    item.extraProperties = []
    for (const field of this.extraProps) {
      if (item[field]) {
        item.extraProperties.push({ key: field, value: item[field] })
      }
    }
    return super.put(item, id)
  }

  delete(id: string): Promise<any> {
    DynamicCategoryService.cacheData = undefined
    return super.delete(id)
  }

  async getCategoryConfig() {
    var me = this
    if (this.typeCode) {
      this.typeCode = this.typeCode.toLowerCase()
      var type = await this.categoryTypeService.getByCode(this.typeCode)
      this.typeId = type ? type.id : undefined
    }

    let code: TextFieldConfig = {
      title: `Category.${this.typeCode ? this.typeCode + '.' : ''}Code`,
      name: 'code',
      maxLength: 250,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: false
      // existsValidators: function(formComponent: AraFormComponent) {
      //     return DynamicCategoryService.codeExists(formComponent.service as DynamicCategoryService, me.typeCode, formComponent.oldItem.code);
      // }
    }

    let name: TextFieldConfig = {
      title: `Category.${this.typeCode ? this.typeCode + '.' : ''}Name`,
      name: 'name',
      maxLength: 500,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: false
    }

    let categoryType: ComboboxFieldConfig = {
      title: 'CategoryType.ShortTitle',
      name: 'categoryTypeId',
      type: ControlType.Combobox,
      valueField: 'id',
      displayField: 'name',
      objectField: 'categoryType',
      referenceService: CategoryTypeService,
      showInGrid: true,
      required: true
    }

    // let department: ComboboxFieldConfig = {
    //     title: 'Department.ShortTitle',
    //     name: 'departmentId',
    //     type: ControlType.Combobox,
    //     valueField: 'id',
    //     displayField: 'name',
    //     objectField: 'department',
    //     referenceService: DepartmentService,
    //     showInGrid: true,
    //     referenceServiceParams: {
    //         level: 1,
    //         owner: 1
    //     }
    // };

    let description: TextAreaFieldConfig = {
      type: ControlType.TextArea,
      name: 'description',
      rows: 3,
      title: 'Common.Description',
      required: false,
      maxLength: 2000,
      fitRowWidth: true,
      showInGrid: true
    }

    let isPublic: CheckBoxFieldConfig = {
      title: 'Common.IsPublicData',
      name: 'isPublic',
      valueType: typeof Number,
      type: ControlType.Checkbox,
      showInGrid: false,
      required: false
    }

    let categoryConfig: CategoryConfig = {
      type: 'Category',
      name: `Category.${this.typeCode ? this.typeCode + '.' : ''}ShortTitle`,
      title: `Category.${this.typeCode ? this.typeCode + '.' : ''}Title`,
      width: '450px',
      // addActionCode: `CATEGORY_${this.typeCode}_MANGER`.toUpperCase(),
      // editActionCode: `CATEGORY_${this.typeCode}_MANGER`.toUpperCase(),
      // deleteActionCode: `CATEGORY_${this.typeCode}_MANGER`.toUpperCase(),
      fields: this.typeCode ? [code, name, description] : [code, name, categoryType, description]
    }

    return Promise.resolve(categoryConfig)
  }

  public checkCodeExists(code: string, typeCode: string): Observable<boolean> {
    let headers: HttpHeaders = new HttpHeaders()
    let url = `${this.svUrl}/checkCodeExists`
    url += `?code=${code}&typeCode=${typeCode}`

    var promise = this.httpGet(url, { headers: headers }).then(
      (response) => {
        return response
      },
      (err) => {
        throw err
      }
    )
    return from(promise)
  }

  // static codeExists(service: DynamicCategoryService, typeCode: string, oldValue: string): AsyncValidatorFn {
  //     return (control: AbstractControl) => {
  //         if (!control.value || (oldValue && StringUtils.compareIgnoreCase(control.value, oldValue)))
  //             return from(Promise.resolve()).pipe(map(
  //                 function (): ValidationResult {
  //                     return null;
  //                 }
  //             ));

  //         return service.checkCodeExists(control.value, typeCode).pipe(map(
  //             function (exists): ValidationResult {
  //                 if (exists)
  //                     return { "exists": exists }
  //                 else
  //                     return null;
  //             }
  //         ))
  //     }
  // }
}

@Injectable()
export class DynamicCategoryServiceResolve implements Resolve<any> {
  constructor(
    private service: DynamicCategoryService,
    private categoryTypeService: CategoryTypeService,
    private navService: FuseNavigationService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.url.length > 1) {
      this.service.typeCode = route.url[route.url.length - 1].path
      var categoryType = await this.categoryTypeService.getByCode(this.service.typeCode)
      this.service.typeId = categoryType ? categoryType.id : undefined
    } else {
      this.service.typeCode = undefined
      this.service.typeId = undefined
    }

    var config = await this.service.getCategoryConfig()
    if (!config.icon) {
      this.navService.onNavigationChanged?.subscribe(() => {
        let flatNavs = this.navService.getFlatNavigation(this.navService.getCurrentNavigation())
        let navItems = flatNavs.filter((x) => StringUtils.trim(x.link, '/') == StringUtils.trim(state.url, '/'))
        config.icon = navItems.length == 0 ? 'apps' : navItems[0].icon
      })
    }

    return {
      service: this.service,
      configs: config
    }
  }
}
