import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.sass',
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$!: Observable<Breadcrumb[]>;

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbs$ = this.breadcrumbService.generateBreadcrumbs();
  }
}
