import { Injectable, Inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = 'Items per page';
  nextPageLabel     = 'Next page';
  previousPageLabel = 'Previous page';

  constructor(private translate: TranslateService) {
      super();
      this.translate.onLangChange.subscribe((e: Event) => {
        this.getAndInitTranslations();
      });
  
      this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.translate.get(['Common.ItemsPerPage', 'Common.NextPage', 'Common.PreviousPage']).subscribe(translation => {
      this.itemsPerPageLabel = translation['Common.ItemsPerPage'];
      this.nextPageLabel = translation['Common.NextPage'];
      this.previousPageLabel = translation['Common.PreviousPage'];
      this.changes.next();
    });
  }

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  };

}
