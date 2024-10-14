import { error } from '@angular/compiler-cli/src/transformers/util'
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, forwardRef } from '@angular/core'
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MatSelect } from '@angular/material/select'
import _ from 'lodash'

@Component({
  selector: 'ara-select-v2',
  templateUrl: './ara-select-v2.component.html',
  styleUrls: ['./ara-select-v2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AraSelectV2Component),
      multi: true
    }
  ]
})
export class AraSelectV2Component implements OnInit, OnChanges, ControlValueAccessor {
  @Input() items: any[] = []
  @Input() displayField: string[] = ['viewValue']
  @Input() valueField: string = 'value'
  @Input() label: string = ''
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>()
  selectedValue: string
  itemsCopy: any[] = []
  errors: any = {}
   onChanged!: (value: string) => void
   onTouched!: (isTouch: boolean) => void

  ngOnInit(): void {
    this.itemsCopy = this.items
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
  }
  writeValue(value: any): void {
    this.selectedValue = value
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  // Custom methods

  clear(): void {
    this.selectedValue = null
    this.onChange.emit('')
    this.onChanged(this.selectedValue) // Notify FormControl of changes
    this.onTouched(false) // Notify FormControl that it has been touched
  }
  selectionChange(event:any) {
    
    if (this.valueField === 'obj') {
      this.onChanged(event.value)
      this.onChange.emit(event.value)
      return
    }
    this.onChanged(event.value)
    this.onChange.emit(event.value)
    this.onTouched(true)
    console.log(event.value);
    
  }
}
