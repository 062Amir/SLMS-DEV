import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  token: string;
  userId: string;

  get loadUpdatePassComp(): boolean {
    return this.userId && this.token ? true : false;
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams['token'] || null;
    this.userId = this.activatedRoute.snapshot.queryParams['id'] || null;
  }
}
