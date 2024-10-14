import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'

@Injectable({
    providedIn: 'root'
})
//ChatGPT
export class GlobalStoreService {
    private dataSubject = new BehaviorSubject<any>(null)
    private eventSubject = new Subject<any>();

    private isControlDisabledSubject = new BehaviorSubject<boolean>(false);
    isControlDisabled$ = this.isControlDisabledSubject.asObservable();

    public data$: Observable<any> = this.dataSubject.asObservable()

    constructor(private titleService: Title) {
    }

    setData(data: any): void {
        this.dataSubject.next(data)
    }

    getData(): any {
        return this.dataSubject.getValue()
    }

    setTitle(newTitle: string): void {
        this.titleService.setTitle(newTitle)
    }

    getTitle(): string {
        return this.titleService.getTitle()
    }

    //Bắn sự kiện tới các component subscribe nó
    emitEvent(data: any): void {
        this.eventSubject.next(data);
    }

    getEvent(): Subject<any> {
        return this.eventSubject;
    }

    setControlDisabled(isDisabled: boolean): void {
        this.isControlDisabledSubject.next(isDisabled);
    }
}
