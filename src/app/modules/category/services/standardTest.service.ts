import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { ICategoryConfigService } from '@aratech/services/ara-category.service'
import { Constants } from 'app/shared/constants'
import { TextFieldConfig } from '@aratech/models/textFieldConfig'
import { ControlType } from '@aratech/enums/controlType'
import { ComboboxFieldConfig } from '@aratech/models/comboboxFieldConfig'
import { CheckBoxFieldConfig } from '@aratech/models/checkBoxFieldConfig'
import { NumberFieldConfig } from '@aratech/models/numberFieldConfig'
import { TextAreaFieldConfig } from '@aratech/models/textareaFieldConfig'
import { CategoryConfig } from '@aratech/models/categoryConfig'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service'
import { Observable, from, map } from 'rxjs'
import { StringUtils } from '@aratech/utils/stringUtils'
import { TestTypeService } from './testType.service'
import { AbstractControl, AsyncValidatorFn } from '@angular/forms'
import { ValidationResult } from '@aratech/models/validationResult'

@Injectable()
export class StandardTestService extends BaseService<any> implements ICategoryConfigService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, Constants.ApiResources.StandardTest.Resource, injector)
  }
  UpdatePosition(models: any[]): Promise<any> {
    let url = `${this.svUrl}/${Constants.ApiResources.StandardTest.UpdatePosition}`
    return this.httpPut(url, models).then((response) => {
      return response
    })
  }

  getByStudyId(TestTypeId: string): Promise<any> {
    let headers: Headers = new Headers()
    let url = `${this.svUrl}/${Constants.ApiResources.StandardTest.GetByTestTypeId}?TestTypeId=${encodeURIComponent(
      TestTypeId
    )}`

    return this.httpGet(url, { headers: headers }).then(
      (response) => {
        return response.json()
      },
      (err) => {
        throw err
      }
    )
  }
  
  public checkCodeExists(code: string,customerId: string): Observable<boolean> {
    let headers: HttpHeaders = new HttpHeaders();
    let url = `${this.svUrl}/checkCodeExists`;
    url += `?code=${code}`;
    url += `&customerId=${customerId}`;

    var promise = this.httpGet(url, { headers: headers })
        .then(response => {
            return response;
        },
            err => {
                throw err;
            });
    return from(promise);
  }
  
  // static codeExists(service: StandardTestService, oldValue: string): AsyncValidatorFn {
  //   return (control: AbstractControl) => {
  //       if (!control.value || (oldValue && StringUtils.compareIgnoreCase(control.value, oldValue)))
  //           return from(Promise.resolve()).pipe(map(
  //               function (): ValidationResult {
  //                   return null;
  //               }
  //           ));

  //       return service.checkCodeExists(control.value,customerId).pipe(map(
  //           function (exists): ValidationResult {
  //               if (exists)
  //                   return { "exists": exists }
  //               else
  //                   return null;
  //           }
  //       ))
  //   }
// }

  getCategoryConfig() {
    let name: TextFieldConfig = {
      title: 'StandardTest.Name',
      name: 'name',
      maxLength: 250,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: true,
      flex: 1
    }

    let testTypeId: ComboboxFieldConfig = {
      title: 'TestType.ShortTitle',
      name: 'testTypeId',
      type: ControlType.Combobox,
      valueField: 'id',
      displayField: 'name',
      objectField: 'testType',
      referenceService: TestTypeService,
      showInGrid: true,
      required: true
    }

    let code: TextFieldConfig = {
      title: 'StandardTest.Code',
      name: 'code',
      maxLength: 20,
      type: ControlType.Text,
      showInGrid: true
    }

    let unit: TextFieldConfig = {
      title: 'StandardTest.Unit',
      name: 'unit',
      maxLength: 20,
      type: ControlType.Text,
      showInGrid: true,
      fitRowWidth: true
    }

    let normalRangeMale: TextFieldConfig = {
      title: 'StandardTest.NormalRangeMale',
      name: 'normalRangeMale',
      maxLength: 20,
      type: ControlType.Text,
      showInGrid: false
    }

    let normalRangeFemale: TextFieldConfig = {
      title: 'StandardTest.NormalRangeFemale',
      name: 'normalRangeFemale',
      maxLength: 20,
      type: ControlType.Text,
      showInGrid: false
    }

    let allowRegister: CheckBoxFieldConfig = {
      title: 'StandardTest.AllowRegister',
      name: 'allowRegister',
      type: ControlType.Checkbox,
      showInGrid: false,
      defaultValue: 1,
      valueType: typeof Number
    }

    let allowSendToAnalyzer: CheckBoxFieldConfig = {
      title: 'StandardTest.AllowSendToAnalyzer',
      name: 'allowSendToAnalyzer',
      type: ControlType.Checkbox,
      showInGrid: false,
      defaultValue: 1,
      valueType: typeof Number
    }

    let allowView: CheckBoxFieldConfig = {
      title: 'StandardTest.AllowView',
      name: 'allowView',
      type: ControlType.Checkbox,
      showInGrid: false,
      defaultValue: 1,
      valueType: typeof Number
    }

    let allowPrint: CheckBoxFieldConfig = {
      title: 'StandardTest.AllowPrint',
      name: 'allowPrint',
      type: ControlType.Checkbox,
      showInGrid: false,
      defaultValue: 1,
      valueType: typeof Number
    }

    let position: NumberFieldConfig = {
      title: 'StandardTest.Position',
      name: 'position',
      type: ControlType.Number,
      showInGrid: true
    }

    let dataPoint: NumberFieldConfig = {
      title: 'StandardTest.DataPoint',
      name: 'dataPoint',
      type: ControlType.Number,
      min: 0,
      defaultValue: 2,
      showInGrid: false
    }

    let description: TextAreaFieldConfig = {
      type: ControlType.TextArea,
      name: 'description',
      rows: 3,
      title: 'Common.Description',
      required: false,
      maxLength: 500,
      fitRowWidth: true,
      showInGrid: false
    }

    let categoryConfig: CategoryConfig = {
      type: 'StandardTest',
      name: 'StandardTest.ShortTitle',
      title: 'StandardTest.Title',
      //expandFields: 'testType',
      columns: 2,
      pageSize: 100,
      width: '650px',
      fields: [
        name,
        testTypeId,
        code,
        unit,
        allowRegister,
        allowSendToAnalyzer,
        allowView,
        allowPrint,
        position,
        dataPoint,
        normalRangeMale,
        normalRangeFemale,
        description
      ]
    }

    return Promise.resolve(categoryConfig)
  }
}

@Injectable()
export class StandardTestServiceResolve implements Resolve<any> {
  constructor(private service: StandardTestService, private navService: FuseNavigationService) {}

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
