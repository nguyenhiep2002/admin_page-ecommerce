import { Component, OnInit, ContentChild, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AraFormComponent } from '../ara-form/ara-form.component';
import { ActivatedRoute } from '@angular/router';
import { CategoryGridAction, CategoryConfig } from '../../models/categoryConfig';
import { Location } from '@angular/common';
import { ManagementDefaultHeaderComponent, ManagementBaseHeaderComponent } from './default-header/default-header.component';
import { ViewTemplateDirective } from '../../directives/view-template.directive';
import { ComboboxFieldConfig } from '../../models/comboboxFieldConfig';
import { BaseService } from '@aratech/services/base.service';
import { StringUtils } from '@aratech/utils/stringUtils';
import { Configs } from '@aratech/utils/configs';
import { AraConfirmDialogComponent } from '../ara-confirm-dialog/confirm-dialog.component';
import { Guid } from '@aratech/utils/guid';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'ara-management',
    templateUrl: './ara-management.component.html',
    styleUrls: ['./ara-management.component.scss'],
    providers: [TranslatePipe],
    animations: fuseAnimations
})
export class AraManagementComponent implements OnInit {
    @ViewChild(ViewTemplateDirective, {static: true}) header: ViewTemplateDirective;

    itemDetail: any = {};
    searchText = '';
    displayedColumns: any[] = [];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    service: BaseService<any>;
    length: number = 0;
    pageIndex: number = 0;
    pageSize: number = Configs.getConfig('Paging_Size');
    pageSizeOptions = Configs.getConfig('Paging_SizeOptions');
    configs: CategoryConfig;
    customActions: CategoryGridAction[];
    defaultParams: any;
    useBackButton: boolean;
    actionsColumnWidth: number = 50;
    selectedItem: any;
    selectedId: any;
    currentParams: any;
    category: any;
    faCopy = faCopy;
    constructor(public dialog: MatDialog
        , private location: Location
        , public snackBar: MatSnackBar
        , private translate: TranslatePipe
        , private route: ActivatedRoute
        , private componentFactoryResolver: ComponentFactoryResolver) {
        this.route.data.subscribe((data: { category: { service: BaseService<any>, configs: CategoryConfig, params: any } }) => {
            this.category = data.category;
            this.service = data.category.service;
            this.configs = data.category.configs;
            this.defaultParams = data.category.params ? data.category.params : {};
            this.useBackButton = data.category.params ? true : false;
            this.customActions = data.category.configs.gridActions;
            this.actionsColumnWidth = this.calcualteActionsColumnWidth();
            let displayedColumns = this.configs.fields.filter(x => x.showInGrid).map(x => x.name);
            displayedColumns.unshift('id');
            displayedColumns.unshift('hiddenFirst');
            displayedColumns.push('actions');
            displayedColumns.push('hiddenLast');
            this.displayedColumns = displayedColumns;            
            this.fetch();
        });
    }

    ngOnInit() {
        this.loadHeaderComponent();
    }

    back() {
        this.location.back();
    }

    fetch() {
        if (!this.currentParams) {
            this.currentParams = Object.assign({}, this.defaultParams);
            // this.currentParams.type = this.configs.type;

            // if (this.configs.expandFields)
            //     this.currentParams['expand'] = this.configs.expandFields
        }

        if (this.configs.noPaging) {
            this.pageSize = 9999;
            this.pageIndex = 0;
        }

        this.service.get(this.currentParams, this.pageIndex + 1, this.pageSize).then(rs => {
            this.length = rs.totalCount;
            this.dataSource.data = rs.data;
        });
    }

    selectRow(item: any) {
        this.selectedItem = item;
        this.selectedId = item.id;
    }

