import { HttpClient } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { ICategoryConfigService } from '@aratech/services/ara-category.service'
import { Constants } from 'app/shared/constants'
import { TextFieldConfig } from '@aratech/models/textFieldConfig'
import { ControlType } from '@aratech/enums/controlType'
import { TextAreaFieldConfig } from '@aratech/models/textareaFieldConfig'
import { CategoryConfig } from '@aratech/models/categoryConfig'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service'
import { Observable } from 'rxjs'
import { StringUtils } from '@aratech/utils/stringUtils'

@Injectable({
  providedIn: 'root'
})
export class CategoryTypeService extends BaseService<any> implements ICategoryConfigService {
  private static cacheData: any[]
  private static GetAllThread: Promise<any>

  constructor(http: HttpClient, injector: Injector) {
    super(http, Constants.ApiResources.CategoryType.Resource, injector)
  }

  async getAll() {
    try {
      if (!CategoryTypeService.cacheData) {
        if (!CategoryTypeService.GetAllThread) CategoryTypeService.GetAllThread = super.get({}, 1, 999)

        let resTypes = await CategoryTypeService.GetAllThread
        CategoryTypeService.cacheData = resTypes.data
      }

      return CategoryTypeService.cacheData
    } catch (err) {
      throw err
    }
  }

  async getByCode(code: string): Promise<any> {
    try {
      // return { code: code, typeCode: code, name: 'CCC', id: '12345678'}
      var allTypes = await this.getAll()
      var type = allTypes.find((x) => x.code.toLowerCase() == code.toLowerCase())
      return type ? type : {}
    } catch (err) {
      throw err
    }
  }

  getCategoryConfig() {
    let code: TextFieldConfig = {
      title: 'CategoryType.Code',
      name: 'code',
      maxLength: 250,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: false
    }

    let name: TextFieldConfig = {
      title: 'CategoryType.Name',
      name: 'name',
      maxLength: 500,
      type: ControlType.Text,
      showInGrid: true,
      required: true,
      fitRowWidth: false
    }

    let description: TextAreaFieldConfig = {
      type: ControlType.TextArea,
      name: 'description',
      rows: 3,
      title: 'Common.Description',
      required: false,
      maxLength: 2000,
      fitRowWidth: true,
      showInGrid: false
    }

    let categoryConfig: CategoryConfig = {
      type: 'CategoryType',
      name: 'CategoryType.ShortTitle',
      title: 'CategoryType.Title',
      width: '450px',
      fields: [code, name, description]
    }

    return Promise.resolve(categoryConfig)
  }
}

@Injectable()
export class CategoryTypeServiceResolve implements Resolve<any> {
  constructor(private service: CategoryTypeService, private navService: FuseNavigationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.getCategoryConfig().then((rs) => {
      if (!rs.icon) {
        this.navService.onNavigationChanged?.subscribe(() => {
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
