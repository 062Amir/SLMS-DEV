import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-img',
  templateUrl: './user-img.component.html',
  styleUrls: ['./user-img.component.css'],
})
export class UserImgComponent implements OnInit {
  @Input() imgSize: number = 40;
  @Input() imagePath: string | undefined;

  constructor() {}

  ngOnInit(): void {}
}
