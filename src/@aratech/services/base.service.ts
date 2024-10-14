import { Injector } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from './AuthenticationService'
import { WaitingService } from './waiting.service'
import { Configs } from '@aratech/utils/configs'
import { MatDialog } from '@angular/material/dialog'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { GlobalStoreService } from '../../app/core/store/global-store.service'

export class BaseService<T> {
    svUrl: string
    apiDomain: string
    injector: Injector
    http: HttpClient
    waitingService: WaitingService
    ignoreAuthorization: boolean = false

    constructor(private _http: HttpClient, svUrl: string, _injector: Injector) {
        let apiDomain = Configs.getConfig('Api_Domain')
        if (apiDomain == '' || apiDomain == '~/' || apiDomain == '/')
            apiDomain = document.location.protocol + '//' + document.location.host + '/'

        if (svUrl && svUrl.indexOf('http') == 0) this.svUrl = svUrl
        else this.svUrl = apiDomain + svUrl

        this.apiDomain = apiDomain
        this.injector = _injector
        this.http = _http
        this.waitingService = this.injector.get(WaitingService)
        this.ignoreAuthorization = Configs.getConfig('ignoreAuthorization')
    }

    getApiDomain(): string {
        let apiDomain = Configs.getConfig('Api_Domain')
        if (apiDomain == '' || apiDomain == '~/' || apiDomain == '/')
            apiDomain = document.location.protocol + '//' + document.location.host + '/'

        return apiDomain
    }

    getUsingCache(params?: any, page?: number, limit?: number): Promise<any> {
        return this.get(params, page, limit)
    }

    get(params?: any, page?: number, limit?: number, orderby?: any): Promise<any> {
        let headers: HttpHeaders = new HttpHeaders()
        let url = this.svUrl
        let xLimit = limit ? limit : 20
        let skip = ((page ? page : 1) - 1) * xLimit
        url += '?skip=' + skip + '&top=' + xLimit

        if (params && Object.keys(params).length > 0) {
            for (const key of Object.keys(params)) {
                if (params[key] != null && params[key] != undefined) url += '&' + key + '=' + encodeURIComponent(params[key])
            }
        }
        if (orderby && Object.keys(orderby).length > 0) {
            for (const key of Object.keys(orderby)) {
                if (orderby[key] != null && orderby[key] != undefined)
                    url += '&ORDER=' + key + '|' + encodeURIComponent(orderby[key])
            }
        }
        return this.httpGet(url, { headers: headers }).then(
            (response) => {
                return response
            },
            (err) => {
                throw err
            }
        )
    }

    async getAsync(params?: any, page?: number, limit?: number, orderby?: any): Promise<any> {
        return await this.get(params, page, limit, orderby)
    }

    getDetail(id: string): Promise<any> {
        let headers = new HttpHeaders()
        let url = `${this.svUrl}/${id}`

        return this.httpGet(url, { headers: headers }).then(
            (response) => {
                return response
            },
            (err) => {
                throw err
            }
        )
    }

    async getDetailAsync(id: string): Promise<any> {
        let headers = new HttpHeaders()
        let url = `${this.svUrl}/${id}`

        return await this.httpGet(url, { headers: headers }).then(
            (response) => {
                return response
            },
            (err) => {
                throw err
            }
        )
    }

    save(item: T, itemId: string): Promise<any> {
        if (itemId) {
            return this.put(item, itemId)
        }
        return this.post(item)
    }

    post(item: T, id?: any): Promise<any> {
        let headers = new HttpHeaders()
        item['id'] = id

        return this.httpPost(this.svUrl, item, { headers: headers }).then(
            (response) => {
                return response
            },
            (err) => {
                throw err
            }
        )
    }

    put(item: T, itemId: string): Promise<any> {
        let headers = new HttpHeaders()
        let url = `${this.svUrl}`

        return this.httpPut(url, item, { headers: headers }).then(
            (response) => {
                return response
            },
            (err) => {
                throw err
            }
        )
    }

    delete(id: string): Promise<any> {
        let headers = new HttpHeaders()
        let url = `${this.svUrl}/${id}`

        return this.httpDelete(url, { headers: headers })
    }

