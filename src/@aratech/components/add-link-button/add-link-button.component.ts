import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'add-link-button',
    templateUrl: './add-link-button.component.html',
    styleUrls: ['./add-link-button.component.scss']
})
export class AddLinkButtonComponent implements OnInit {
    @Input() buttonTitle: string;
    // @Output() click: EventEmitter<any> = new EventEmitter();
    
    constructor() { }

    ngOnInit(): void {
    }

    // onClick() {
    //     this.click.emit();
    // }
}
