import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigProvider {
    public static _config = environment;
    private config: any = {};

    constructor(private http: HttpClient) {

    }

    public getAllConfig(): any {
        return this.config;
    }

    public getConfig(key: string): any {
        return this.config[key];
    }

    load(): Observable<any> {
        return this.http
        .get(ConfigProvider._config.ConfigFileUrl)
        .pipe(
            tap((response) => {
                this.config = response;
                return true;
            })
        )
    }
}

export function configProviderFactory(provider: ConfigProvider) {
    return () => provider.load();
}