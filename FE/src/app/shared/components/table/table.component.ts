import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISortChange, ISortOptions } from 'src/app/core/interfaces/common.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() sortOptions: ISortOptions[];
  @Input() defaultField: string;
  @Input() defaultOrder: 'asc' | 'desc';
  @Output() sortChange: EventEmitter<ISortChange> = new EventEmitter<ISortChange>();

  sortBy: any;
  sortOrder: 'asc' | 'desc';

  constructor() {}

  ngOnInit(): void {
    this.sortBy = this.defaultField || null;
    this.sortOrder = this.defaultOrder || 'desc';
  }

  onChange(field: string) {
    if (!field) {
      return;
    }
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    this.sortBy = field;
    this.sortChange.emit({
      order: this.sortOrder,
      sortBy: this.sortBy,
    });
  }
}
