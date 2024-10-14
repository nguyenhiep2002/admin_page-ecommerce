import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input, OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core'
import { StringUtils } from '../../utils/stringUtils'
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators'
import { from } from 'rxjs'
import { CategoryConfig } from '@aratech/models/categoryConfig'
import { AraFormComponent } from '@aratech/components/ara-form/ara-form.component'
import { TranslatePipe } from '@ngx-translate/core'
import { PermissionService } from '@aratech/services/permission.service'
import { MatDialog } from '@angular/material/dialog'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete'

@Component({
    selector: 'ara-autocomplete',
    templateUrl: './ara-autocomplete.component.html',
    styleUrls: ['./ara-autocomplete.component.scss'],
    providers: [TranslatePipe]
})
export class AraAutocompleteComponent implements OnInit, OnChanges {
    @Input() borderRadius: boolean = false
    @Input() items: any[]
    @Input() label: string
    @Input() icon: string
    @Input() controlName: string
    @Input() valueField: string = 'value'
    @Input() displayField: string = 'text'
    @Input() displayField2: string = 'text'
    @Input() isMultiField: boolean = false
    @Input() isShowDisplayField2: boolean = false
    @Input() ngModel: any
    @Input() model: any
    @Input() service: any
    @Input() params: any
    @Input() emptyIfNonParams: boolean = false
    @Input() required: boolean = false
    @Input() readOnly: boolean = false
    @Input() allowFreeText: boolean = false
    @Input() hideAddButton: boolean = true
    @Input() tabIndex: number
    @Input() group: FormGroup
    @Input() placeholder: string
    @Input() appearance: string = 'fill'
    @Input() isSearchControl: boolean = false
    @Input() isRemoveHint: boolean = false
    @Input() disable: boolean = false
    @Input() highlight :boolean = false

    @Input() getDisplayText: (item) => string
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter()
    @Output() modelChange: EventEmitter<any> = new EventEmitter()