    public changeStatus(id: string, status: number): Promise<any> {
        let headers = new HttpHeaders()
        let url = `${this.svUrl}/${id}/changestatus`

        return this.httpPost(url, { status: status }, { headers: headers })
    }

    async refreshToken(): Promise<string> {
        let authen: AuthenticationService
        authen = this.injector.get(AuthenticationService)
        const token = await authen.getValidToken(true)
        if (token === undefined || token === null || token === '' || token === 'null') {
            this.injector.get(MatDialog).closeAll()
            let router: Router = this.injector.get(Router)
            await router.navigate([Configs.getConfig('Router_Login')])
            return undefined
        }
        return token
    }

    handleError(error: any, injector: Injector, waitingId: string = undefined, isLoadingBar: boolean = false) {
        if (!error.proceeded) {
            console.error('Có lỗi xảy ra', error)
            if (error.status == 401) {
                this.injector.get(MatDialog).closeAll()
                var authen: AuthenticationService = injector.get(AuthenticationService)
                var router: Router = injector.get(Router)
                authen.logout()
                router.navigate([Configs.getConfig('Router_Login')])
            }
        }

        isLoadingBar ? this.waitingService.stopWaitingBar(waitingId) : this.waitingService.stopWaiting(waitingId)
        error.proceeded = true
        return error
    }

    async addAuthorizationAsync(headers: HttpHeaders, hasContentType: boolean = true) {
        let authen: AuthenticationService
        authen = this.injector.get(AuthenticationService)

        if (!this.ignoreAuthorization) {
            const token = await authen.getValidToken()
            if (token === undefined || token === null || token == '' || token == 'null') {
                this.injector.get(MatDialog).closeAll()
                let router: Router = this.injector.get(Router)
                await router.navigate([Configs.getConfig('Router_Login')])
                throw 'Unauthorized'
            }
            headers = headers.append('Authorization', 'Bearer ' + token)
        }

        if (hasContentType) headers?.append('Content-Type', 'application/json; charset=utf-8')

        //Thêm workspaceId cho để lọc data theo tài khoản khách hàng
        headers = headers?.append('Customer-Id', localStorage.getItem('customer_id') ?? '')
        return headers
    }

    async httpGet(
        url: string,
        options?: any,
        showWaiting: boolean = true,
        isJsonContentType: boolean = true
    ): Promise<any> {
        options = options ? options : {}
        let headers = options.headers ? options.headers : new HttpHeaders()
        options.headers = await this.addAuthorizationAsync(headers, isJsonContentType)
        let waitingId = showWaiting ? this.waitingService.startWaitingBar() : 'no-waiting'

        try {
            let response = await this._http.get(url, options).toPromise()
            this.waitingService.stopWaitingBar(waitingId)
            return response
        } catch (error) {
            if (error.status == 401) {
                let newToken = await this.refreshToken()
                if (newToken) {
                    options.headers.set('Authorization', 'Bearer ' + newToken)
                    try {
                        let response = await this._http.get(url, options).toPromise()
                        this.waitingService.stopWaitingBar(waitingId)
                        return response
                    } catch (newError) {
                        throw this.handleError(newError, this.injector, waitingId, true)
                    }
                }
            }

            throw this.handleError(error, this.injector, waitingId, true)
        }
    }

    async httpGetWaiting(
        url: string,
        options?: any,
        showWaiting: boolean = true,
        isJsonContentType: boolean = true
    ): Promise<any> {
        options = options ? options : {}
        let headers = options.headers ? options.headers : new HttpHeaders()
        options.headers = await this.addAuthorizationAsync(headers, isJsonContentType)
        let waitingId = showWaiting ? this.waitingService.startWaiting() : 'no-waiting'

        try {
            let response = await this._http.get(url, options).toPromise()
            this.waitingService.stopWaiting(waitingId)
            return response
        } catch (error) {
            if (error.status == 401) {
                let newToken = await this.refreshToken()
                if (newToken) {
                    options.headers.set('Authorization', 'Bearer ' + newToken)
                    try {
                        let response = await this._http.get(url, options).toPromise()
                        this.waitingService.stopWaiting(waitingId)
                        return response
                    } catch (newError) {
                        throw this.handleError(newError, this.injector, waitingId, true)
                    }
                }
            }

            throw this.handleError(error, this.injector, waitingId, true)
        }
    }

