import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CategoryConfig } from '@aratech/models/categoryConfig';
import { AraFormComponent } from '@aratech/components/ara-form/ara-form.component';
import { TranslatePipe } from '@ngx-translate/core';
import { StringUtils } from '@aratech/utils/stringUtils';
import { PermissionService } from '@aratech/services/permission.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'ara-select',
    templateUrl: './ara-select.component.html',
    styleUrls: ['./ara-select.component.scss'],
    providers: [TranslatePipe]
})
export class AraSelectComponent implements OnInit, OnChanges {
    @Input() items: any[];
    @Input() defaultText: string[];
    @Input() label: string;
    @Input() controlName: string;
    @Input() valueField: string = 'value';
    @Input() displayField: string = 'text';
    @Input() ngModel: any;
    @Input() model: any;
    @Input() service: any;
    @Input() params: any;
    @Input() emptyIfNonParams: boolean = false;
    @Input() required: boolean = false;
    @Input() multiple: boolean = false;
    @Input() hideClearButton: boolean = false;
    @Input() hideAddButton: boolean = true;
    @Input() selectIfOnly: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() group: FormGroup;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();
    @Output() modelChange: EventEmitter<any> = new EventEmitter();

    errors: any = {};
    btnAddId: string = 'btnAdd';
    btnNewModel: any = {};
    categoryConfig: CategoryConfig; 
    showAddButton: boolean = false;


    constructor(public dialog: MatDialog
        , private permissionService: PermissionService
        , public translate: TranslatePipe) { }


    checkPermission() {
        if (this.hideAddButton)
            this.showAddButton == false;
        else {
            let addActionCode = this.categoryConfig.addActionCode ? this.categoryConfig.addActionCode.toLowerCase() : '';
            if (addActionCode == 'category_undefined_manger' && this.params && this.params.typeCode) {
                addActionCode = `category_${this.params.typeCode}_manger`;
            }
            this.showAddButton = this.permissionService.checkUserActionCode(addActionCode);
        }
    }
    
    ngOnInit() {       
        this.showAddButton = !this.hideAddButton;
        this.btnNewModel[this.valueField] = this.btnAddId;
        this.btnNewModel[this.displayField] = 'Thêm mới';

        if (this.group) {
            const control = this.group.get(this.controlName);
            if (control) {
                control.valueChanges.subscribe(() => {
                    this.errors = {};
                    if (control.dirty && !control.valid && !control.pending)
                        this.errors = control.errors;
                });
            }
        }
        this.loadData();

        if (this.service && this.service.getCategoryConfig) {
            this.service.getCategoryConfig().then(cfg => {
                this.categoryConfig = cfg;
                this.checkPermission();
                this.permissionService.getPermissionChangeEvent().subscribe(() => {
                    this.checkPermission();
                });
            });
        }
    }

    loadData() {
        if (this.service) {
            if (this.emptyIfNonParams && !this.params) {
                this.items = [];
                this.clear();
            }
            else {
                this.service.get(this.params, 1, 999).then(res => {
                    this.items = res.data;
                    let selected = this.items.filter(x => x[this.valueField] == this.ngModel 
                        || (Array.isArray(this.ngModel) && this.ngModel.indexOf(x[this.valueField]) >= 0)
                        || (this.defaultText && this.defaultText.indexOf(x[this.displayField]) >= 0));

                    if (selected.length == 0) {
                        if (this.selectIfOnly && this.items.length == 1) {
                            this.ngModel = this.items[0][this.valueField];
                            this.onModelChange();
                        }
                        // else {
                        //     this.clear();
                        // }
                    }
                    else {
                        if (!this.ngModel) {
                            var selectedValues = selected.map(x => x[this.valueField]);
                            if (this.multiple)
                                this.ngModel = selectedValues;
                            else
                                this.ngModel = selectedValues[0];
                        }

                        if (this.multiple)
                            this.modelChange.emit(selected);
                        else
                            this.modelChange.emit(selected[0]);
                    }
                });
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.params) {
            this.loadData();
        }
    }

    clear() {
        this.ngModel = undefined;
        this.onModelChange();
    }

    onSelectionChange(event: any) {
        this.selectionChange.emit(event);
    }

    onModelChange(data?) {
        this.ngModelChange.emit(this.ngModel);
        let selected = !this.items ? undefined : this.items.find(x => x[this.valueField] == this.ngModel);
        this.modelChange.emit(selected);
    }

    async showAddItemDialog() {
        if (this.params) {
            let keys = Object.keys(this.params);
            for (const key of keys) {
                this.service[key] = this.params[key];
            }
        }
        var categoryConfig: CategoryConfig = await this.service.getCategoryConfig();
        var item = {};
        let dialogRef = this.dialog.open(AraFormComponent, {
            panelClass: 'child-no-padding',
            data: {
                item: item,
                service: this.service,
                categoryConfig: categoryConfig,
                options: {
                    title: StringUtils.format(this.translate.transform('Category.AddTitle'), this.translate.transform(categoryConfig.name)),
                    minWidth: categoryConfig.minWidth ? categoryConfig.minWidth : categoryConfig.columns == 2 ? '600px' : '400px',
                    width: categoryConfig.width,
                    columns: categoryConfig.columns
                },
                fields: categoryConfig.fields,
                objectFields: categoryConfig.objectFields
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.items.push(result.model);

                if (!this.multiple) {
                    this.ngModel = result.model[this.valueField];
                    this.onModelChange();
                }
            }
        });
    }
}
