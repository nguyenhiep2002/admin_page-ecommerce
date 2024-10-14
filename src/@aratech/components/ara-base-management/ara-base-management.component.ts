import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
    selector: 'ara-base-management',
    templateUrl: './ara-base-management.component.html',
    styleUrls: ['./ara-base-management.component.scss'],
    providers: [TranslatePipe],
    animations: fuseAnimations
})
export class AraBaseManagementComponent implements OnInit {

    @Input() icon: string;
    @Input() headerTitle: string;
    @Input() subTitle: string;
    @Input() actionCode: string;
    @Input() searchText: string;
    @Input() return: boolean = false;
    @Input() showButtonAdd: boolean = true;
    @Input() showAdvancedButton: boolean = false;
    @Input() showAdvanced: boolean = false;
    @Output() searchTextChange: EventEmitter<any> = new EventEmitter();
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
    @Output() onAdd: EventEmitter<any> = new EventEmitter();
    @Output() showAdvancedChange: EventEmitter<any> = new EventEmitter();

    defaultParams: any;
    useBackButton: boolean = false;
    limitFutureYear: any = new Date();
    yearPlan: any = new Date();
    constructor(
        private location: Location
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        
    }

    back() {
        this.location.back();
    }

    searchChange() {
        this.searchTextChange.emit(this.searchText);
    }

    search(keyCode: Number) {
        if (keyCode == 13) {
            this.onSearch.emit(this.searchText);
        }
    }

    add() {
        this.onAdd.emit();
    }

    showAdvancedSearch() {
        this.showAdvanced = !this.showAdvanced;
        this.showAdvancedChange.emit(this.showAdvanced);
    }
}