    errors: any = {}
    filterItems: any[] = []
    myGroup: FormGroup
    isLoading = false
    valueControl: AbstractControl
    myControl: AbstractControl
    touch: boolean = false
    btnAddId: string = 'btnAdd'
    btnNewModel: any = {}
    categoryConfig: CategoryConfig
    showAddButton: boolean = false

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private permissionService: PermissionService,
        public translate: TranslatePipe,
        private cdr: ChangeDetectorRef
    ) {
    }

    checkPermission() {
        if (this.hideAddButton) this.showAddButton == false
        else {
            let addActionCode = this.categoryConfig.addActionCode ? this.categoryConfig.addActionCode.toLowerCase() : ''
            if (addActionCode == 'category_undefined_manger' && this.params && this.params.typeCode) {
                addActionCode = `category_${this.params.typeCode}_manger`
            }
            this.showAddButton = this.permissionService.checkUserActionCode(addActionCode)
        }
    }

    ngOnInit() {
        this.showAddButton = !this.hideAddButton
        this.btnNewModel[this.valueField] = this.btnAddId
        this.btnNewModel[this.displayField] = 'Thêm mới'

        if (this.required) this.myControl = new FormControl(this.model, Validators.required)
        else this.myControl = new FormControl(this.model)

        this.myGroup = this.fb.group({
            myInput: this.myControl
        })
        if (this.disable) {
            this.myControl.disable()
        }
        this.myControl = this.myGroup.get('myInput')
        this.myControl.valueChanges
            .pipe(
                debounceTime(300),
                tap(() => (this.isLoading = true)),
                switchMap((value) => from(this.searchData(value)).pipe(finalize(() => (this.isLoading = false))))
            )
            .subscribe((data) => (this.filterItems = data))

        if (this.group) {
            const control = this.group.get(this.controlName)
            this.valueControl = control
            if (control) {
                control.valueChanges.subscribe(() => {
                    this.errors = {}
                    if (!control.valid && !control.pending) this.errors = control.errors
                })
            }
        }
        if (this.model) {
            this.filterItems = [this.model]
        } else if (this.ngModel) {
            this.loadDisplayByValue()
        }

        if (this.service && this.service.getCategoryConfig) {
            this.service.getCategoryConfig().then((cfg) => {
                this.categoryConfig = cfg
                this.checkPermission()
                this.permissionService.getPermissionChangeEvent().subscribe(() => {
                    this.checkPermission()
                })
            })
        }
    }

    ngAfterViewInit() {

    }

    setModel(item: any) {
        this.model = item
        this.myControl?.setValue(item)
        this.modelChange.emit(item)
    }

    display = (item): string | undefined => {
        return item ? item[this.displayField] : item
    }

    getText(item) {
        if (this.getDisplayText && item[this.valueField] != this.btnAddId) {
            return this.getDisplayText(item)
        }

        return this.isMultiField ? `${item[this.displayField]} (${item[this.displayField2]})` : item[this.displayField]
    }

    onBlur() {
        let curValue = this.myControl.value
        if (!this.allowFreeText) {
            if (!curValue || !curValue[this.displayField] || !curValue[this.valueField]) {
                this.clear()
            }
        }
    }

    async searchData(search?: string): Promise<any> {
        if (typeof search === 'string') {
            search = search?.trim()?.toLowerCase() ?? ''
            if (this.service) {
                if (this.emptyIfNonParams && !this.params) {
                    return Promise.resolve([])
                }
                let params = Object.assign({}, this.params)
                params.search = search
                let res = await this.service.get(params, 1, 10)
                return await res.data
            } else {
                const originalItems = [...this.items]
                const filterItems = originalItems?.filter(
                    (x) => x[this.displayField] && x[this.displayField].toLowerCase().indexOf(search.toLowerCase()) >= 0
                )
                return Promise.resolve(filterItems)
            }
        }
        return Promise.resolve(this.filterItems)
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model && this.myControl) {
            this.myControl.setValue(this.model)
        }

        if (changes.ngModel || changes.items) {
            if (!this.ngModel && this.model && this.myControl && !this.allowFreeText) this.clear()

            this.loadDisplayByValue()
        }

        if (changes.items && !this.service) {
            this.filterItems = [...this.items]
            if (!this.ngModel) {
                this.clear()
            }
        }

        if (this.disable && this.myControl) {
            this.myControl?.disable()
        } else {
            this.myControl?.enable()
        }
    }

    loadDisplayByValue() {
        if (this.ngModel && !this.model && !this.touch && !this.allowFreeText) {
            if (this.service && this.myControl) {
                this.touch = true
                this.service.getDetail(this.ngModel).then((o) => {
                    this.setModel(o)
                    if (this.valueControl) {
                        this.valueControl.setValue(this.ngModel)
                    }
                })
            } else if (this.items && this.items.length > 0) {
                const originalItems = [...this.items]
                const objs = originalItems.filter((o) => o[this.valueField] == this.ngModel)
                if (objs.length > 0) {
                    this.setModel(objs[0])
                }
            }
        }

        if (this.ngModel && this.myControl && this.allowFreeText && this.valueField == this.displayField && !this.model) {
            let model = {}
            model[this.valueField] = this.ngModel
            this.setModel(model)
            if (this.valueControl) {
                this.valueControl.setValue(this.ngModel)
            }
        }
    }

    clear() {
        this.model = undefined
        this.myControl?.setValue('')
        this.modelChange.emit({})
        this.myGroup?.get('myInput').setValue('')
        this.onValueChange()
    }

    deselectAllOption(auto?: MatAutocomplete) {
        if (!auto) return
        auto?.options.forEach(item => {
            if (item.selected) {
                item.deselect()
            }
        })
        this.clear()
    }

    onModelChange(data?: any) {
        this.onValueChange(StringUtils.getEmpty(data))
    }

    onValueChange(data?: any) {
        let newValue = data ? data[this.valueField] : undefined
        const isString = typeof data == 'string'
        if (StringUtils.getEmpty(this.ngModel) != StringUtils.getEmpty(newValue)) {
            this.ngModel = newValue
            this.ngModelChange.emit(this.ngModel)

            if (!isString) this.modelChange.emit(this.myControl.value)

            if (this.valueControl) {
                this.valueControl.setValue(this.ngModel)
            }
        }
    }

    onFocus(trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
        this.touch = true
        if ((!this.filterItems || this.filterItems.length == 0) && !this.model && !this.ngModel) {
            this.searchData('').then((data) => {
                this.filterItems = data
            })
        }
        if (this.myGroup?.get('myInput')?.value === '') {
            this.deselectAllOption(auto)
        }
        if (!this.readOnly) trigger.openPanel()
    }

    async showAddItemDialog() {
        if (this.params) {
            let keys = Object.keys(this.params)
            for (const key of keys) {
                this.service[key] = this.params[key]
            }
        }

        var categoryConfig: CategoryConfig = await this.service.getCategoryConfig()
        var item = {}
        let dialogRef = this.dialog.open(AraFormComponent, {
            panelClass: 'child-no-padding',
            data: {
                item: item,
                service: this.service,
                categoryConfig: categoryConfig,
                options: {
                    title: StringUtils.format(
                        this.translate.transform('Category.AddTitle'),
                        this.translate.transform(categoryConfig.name)
                    ),
                    minWidth: categoryConfig.minWidth ? categoryConfig.minWidth : categoryConfig.columns == 2 ? '600px' : '400px',
                    width: categoryConfig.width,
                    columns: categoryConfig.columns
                },
                fields: categoryConfig.fields,
                objectFields: categoryConfig.objectFields
            }
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.setModel(result.model)
                this.filterItems.push(result.model)
                if (this.valueControl) {
                    this.valueControl.setValue(this.ngModel)
                }
            }
        })
    }
}
