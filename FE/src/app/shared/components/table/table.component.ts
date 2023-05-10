import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SortBy } from 'src/app/app.constants';
import { ISortChange, ISortOptions } from 'src/app/core/interfaces/common.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() sortOptions: ISortOptions[];
  @Input() defaultField: string;
  @Input() defaultOrder: `${SortBy}`;
  @Output() sortChange: EventEmitter<ISortChange> = new EventEmitter<ISortChange>();

  sort: any;
  sortBy: `${SortBy}`;

  get SortBy() {
    return SortBy;
  }

  constructor() {}

  ngOnInit(): void {
    this.sort = this.defaultField || null;
    this.sortBy = this.defaultOrder || SortBy.DESC;
  }

  onChange(field: string) {
    if (!field) {
      return;
    }
    if (this.sort === field) {
      this.sortBy = this.sortBy === SortBy.ASC ? SortBy.DESC : SortBy.ASC;
    }
    this.sort = field;
    this.sortChange.emit({
      sort: this.sort,
      sortBy: this.sortBy,
    });
  }
}
