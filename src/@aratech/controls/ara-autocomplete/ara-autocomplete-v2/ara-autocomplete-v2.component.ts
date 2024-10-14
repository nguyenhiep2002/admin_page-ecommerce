import { StringUtils } from '@aratech/utils/stringUtils'
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import _ from 'lodash'

@Component({
  selector: 'ara-autocomplete-v2',
  templateUrl: './ara-autocomplete-v2.component.html',
  styleUrls: ['./ara-autocomplete-v2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AraAutocompleteV2Component,
      multi: true
    }
  ]
})
export class AraAutocompleteV2Component implements OnInit, OnChanges, ControlValueAccessor {
  @Input() displayField: string[] = ['name']
  @Input() valueField: 'obj' | 'id' = 'id'
  @Input() placeholder: string = ''
  @Input() label: string = ''
  @Input() disabled: boolean = false
  @Input() items: any[] = []
  @Input() isShowCount: boolean = true
  @Input() panelWidth: string | number
  @Input() refreshFn: () => Promise<void>
  @Input() dynamicOptionTemplate: TemplateRef<any>
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>()
  onSelectChange: (item: any) => void
  onSelectTouch: (isTouch: boolean) => void

  copyItems: any[] = []
  value: string = ''

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.items) {
      this.copyItems = this.items
    }
  }

  ngOnInit() {
    this.copyItems = this.items
  }

  clear(ref: any, auto: MatAutocomplete) {
    ref.value = ''
    auto.options.forEach((item) => item.deselect())
    this.onSelectChange('')
    this.onChange.emit('')
    this.onSelectTouch(false)
    this.items = this.copyItems
  }

  displayPlaceholder = () => {
    let placeholder = !StringUtils.isNullOrEmpty(this.placeholder)
      ? this.placeholder
      : `Chọn ${this.label.toLowerCase()}`
    return !this.isShowCount ? placeholder : `${placeholder} (${this.items.length})`
  }
  displayWith = (value: any) => value[this.displayField[0]]

  optionSelected(event: MatAutocompleteSelectedEvent) {
    if (this.valueField === 'obj') {
      this.onSelectChange(event.option.value)
      this.onChange.emit(event.option.value)
      return
    }
    this.onSelectChange(event.option.value[this.valueField])
    this.onChange.emit(event.option.value[this.valueField])
    this.onSelectTouch(true)
  }

  inputChange = _.debounce((event: any) => {
    const value = (event.target.value ?? '').trim().toLowerCase()
    this.items = this.copyItems.filter((f) => {
      if (this.displayField.length > 1) {
        return (
          f[this.displayField[0]].toLowerCase().includes(value) || f[this.displayField[1]].toLowerCase().includes(value)
        )
      }
      return f[this.displayField[0]].toLowerCase().includes(value)
    })
  }, 300)

  registerOnChange(fn: any): void {
    this.onSelectChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onSelectTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  writeValue(obj: any): void {
    this.value = obj?.trim() ?? ''
  }
}
