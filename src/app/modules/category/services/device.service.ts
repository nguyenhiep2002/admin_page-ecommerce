import { HttpClient } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { ICategoryConfigService } from '@aratech/services/ara-category.service'
import { Constants } from 'app/shared/constants'
import { TextFieldConfig } from '@aratech/models/textFieldConfig'
import { ControlType } from '@aratech/enums/controlType'
import { ComboboxFieldConfig } from '@aratech/models/comboboxFieldConfig'
import { ManufactoryService } from './manufactory.service'
import { TestTypeService } from './testType.service'
import { CheckBoxFieldConfig } from '@aratech/models/checkBoxFieldConfig'
import { TextAreaFieldConfig } from '@aratech/models/textareaFieldConfig'
import { CategoryGridAction, CategoryConfig } from '@aratech/models/categoryConfig'
import { GridActionType } from '@aratech/enums/gridActionType'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service'
import { Observable } from 'rxjs'
import { StringUtils } from '@aratech/utils/stringUtils'
import { BranchService } from './branch.service'

@Injectable()
export class DeviceService extends BaseService<any> implements ICategoryConfigService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, Constants.ApiResources.Device.Resource, injector)
  }

  getCategoryConfig() {
    let deviceType: TextFieldConfig = {
      title: 'Device.Type',
      name: 'type',
      maxLength: 250,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: false
    }
    let code: TextFieldConfig = {
      title: 'Device.Code',
      name: 'code',
      maxLength: 250,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: false
    }
    let name: TextFieldConfig = {
      title: 'Device.Name',
      name: 'name',
      maxLength: 250,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: false
    }
    let manufactoryId: ComboboxFieldConfig = {
      title: 'Manufactory.ShortTitle',
      name: 'manufactoryId',
      type: ControlType.Combobox,
      valueField: 'id',
      displayField: 'name',
      objectField: 'manufactory',
      referenceService: ManufactoryService,
      showInGrid: true,
      required: true
    }

    let branchId: ComboboxFieldConfig = {
      title: 'Branch.ShortTitle',
      name: 'branchId',
      type: ControlType.Combobox,
      valueField: 'id',
      displayField: 'name',
      objectField: 'branch',
      referenceService: BranchService,
      showInGrid: false,
      required: false
    }

    let defaultTestTypeId: ComboboxFieldConfig = {
      title: 'TestType.ShortTitle',
      name: 'defaultTestTypeId',
      type: ControlType.Combobox,
      valueField: 'id',
      displayField: 'name',
      objectField: 'testType',
      referenceService: TestTypeService,
      showInGrid: true,
      required: true
    }
    let isBidirectional: CheckBoxFieldConfig = {
      title: 'Device.IsBidirectional',
      name: 'isBidirection',
      type: ControlType.Checkbox,
      showInGrid: true,
      valueType: typeof Number
    }
    let isActive: CheckBoxFieldConfig = {
      title: 'Device.IsActive',
      name: 'isActive',
      type: ControlType.Checkbox,
      showInGrid: true,
      defaultValue: 1,
      valueType: typeof Number
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

    let action: CategoryGridAction = {
      type: GridActionType.Routing,
      icon: 'settings',
      routingField: 'id',
      title: 'DeviceTestCode.Title'
    }

    let categoryConfig: CategoryConfig = {
      type: 'Device',
      name: 'Device.ShortTitle',
      title: 'Device.Title',
      //expandFields: 'testType,manufactory',
      width: '450px',
      gridActions: [action],
      columns: 2,
      pageSize: 50,
      fields: [code, name, defaultTestTypeId, manufactoryId, branchId, isBidirectional, isActive, description]
    }

    return Promise.resolve(categoryConfig)
  }
}

@Injectable()
export class DeviceServiceResolve implements Resolve<any> {
  constructor(private service: DeviceService, private navService: FuseNavigationService) {}

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
