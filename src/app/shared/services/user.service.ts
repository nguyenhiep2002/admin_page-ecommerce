import { Injectable, Injector } from '@angular/core'
import { Constants } from '../constants'
import { BaseService } from '@aratech/services/base.service'
import { ConfigProvider } from '../config.provider'
import { PermissionService } from '@aratech/services/permission.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
// import { adminNavigation } from "app/navigation/navigation";
import { UserInfoService } from '@aratech/services/userInfo.service'
import _ from 'lodash'
import { GlobalStoreService } from '../../core/store/global-store.service'

// import { StaffService } from "app/category/services/staff.service";

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService<any> {
    protected key_current_role = 'current_role'
    protected key_user_info = 'user_info'

    static userInfo: any = {}
    static roles: string[] = []
    static menus: any[] = []

    constructor(http: HttpClient,
                injector: Injector,
                private configProvider: ConfigProvider,
                private permissionService: PermissionService,
                private userInfoService: UserInfoService,
                public globalStoreService: GlobalStoreService
    ) {
        super(http, Constants.ApiResources.User.Resource, injector)
    }

    resetPassword(params: any): Promise<any> {
        let headers = new HttpHeaders()
        return this.httpPost(this.svUrl + '/changePassword',
            params,
            { headers: headers }
        )
    }

    async getMyProfile() {
        let headers = new HttpHeaders()
        let appCode = this.configProvider.getConfig('AppCode')
        let url = `${this.svUrl}/${Constants.ApiResources.User.GetMyProfile}?appCode=${appCode}`
        await this.httpGet(url, { headers: headers })
            .then(myProfile => {
                const userActionCodes = myProfile?.actionCodes?.map((o: string) => o.toLowerCase()) ?? []
                const roles = myProfile.roles
                const info = myProfile.info
                //Set permissions by ActionCode
                this.permissionService.setPermission(roles, userActionCodes)
                let menusTreeData = this.convertTreeData(myProfile.menus, '0')
                const checkRole =
                    roles.indexOf('ADP_Deepcare_Admin') >= 0
                    || roles.indexOf('ADP_Admin') >= 0
                    || roles.indexOf('Admin') >= 0
                    || roles.indexOf('RootAdmin') >= 0
                this.userInfoService.setAdmin(checkRole)
                if (menusTreeData.length > 0 && menusTreeData[0].children && checkRole) {
                    let adminNav = []
                    for (let nav of adminNav) {
                        nav.meta = menusTreeData[0]
                        for (let subNav of nav.children) subNav.meta = nav
                    }
                    menusTreeData[0].children.push(...adminNav)
                }
                UserService.userInfo = info
                UserService.roles = roles
                UserService.menus = menusTreeData
            })
        localStorage.setItem(this.key_user_info, JSON.stringify(UserService.userInfo))
        localStorage.setItem(this.key_current_role, this.userInfoService.getAdmin() ? 'Admin' : 'User')
        // Gọi API lấy Customer Id từ Customer Code
        const customerCode = UserService.userInfo?.customerCode ?? ''
        if (_.isEmpty(customerCode)) {
            localStorage.setItem('customer_id', '')
            return
        }
        const domainUrl = this.configProvider.getConfig('Api_Domain')
        const urlWorkspace = `${domainUrl}${Constants.ApiResources.WorkSpace.Resource}?code=${customerCode}'`
        await this.httpGet(urlWorkspace, { headers: headers })
            .then(rep => {
                localStorage.removeItem('customer_id')
                localStorage.setItem('customer_id', `${rep?.data[0]?.id ?? ''}`)
                this.globalStoreService.setData(rep?.data[0])
                if (rep.count < 1) console.error('Mã code không tồn tại trong ADP' + customerCode)
            })
            .catch(() => {
                localStorage.removeItem('customer_id')
                localStorage.setItem('customer_id', '')
                console.error('Có lỗi xảy ra khi lấy hàm id cho tài khoản !')
            })
    }

    setUserInfo(value: any) {
        if (value) UserService.userInfo = value
    }

    getUserInfo() {
        return UserService.userInfo
    }

    getRolesInfo() {
        return UserService.roles
    }

    convertTreeData(data: any[], parentId: string) {
        const results: any[] = []

        if (data.length == 0)
            return []

        let childs = data.filter(r => {
            return r.parentId === parentId || (parentId === '0' && !r.parentId)
        })

        let grandChilds = data.filter(r => {
            return !(r.parentId === parentId || (parentId === '0' && !r.parentId))
        })

        if (childs.length > 0) {
            childs.forEach(child => {
                child.children = this.convertTreeData(grandChilds, child.id)
                child.translate = child.name
                child.title = child.name
                child.url = child.url == '#' && child.children.length > 0 ? undefined : child.url
                child.link = child.url == '#' && child.children.length > 0 ? undefined : child.url
                child.type = parentId == '0' ? 'group' : child.children.length > 0 ? 'collapsable' : 'basic'
                results.push(child)
            })
        }

        return results
    }

    async getUserInfoAsync() {
        if (!UserService.userInfo || !UserService.userInfo.id) {
            await this.getMyProfile()
        }
        return UserService.userInfo
    }

    getMyMenus() {
        return UserService.menus ?? []
    }
}
