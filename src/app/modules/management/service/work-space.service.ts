import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { BaseService } from '@aratech/services/base.service'
import { Constants } from 'app/shared/constants'

@Injectable({
    providedIn: 'root'
})
export class WorkSpaceService extends BaseService<any> {
    constructor(http: HttpClient, injector: Injector) {
        super(http, Constants.ApiResources.WorkSpace.Resource, injector)
    }

    async getDeviceByIdWorkSpace(workSpaceId: string): Promise<any> {
        let headers: Headers = new Headers()
        let url = `${this.svUrl}/GetDevices/${workSpaceId}`

        return await this.httpGet(url, { headers: headers }).then(
            (response) => {
                return response
            },
            (err) => {
                throw err
            }
        )
    }

    async getWNodeByCustomerId(customerId: string): Promise<any> {
        let headers: Headers = new Headers()
        let url = `${this.svUrl}?type=S&parentId=${customerId}`

        return await this.httpGet(url, { headers: headers }).then(
            (response) => {
                if (!response?.data) return []
                let listNode = []
                response?.data?.forEach(element => {
                    listNode.push(element?.children)
                })
                return listNode?.flat() ?? []
            },
            (err) => {
                return []
            }
        )
    }

    async updateStatus(customerId: string): Promise<any> {
        let url: string = `${this.svUrl}/UpdateStatus/${customerId}`
        return await this.httpPost(url, {}).then(
            (response) => response,
            (err) => err.error
        )
    }

    async backupByCustomer(customerId: string, customerCode: string) {
        const param = `customerId=${customerId}&customerCode=${customerCode}`
        const url: string = `${this.svUrl}/Backup?` + param

        const headers = new HttpHeaders()
        return await this.httpGet(url, { responseType: 'blob', observe: 'response', headers: headers })
            .then(
                (response) => response,
                (err) => err.error
            )
    }

    async restoreByCustomer(file: any, customerId: string, customerCode: string) {
        const url: string = `${this.svUrl}/Restore`
        const body: FormData = new FormData()
        body.append('file', file)
        body.append('customerId', encodeURI(customerId))
        body.append('customerCode', encodeURI(customerCode))
        body.append('isEncrypt', "true")
        return await this.httpPost(url, body)
            .then(
                (response) => response,
                (err) => err.error
            )
    }
}
