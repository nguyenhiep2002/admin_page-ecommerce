import { Component, OnInit, Input, Output, Injector, ViewContainerRef, ViewChild, ComponentFactoryResolver, Inject, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ControlType } from '../../enums/controlType';
import { StringUtils } from '../../utils/stringUtils';
import { BaseService } from '@aratech/services/base.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'ara-field',
    templateUrl: './ara-field.component.html',
    styleUrls: ['./ara-field.component.scss'],
    providers: [TranslatePipe]
})
export class AraFieldComponent implements OnInit, OnDestroy {     
    @ViewChild("childContainer", { read: ViewContainerRef, static: true }) childContainer: ViewContainerRef;
    @Input("options") options: any = {};
    @Input() parentGroup: FormGroup;
    @Input() @Output() model: any = {};
    @Input() tabIndex: number;
    checkBoxValue: boolean;
    comboData: any[] = [];
    refService: BaseService<any>;
    errors: any = {};
    comboParam: any;
    firstEdit: boolean = false;
    fieldName: string;
    disabled: boolean = false;
    currencyValue: number;   

    componentRef: any;
    factory: any;

    constructor(private injector: Injector,
        @Inject(ComponentFactoryResolver) private resolver: ComponentFactoryResolver) {        
    }

    ngOnInit() {
        this.fieldName = this.options.name;
        if (this.options.referenceService)
            this.refService = this.injector.get(this.options.referenceService);

        if (this.options.type == ControlType.Combobox) {
            if (this.options.multiple) {
                this.fieldName = this.options.name + 'Array';
                let value = this.model[this.options.name];
                this.model[this.fieldName] = value ? value.split(',') : [];
            }

            if (this.options.referenceService) {
                this.firstEdit = this.options.isEdit ? true : false;
                if (!this.options.loadAfterfield) {
                    var isFunction = this.options.referenceServiceParams && typeof(this.options.referenceServiceParams) === 'function';
                    var refParams = isFunction ? this.options.referenceServiceParams(this.model) : this.options.referenceServiceParams;
                    this.refService.getAsync(refParams, 1, 999).then(res => {
                        this.comboData = res.data;
                        this.comboBoxValueChange({value: this.model[this.fieldName]});
                    });
                }
                else {
                    this.comboParam = {};
                    this.comboParam[this.options.loadAfterfield.paramName] = '';
                    this.firstEdit = true;
                }
            }
            else if (this.options.comboData) {
                this.comboData = this.options.comboData;
                this.comboBoxValueChange({value: this.model[this.fieldName]});
            }
        }

        if (this.options.type == ControlType.Dynamic) {
            this.factory = this.resolver.resolveComponentFactory(this.options.component);
            this.componentRef = this.childContainer.createComponent(this.factory);
            this.model[this.fieldName + '_instance'] = this.componentRef.instance;
            if (this.options.setInput) this.options.setInput(this.componentRef.instance, this.model);
        }

        if (this.options.type == ControlType.Currency || this.options.type == ControlType.Percent) {
            this.currencyValue = this.model[this.options.name];
        }

        this.checkBoxValue = this.model[this.fieldName];
        var curControl = this.parentGroup.get(this.fieldName);
        curControl.statusChanges.subscribe(() => {
            this.onFormValueChange();
        });
    }

    ngOnDestroy(): void {
        if (this.childContainer) this.childContainer.clear();
    }   

    onCheckboxChange(event: MatCheckboxChange) {
        if (this.options.valueType == typeof(Number))
            this.model[this.fieldName] = event.checked ? 1 : 0;
        else 
            this.model[this.fieldName] = event.checked;
    }

    onCheckboxKeyPress(event: any) {
        if (event.keyCode == 13 || event.keyCode == 32) {
            this.checkBoxValue = !this.checkBoxValue;

            if (this.options.valueType == typeof(Number))
                this.model[this.fieldName] = this.checkBoxValue ? 1 : 0;
            else 
                this.model[this.fieldName] = this.checkBoxValue;
        }
            
    }

    comboBoxValueChange(event: any) {
        if (this.options.objectField) {
            let selectedObj = this.comboData.find(x => x[this.options.valueField] == event.value);
            this.model[this.options.objectField] = selectedObj;
        }
        if (this.options.multiple) {
            let value = event.value && event.value.join ? event.value.join(',') : '';
            this.model[this.options.name] = value;
        }
    }

    currencyValueChange(value) {
        var numberValue = undefined;
        if (value) {
            numberValue = Number.parseFloat(`${value}`.replace(/,/g, ''));
        }
        this.model[this.options.name] = numberValue;
    }

    getTextByValue(value: any) {
        var model = this.comboData.find(o => o[this.options.valueField] == value);
        if (model)
            return model[this.options.displayField];
        else
            return '';
    }

    onFormValueChange() {
        this.errors = {};
        const control = this.parentGroup.get(this.fieldName);
        if ( control && control.dirty && !control.valid && !control.pending)
        {
            this.errors = control.errors;
        }

        if (this.options.disabled) {
            var me = this;
            setTimeout(() => {
                me.disabled = me.options.disabled(me.model);
                if (me.disabled)
                    control.disable();
                else 
                    control.enable();
            }, 50);
        }

        if (this.comboParam) {
            const refControl = this.parentGroup.get(this.options.loadAfterfield.name);
            if (StringUtils.isNullOrEmpty(refControl.value)) {
                this.comboData = [];
                if (this.firstEdit) {
                    this.firstEdit = false;
                }
                else {
                    this.model[this.fieldName] = undefined;
                    this.comboBoxValueChange({value: undefined});
                }
                
            }
            else if (refControl.value != this.comboParam[this.options.loadAfterfield.paramName]) {
                this.comboParam[this.options.loadAfterfield.paramName] = refControl.value;
                this.refService.getAsync(this.comboParam, 1, 999).then(res => {
                    this.comboData = res.data;
                    if (this.firstEdit) {
                        this.firstEdit = false;
                        this.comboBoxValueChange({value: this.model[this.fieldName]});
                    }
                    else {
                        this.model[this.fieldName] = undefined;
                        this.comboBoxValueChange({value: undefined});
                    }
                });
            }
        }
    }
}