    openDialog(item: any, actionConfig: CategoryGridAction) {
        this.itemDetail = item;
        let data = {
            item: item,
            title: actionConfig.title,
            width: actionConfig.dialogWidth
        };

        if (actionConfig.dynamicConfig) {
            for (var property in actionConfig.dynamicConfig) {
                data[property] = actionConfig.dynamicConfig[property]
            }
        }

        let dialogRef = this.dialog.open(actionConfig.component, {
            panelClass: 'child-no-padding',
            disableClose: true,
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && actionConfig.refreshAfterSuccess) {
                this.fetch();
            }
        });
    }

    add() {
        this.itemDetail = Object.assign({}, this.defaultParams);
        let dialogRef = this.dialog.open(AraFormComponent, {
            panelClass: 'child-no-padding',
            disableClose: true,
            data: {
                item: this.itemDetail,
                service: this.service,
                categoryConfig: this.category,
                options: {
                    title: StringUtils.format(this.translate.transform('Category.AddTitle'), this.translate.transform(this.configs.name)),
                    minWidth: this.configs.minWidth ? this.configs.minWidth : this.configs.columns == 2 ? '900px' : '540px',
                    width: this.configs.width,
                    columns: this.configs.columns
                },
                fields: this.configs.fields,
                objectFields: this.configs.objectFields
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fetch();
            }
        });
    }

    edit(item: any) {
        this.itemDetail = item;
        let dialogRef = this.dialog.open(AraFormComponent, {
            panelClass: 'child-no-padding',
            disableClose: true,
            data: {
                isEdit: true,
                item: this.itemDetail,
                service: this.service,
                categoryConfig: this.category,
                options: {
                    title: StringUtils.format(this.translate.transform('Category.EditTitle'), this.translate.transform(this.configs.name)),
                    minWidth: this.configs.minWidth ? this.configs.minWidth : this.configs.columns == 2 ? '900px' : '540px',
                    width: this.configs.width,
                    columns: this.configs.columns
                },
                fields: this.configs.fields,
                objectFields: this.configs.objectFields
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fetch();
            }
        });
    }

    copy(item: any) {
        let itemCopy = Object.assign({}, item);
        itemCopy.id = '';
        if (this.configs.beforeCopy) {
            this.configs.beforeCopy(itemCopy);
        }
        let dialogRef = this.dialog.open(AraFormComponent, {
            panelClass: 'child-no-padding',
            disableClose: true,
            data: {
                isEdit: false,
                item: itemCopy,
                service: this.service,
                categoryConfig: this.category,
                options: {
                    title: StringUtils.format(this.translate.transform('Category.CopyTitle'), this.translate.transform(this.configs.name)),
                    minWidth: this.configs.minWidth ? this.configs.minWidth : this.configs.columns == 2 ? '900px' : '540px',
                    width: this.configs.width,
                    columns: this.configs.columns
                },
                fields: this.configs.fields,
                objectFields: this.configs.objectFields
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fetch();
            }
        });
    }

    pageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.fetch();
    }

    search(params: any) {
        this.pageIndex = 0;
        this.currentParams = params;
        this.fetch();
    }

    delete(item: any) {
        let confirmDialogRef = this.dialog.open(AraConfirmDialogComponent, {
            disableClose: false
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Common.Msg.DeleteConfirm';
        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.delete(item.id).then(rs => {
                    this.snackBar.open(this.translate.transform('Common.Msg.DeleteSuccess'), 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });
                    this.fetch();
                },
                    err => {
                        if (err.message == "Using") {
                            this.snackBar.open(this.translate.transform('Common.Msg.DeleteErrorUsing'), 'OK', {
                                verticalPosition: 'top',
                                duration: 2000
                            });
                        }
                        else {
                            this.snackBar.open(this.translate.transform('Common.Msg.DeleteError'), 'OK', {
                                verticalPosition: 'top',
                                duration: 2000
                            });
                        }
                    });
            }
        });
    }

    calcualteActionsColumnWidth() {
        let width = (this.configs.gridActions ? this.configs.gridActions.length : 0) * 40;
        return width < 20 ? 140 : (width + 140);
    }

    doAction(item: any, actionConfig: CategoryGridAction) {
        actionConfig.resolve(item).then(() => {
            this.processResponse(true);
            if (actionConfig.refreshAfterSuccess)
                this.fetch();
        }).catch(err => {
            this.processResponse(false);
        });
    }

    processResponse(res) {
        if (res) {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateSuccess'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        }
        else {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateError'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        }
    }

    checkActionDisable(item: any, actionConfig: CategoryGridAction) {
        if (!actionConfig.disabled)
            return false;

        return actionConfig.disabled(item);
    }

    loadHeaderComponent() {        
        let component = this.configs.headerComponent ? this.configs.headerComponent : ManagementDefaultHeaderComponent;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    
        const viewContainerRef = this.header.viewContainerRef;
        viewContainerRef.clear();
    
        const componentRef = viewContainerRef.createComponent(componentFactory);
        let headerComponent = (<ManagementBaseHeaderComponent>componentRef.instance);
        headerComponent.configs = this.configs;
        headerComponent.params = this.category.params;
        headerComponent.onSearch.subscribe(params => {
            this.search(params);
        });
        headerComponent.onAdd.subscribe(() => {
            this.add();
        });
    }

    getDisplayTextFromComboData(value, fieldConfig: ComboboxFieldConfig) {
        let item = fieldConfig.comboData.find(x => x[fieldConfig.valueField] == value);
        return item ? 
        (fieldConfig.translate ? this.translate.transform(item[fieldConfig.displayField]) : item[fieldConfig.displayField]) 
        : value;
    }
}
