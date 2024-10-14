import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ara-base-add',
  templateUrl: './ara-base-add.component.html',
  styleUrls: ['./ara-base-add.component.scss']
})
export class AraBaseAddComponent implements OnInit {
    @Input() icon: string;
    @Input() headerTitle: string;
    @Input() subTitle: string;
    @Input() actionCode: string;
    @Input() searchText: string;
  useBackButton = false;
  constructor() { }

  ngOnInit(): void {
  }

}
