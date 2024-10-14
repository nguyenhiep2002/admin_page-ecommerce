import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ComponentDataService {
    componentData: any = {};

    constructor() {
    }
    
    setParams(key: string, data: any) {
        this.componentData[key] = data;
    }

    getParams(key: string, keep?: boolean) {
        let data = this.componentData[key];
        if (data && !keep) this.componentData[key] = undefined;
        return data;
    }
}