import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core'
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'languages',
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages'
})
export class LanguagesComponent implements OnInit, OnDestroy {
    availableLangs: any[]
    activeLang: string
    flagCodes: any

    /**
     * Constructor
     */
    constructor(
        private _translateService: TranslateService,
        private _translatePipe: TranslatePipe
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.availableLangs = [
            {
                id: 'vi',
                label: this._translatePipe.transform("Language.Vietnamese")
            },
            {
                id: 'en',
                label: this._translatePipe.transform("Language.English")
            },
            {
                id: 'jp',
                label: this._translatePipe.transform("Language.Japanese")
            }
        ]
        this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.availableLangs = [
                {
                    id: 'vi',
                    label: event.translations.Language.Vietnamese
                },
                {
                    id: 'en',
                    label: event.translations.Language.English
                },
                {
                    id: 'jp',
                    label: event.translations.Language.Japanese
                }
            ]
        });
        this.activeLang = this._translateService.defaultLang;
        this.flagCodes = {
            'vi': 'vi',
            'en': 'us',
            'jp': 'jp'
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void {
        this._translateService.use(lang)
        this.activeLang = lang
    }
}