    async httpPost(
        url: string,
        body: any,
        options?: any,
        showWaiting: boolean = true,
        hasContentType: boolean = true
    ): Promise<any> {
        options = options ? options : {}
        let headers = options.headers ? options.headers : new HttpHeaders()
        options.headers = await this.addAuthorizationAsync(headers, hasContentType)
        let waitingId = showWaiting ? this.waitingService.startWaiting() : 'no-waiting'
        try {
            let response = await this._http.post(url, body, options).toPromise()
            this.waitingService.stopWaiting(waitingId)
            return response
        } catch (error) {
            if (error.status == 401) {
                let newToken = await this.refreshToken()
                if (newToken) {
                    options.headers.set('Authorization', 'Bearer ' + newToken)
                    try {
                        let response = await this._http.post(url, body, options).toPromise()
                        this.waitingService.stopWaiting(waitingId)
                        return response
                    } catch (newError) {
                        throw this.handleError(newError, this.injector, waitingId, false)
                    }
                }
            }

            throw this.handleError(error, this.injector, waitingId, false)
        }
    }

    async httpPut(url: string, body: any, options?: any, showWaiting: boolean = true): Promise<any> {
        options = options ? options : {}
        let headers = options.headers ? options.headers : new HttpHeaders()
        options.headers = await this.addAuthorizationAsync(headers)
        let waitingId = showWaiting ? this.waitingService.startWaiting() : 'no-waiting'

        try {
            let response = await this._http.put(url, body, options).toPromise()
            this.waitingService.stopWaiting(waitingId)
            return response
        } catch (error) {
            if (error.status == 401) {
                let newToken = await this.refreshToken()
                if (newToken) {
                    options.headers.set('Authorization', 'Bearer ' + newToken)
                    try {
                        let response = await this._http.put(url, body, options).toPromise()
                        this.waitingService.stopWaiting(waitingId)
                        return response
                    } catch (newError) {
                        throw this.handleError(newError, this.injector, waitingId, false)
                    }
                }
            }

            throw this.handleError(error, this.injector, waitingId, false)
        }
    }

    async httpDelete(url: string, options?: any, showWaiting: boolean = true): Promise<any> {
        options = options ? options : {}
        let headers = options.headers ? options.headers : new HttpHeaders()
        options.headers = await this.addAuthorizationAsync(headers)
        let waitingId = showWaiting ? this.waitingService.startWaiting() : 'no-waiting'

        try {
            let response = await this._http.delete(url, options).toPromise()
            this.waitingService.stopWaiting(waitingId)
            return response
        } catch (error) {
            if (error.status == 401) {
                let newToken = await this.refreshToken()
                if (newToken) {
                    options.headers.set('Authorization', 'Bearer ' + newToken)
                    try {
                        let response = await this._http.delete(url, options).toPromise()
                        this.waitingService.stopWaiting(waitingId)
                        return response
                    } catch (newError) {
                        throw this.handleError(newError, this.injector, waitingId, false)
                    }
                }
            }

            throw this.handleError(error, this.injector, waitingId, false)
        }
    }

    httpGetObservable(
        url: string,
        options?: any,
        showWaiting: boolean = true,
        isJsonContentType: boolean = true
    ): Observable<any> {
        var me = this
        // let asyncPromise = async function name(options?: any, showWaiting: boolean = true, isJsonContentType: boolean = true) {
        //     options = options ? options : {};
        //     let headers = options.headers ? options.headers : new HttpHeaders ();
        //     options.headers = await me.addAuthorizationAsync(headers, isJsonContentType);
        //     return options;
        // }

        return me._http.get(url, options)

        // var obsReturn = from(asyncPromise(options, showWaiting, isJsonContentType));
        // return obsReturn.pipe(mergeMap(optionsX => {
        //     return me._http.get(url, optionsX);
        // }));
    }
}
