import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '#shared/material/material.module';
import { TenantService } from './services/tenant.service';
import { TenantResponse } from '#types/tenant';
import { catchError, throwError, BehaviorSubject, map, of } from 'rxjs';
import { DataState } from '#types/data_state';


@Component({
  selector: 'app-tenants',
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.sass'

})
export class TenantsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'slug', 'domain', 'status'];
  dataSource = new MatTableDataSource<TenantResponse>();

  private tenantsSubject = new BehaviorSubject<DataState<TenantResponse[]>>({
    status: 'idle',
    error: null
  });
  viewModel$ = this.tenantsSubject.asObservable();

  errorMessage: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  ngAfterViewInit() {
    this.viewModel$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.dataSource = new MatTableDataSource(state.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  loadTenants() {
    this.tenantsSubject.next({ status: 'loading', error: null });

    this.tenantService.getTenants().pipe(
      map(response => {
        console.table(response.data);
        return {
          status: 'success' as const,
          data: response.data,
          error: null
        }
      }),
      catchError(error => of({
        status: 'error' as const,
        error: error.message
      }))
    ).subscribe(state => {
      this.tenantsSubject.next(state);
    })
  }

  navigateToTenantDetails(tenantId: number) {
    this.router.navigate(['/dashboard/tenants', tenantId])
  }

}
