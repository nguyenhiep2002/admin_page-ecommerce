import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core'
import { Event, ActivatedRoute, Router, RouterEvent } from '@angular/router'
import { filter, Subject, takeUntil } from 'rxjs'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation'
import { Navigation } from 'app/core/navigation/navigation.types'
import { NavigationService } from 'app/core/navigation/navigation.service'
import { WorkSpaceService } from '../../../../modules/management/service/work-space.service'
import { GlobalStoreService } from '../../../../core/store/global-store.service'
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'dense-layout',
    templateUrl: './dense.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [WorkSpaceService]
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
    @Output() onSelected: EventEmitter<any> = new EventEmitter()

    isControlDisabled = false

    title: string = ''
    roleUser: string = localStorage.getItem('current_role')
    globalCustomerId: string = localStorage.getItem('customer_id')
    isAdmin = this.roleUser === 'Admin'
    isCustomerPage: boolean = false


    placeholderCustomer: string = ""
    isScreenSmall: boolean
    navigation: Navigation
    navigationAppearance: 'default' | 'dense' = 'dense'
    private _unsubscribeAll: Subject<any> = new Subject<any>()

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _translateService: TranslateService,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        public _workSpaceService: WorkSpaceService,
        public _globalStoreService: GlobalStoreService,
        private cdr: ChangeDetectorRef
    ) {
        this.isCustomerPage = _router.url.indexOf('/management/customer') > -1  || _router.url === '/'
        this._router.events.pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
        ).subscribe((e: RouterEvent) => {
            this.isCustomerPage = e.url.indexOf('/management/customer') > -1 || e.url === '/'
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation
                if (localStorage.getItem('current_role') !== 'Admin') {
                    this._globalStoreService.setData({ customerId: localStorage.getItem('customer_id') })
                    this._globalStoreService.emitEvent({ customerId: localStorage.getItem('customer_id') })
                }
            })

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md')
                // Change the navigation appearance
                this.navigationAppearance = this.isScreenSmall ? 'default' : 'dense'
            })

        this._globalStoreService.isControlDisabled$.subscribe((isDisabled: boolean) => {
            this.isControlDisabled = isDisabled
            this.cdr.detectChanges()
        })
    }

    ngAfterContentChecked() {
        setTimeout(() => {
            this.title = this._globalStoreService.getTitle()
        })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null)
        this._unsubscribeAll.complete()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name)
        

        if (navigation) {
            // Toggle the opened status
            navigation.toggle()
        }
    }

    /**
     * Toggle the navigation appearance
     */
    toggleNavigationAppearance(): void {
        this.navigationAppearance = (this.navigationAppearance === 'default' ? 'dense' : 'default')
    }

    onChangeCustomer(event: any) {
        this._globalStoreService.setData({ customerId: event.id, customerCode: event.code })
        // console.log('DenseLayout GetCustomerId: ', this._globalStoreService.getData())
        this._globalStoreService.emitEvent({ customerId: event.id, customerCode: event.code })
    }
}
