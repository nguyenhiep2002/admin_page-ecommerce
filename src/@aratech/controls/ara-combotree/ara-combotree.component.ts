import { Component, OnInit, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { AraFormComponent } from '@aratech/components/ara-form/ara-form.component';
import { AraTreeController } from '@aratech/components/ara-tree/ara-tree.component';
import { CategoryConfig } from '@aratech/models/categoryConfig';
import { PermissionService } from '@aratech/services/permission.service';
import { StringUtils } from '@aratech/utils/stringUtils';
import { TranslatePipe } from '@ngx-translate/core';

export class TreeNode {
    name: string;
    code: string;
    id: string;
    level: number;
    expand: boolean;
    childrens?: TreeNode[];
}

@Component({
    selector: 'ara-combotree',
    templateUrl: './ara-combotree.component.html',
    styleUrls: ['./ara-combotree.component.scss'],
    providers: [TranslatePipe]
})
export class AraCombotreeComponent implements OnInit, OnChanges {
    controller: AraTreeController<any> = new AraTreeController<any>();;;
    @Input() items: any[] = null;
    @Input() label: string;
    @Input() controlName: string;
    @Input() valueField: string = 'value';
    @Input() displayField: string = 'text';
    @Input() parentField: string = 'text';
    @Input() ngModel: any;
    @Input() tabIndex: number;
    @Input() service: any;
    @Input() params: any;
    @Input() emptyIfNonParams: boolean = false;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() group: FormGroup;
    @Input() defaultText: string[];
    @Input() selectIfOnly: boolean = false;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();
    @Output() modelChange: EventEmitter<any> = new EventEmitter();

    @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
    @ViewChild(MatAutocompleteTrigger) auto1: MatAutocompleteTrigger;


    dataNode: any[];
    selected: any = {};
    errors: any = {};
    btnAddId = 'btnAdd';
    btnNewModel: any = {};
    categoryConfig: CategoryConfig;
    showAddButton = false;
    displayText = '';

    @Input() model: any;
    @Input() multiple: boolean = false;
    @Input() hideClearButton: boolean = false;
    @Input() hideAddButton: boolean = true;

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
    
    ngOnChanges(changes: SimpleChanges) {
        if (changes.params) {
            this.loadData();
        }

        if (changes.ngModel) {
            this.onModelChange();
        }
    }

    clear() {
        this.ngModel = undefined;
        if (this.multiple) {
            this.controller.unCheckAll();
        }
        this.onModelChange();
    }

    onSelectionChange(event: any) {
        this.selectionChange.emit(event);
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

    async ngOnInit() {
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

        this.controller.onChange.subscribe((node: TreeNode) => {
            if (!this.multiple) {
                this.onModelChange(node.id);
                this.auto.closePanel();
                this.auto1.closePanel();
            }
        });
    }

    openPanel(auto: MatAutocompleteTrigger) {
        if (!this.readOnly)
            auto.openPanel();
    }

    selectedItem() {
        if (!!this.ngModel) {
            if (Array.isArray(this.items) && this.items.length > 0) {
                return this.items.filter(item => {
                    return item[this.valueField] == this.ngModel;
                })[0];
            }
        }
        else {
            return null;
        }
    }

    async loadData() {
        if (this.service) {
            if (this.emptyIfNonParams && !this.params) {
                this.items = [];
                this.clear();
            }
            else {
                await this.service.get(this.params, 1, 999).then(res => {
                    this.items = res.data;
                    let selected = this.items.filter(x => x[this.valueField] == this.ngModel 
                        || (Array.isArray(this.ngModel) && this.ngModel.indexOf(x[this.valueField]) >= 0)
                        || (this.defaultText && this.defaultText.indexOf(x[this.displayField]) >= 0));

                    if (selected.length == 0) {
                        if (this.selectIfOnly && this.items.length == 1) {
                            this.ngModel = this.items[0][this.valueField];
                        }
                    }
                    else {
                        if (!this.ngModel) {
                            var selectedValues = selected.map(x => x[this.valueField]);
                            this.ngModel = selectedValues[0];
                        }
                    }
                });
            }
        }

        this.dataNode = Object.assign([], this.items);        
        this.mapDataTree();
        this.setExpand();
        this.onModelChange();
    }

    mapDataTree() {
        let datatree: TreeNode[] = [];
        if (this.dataNode != null && this.dataNode.length > 0) {
            var ar = this.dataNode.filter(o => !o.parentId);
            if (ar != null && ar.length > 0) {
                ar.forEach(element => {
                    datatree.push(this.getChild(element, 0));
                });
            }
        }
        this.dataNode = datatree;
        this.controller.initData(this.dataNode);        
    }
    getChild(item: any, level) {
        let node: TreeNode = new TreeNode();
        node.id = item.id;
        node.level = level;
        node.expand = false;
        node.name = item.name;
        node.code = item.code;
        node.childrens = [];
        let arr = this.dataNode.filter(o => o.parentId == node.id);
        if (arr != null && arr.length > 0) {
            arr.forEach(element => {
                node.childrens.push(this.getChild(element, level + 1))
            });
        }
        return node;
    }
    setExpand() {
        setTimeout(() => {
            if (this.dataNode != null && this.dataNode.length > 0) {
                for (let index = 0; index < this.dataNode.length; index++) {
                    const element = this.dataNode[index];
                    element.expand = this.checkExpand(element);
    
                }
            }
        }, 100);
      
    }
    checkExpand(item: TreeNode): boolean {
        if (item.childrens.length > 0) {
            for (let index = 0; index < item.childrens.length; index++) {
                const element = item.childrens[index];
                if (this.ngModel == element.id) {
                    return true;
                }
                let isEx = this.checkExpand(element);
                if (isEx) {
                    element.expand = true;
                    return isEx;
                }
            }
        }
        return false
    }

    onModelChange(data?) {
        if (data) {
            this.ngModel = data;
        }

        if (this.group) {
            const control = this.group.get(this.controlName);
            if (control) {
                control.setValue(this.ngModel);
            }
        }

        this.ngModelChange.emit(this.ngModel);

        if (this.multiple) {
            var selecteds = this.controller.getAllSelected();
            this.modelChange.emit(selecteds);
            this.displayText = selecteds.map(o => o.name).join(', ');
        }
        else {
            let selected = !this.items ? undefined : this.items.find(x => x[this.valueField] == this.ngModel);
            this.modelChange.emit(selected);
            
            if (selected)
                this.displayText = selected[this.displayField];
            else 
                this.displayText = '';
        }
        
    }

    closePanel() {
        if (this.multiple) {
            var selectedIds = this.controller.getAllSelected().map(o => o.id);
            this.onModelChange(selectedIds);
        }
    }
}
