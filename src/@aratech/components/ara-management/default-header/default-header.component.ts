import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    template: ''
  })
export class ManagementBaseHeaderComponent {
    @Input() configs: any;
    @Input() params: any;
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
    @Output() onAdd: EventEmitter<any> = new EventEmitter();
}

@Component({
    selector: 'management-default-header',
    templateUrl: './default-header.component.html',
    styleUrls: ['./default-header.component.scss'],
    providers: [TranslatePipe],
    animations: fuseAnimations
})
export class ManagementDefaultHeaderComponent implements ManagementBaseHeaderComponent, OnInit, OnChanges {
    @Input() configs: any;
    @Input() params: any;
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
    @Output() onAdd: EventEmitter<any> = new EventEmitter();

    searchText = '';
    defaultParams: any;
    useBackButton: boolean;

    constructor(private location: Location) { }

    ngOnInit() {
        this.useBackButton = this.params ? true : false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.params) {
            this.useBackButton = this.params ? true : false;
        }
    }

    back() {
        this.location.back();
    }

    search(keyCode: Number) {
        if (keyCode == 13) {
            let params = Object.assign({}, this.defaultParams);
            params.search = this.searchText;
            // params.type = this.configs.type;

            // if (this.configs.expandFields)
            //     params['expand'] = this.configs.expandFields

            this.onSearch.emit(params);
        }
    }

    add() {
        this.onAdd.emit();
    }
}
