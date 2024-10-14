import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AraFieldComponent } from './components/ara-field/ara-field.component';
import { AraFormComponent } from './components/ara-form/ara-form.component';
import { AraManagementComponent } from './components/ara-management/ara-management.component';
import { RouterModule } from '@angular/router';
import { AraQuickSearchComponent } from './components/ara-quick-search/ara-quick-search.component';
import { StringFormatPipe } from './pipes/stringFormat.pipe';
import { AfterIfDirective } from './directives/after-if.directive';
import { TimeInputDirective } from './directives/time-input.directive';
import { AraDialogComponent } from './components/ara-dialog/ara-dialog.component';
import { AraViewPdfComponent } from './components/ara-view-pdf/ara-view-pdf.component';
import { DateInputDirective } from './directives/date-input.directive';
import { IsNumberInputDirective } from './directives/isnumber-input.directive';
import { ClickStopPropagation } from './directives/stop-propagation.directive';
import { ManagementDefaultHeaderComponent } from './components/ara-management/default-header/default-header.component';
import { ViewTemplateDirective } from './directives/view-template.directive';
import { AraSelectComponent } from './controls/ara-select/ara-select.component';
import { AraAutocompleteComponent } from './controls/ara-autocomplete/ara-autocomplete.component';
import { AraDateTimeComponent } from './controls/ara-datetime/ara-datetime.component';
import { InputTrimDirective } from './directives/input-trim.directive';
import { NumberDirective } from './directives/numbers-only.directive';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { CdkTableModule } from '@angular/cdk/table';
import { AraColorPickerComponent } from './components/ara-color-picker/ara-color-picker.component';
import { AraTreeComponent } from './components/ara-tree/ara-tree.component';
import { AraConfirmDialogComponent } from './components/ara-confirm-dialog/confirm-dialog.component';
import { MomentDateAdapter, MatMomentDateModule } from '@angular/material-moment-adapter';
import { AraTextComponent } from './controls/ara-text/ara-text.component';
import { AraTextareaComponent } from './controls/ara-textarea/ara-textarea.component';
import { AraNumberComponent } from './controls/ara-number/ara-number.component';
import { CheckPermissionDirective } from './directives/action-code.directive';
import { AraInfoComponent } from './controls/ara-info/ara-info.component';
import { AraCurrencyComponent } from './controls/ara-currency/ara-currency.component';
import { AraPercentComponent } from './controls/ara-percent/ara-percent.component';
import { AraViewExcelComponent } from './components/ara-view-excel/ara-view-excel.component';
import { AraMonthComponent } from './controls/ara-month/ara-month.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FileInputComponent } from './components/file-input/file-input.component';
import { UploadFileService } from './services/uploadFile.service';
import { FuseSharedModule } from '@fuse/shared.module';
import { CommonModule } from '@angular/common';
import { AraCheckTreeComponent } from './components/ara-check-tree/ara-check-tree.component';
import { AraYearComponent } from './controls/ara-year/ara-year.component';
import { YearPickerComponent } from './controls/ara-year/year-picker-component/year-picker.component';
import { AraBaseManagementComponent } from './components/ara-base-management/ara-base-management.component';
import { AraBaseAddComponent } from './components/ara-base-add/ara-base-add.component';
import { AraCombotreeComponent } from './controls/ara-combotree/ara-combotree.component';
import { AraAutocompleteGroupComponent } from './controls/ara-autocomplete-group/ara-autocomplete-group.component';
import { AraDateRangeComponent } from './controls/ara-daterange/ara-daterange.component'
import {
    AraAutocompleteV2Component
} from './controls/ara-autocomplete/ara-autocomplete-v2/ara-autocomplete-v2.component'
import { AraDatetimeV2Component } from './controls/ara-datetime/ara-datetime-v2/ara-datetime-v2.component'
import { AraTimeComponent } from './controls/ara-time/ara-time.component'
import { AraSelectV2Component } from './controls/ara-select/ara-select-v2/ara-select-v2.component';

const MY_FORMATS = {
    parse: {
        dateInput: 'L'
    },
    display: {
        dateInput: 'L',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
}

@NgModule({
  declarations: [
    AraFieldComponent,
    AraFormComponent,
    AraManagementComponent,
    AraQuickSearchComponent,
    StringFormatPipe,
    AfterIfDirective,
    TimeInputDirective,
    AraDialogComponent,
    AraViewPdfComponent,
    AraViewExcelComponent,
    FileInputComponent,
    DateInputDirective,
    IsNumberInputDirective,
    ClickStopPropagation,
    ManagementDefaultHeaderComponent,
    ViewTemplateDirective,
    AraSelectComponent,
    AraAutocompleteComponent,
    AraDateTimeComponent,
    InputTrimDirective,
    NumberDirective,
    AraColorPickerComponent,
    AraTreeComponent,
    AraCheckTreeComponent,
    AraConfirmDialogComponent,
    AraTextComponent,
    AraInfoComponent,
    AraTextareaComponent,
    AraNumberComponent,
    AraCurrencyComponent,
    AraPercentComponent,
    AraMonthComponent,
    AraYearComponent,
    YearPickerComponent,
    CheckPermissionDirective,
    AraBaseManagementComponent,
    AraBaseAddComponent,
    AraCombotreeComponent,
    AraAutocompleteGroupComponent,
    AraAutocompleteV2Component,
    AraDateRangeComponent,
    AraDatetimeV2Component,
    AraTimeComponent,
    AraSelectV2Component
  ],
  imports: [
    FuseSharedModule,
    RouterModule,
    MatMomentDateModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    CdkTableModule,
    MatTreeModule,
    NgxMaskModule.forChild(),
    NgxCurrencyModule,
    CommonModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    UploadFileService
  ],
  exports: [
    TranslateModule,
    MatMomentDateModule,
    FontAwesomeModule,
    StringFormatPipe,
    AraFieldComponent,
    AraFormComponent,
    AraManagementComponent,
    AraViewPdfComponent,
    AfterIfDirective,
    TimeInputDirective,
    DateInputDirective,
    IsNumberInputDirective,
    ClickStopPropagation,
    ViewTemplateDirective,
    AraSelectComponent,
    AraAutocompleteComponent,
    AraDateTimeComponent,
    FileInputComponent,
    InputTrimDirective,
    NumberDirective,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    CdkTableModule,
    MatTreeModule,
    AraColorPickerComponent,
    AraTextComponent,
    AraInfoComponent,
    AraTextareaComponent,
    AraNumberComponent,
    AraCurrencyComponent,
    AraPercentComponent,
    AraMonthComponent,
    CheckPermissionDirective,
    AraTreeComponent,
    AraCheckTreeComponent,
    AraYearComponent,
    YearPickerComponent,
    AraBaseManagementComponent,
    AraBaseAddComponent,
    AraCombotreeComponent,
    AraAutocompleteV2Component,
    AraAutocompleteGroupComponent,
    AraDateRangeComponent,
    AraDatetimeV2Component,
    AraTimeComponent,
    AraSelectV2Component
  ],
  entryComponents: [ManagementDefaultHeaderComponent],
  bootstrap: [
    AraConfirmDialogComponent,
    AraFormComponent,
    AraQuickSearchComponent,
    AraViewPdfComponent,
    AraViewExcelComponent,
    AraDialogComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AraCoreModule {}
