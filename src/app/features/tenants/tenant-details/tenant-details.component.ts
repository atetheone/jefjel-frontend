import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '#shared/services/toast.service';
import { TenantService } from '../services/tenant.service';
import { TenantResponse, TenantDetails } from '#types/tenant';
import { catchError, BehaviorSubject, map, of } from 'rxjs';
import { DataState } from '#types/data_state';


@Component({
  selector: 'app-tenant-details',
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './tenant-details.component.html',
  styleUrl: './tenant-details.component.sass'
})
export class TenantDetailsComponent implements OnInit {
  private tenantSubject = new BehaviorSubject<DataState<TenantResponse>>({
    status: 'idle',
    error: null
  });

  tenantDetails$ = this.tenantSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTenantDetails();

  }

  loadTenantDetails() {
    const tenantId = this.route.snapshot.params['id'];

    this.tenantSubject.next({ status: 'loading', error: null });

    this.tenantService.getTenantById(tenantId).pipe(
      map(response => {
        console.table(response.data);
        return {
          status: 'success' as const,
          data:  response.data,
          error: null
        }
      }),
      catchError(error => of({
        status: 'error' as const,
        error: error.message || 'Failed to load tenant details'
      })),
    ) .subscribe(state => this.tenantSubject.next(state))
;
  }

  editTenant() {
    const tenantId = this.route.snapshot.params['id'];
    this.router.navigate(['/dashboard/tenants/create', tenantId ])
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Tenant',
        message: `Are you sure you want to delete tenant ${this.tenantSubject.value.data!.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTenant();
      }
    });
  }

  private deleteTenant() {
    const tenantId = this.tenantSubject.value.data!.id;
    this.tenantService.deleteTenant(tenantId).subscribe({
      next: (response) => {
        this.toastService.success(response.message)
        this.router.navigate(['/dashboard/tenants']);
      },
      error: (error) => {
        this.toastService.error(error.message)
        console.error('Failed to delete tenant', error);
      }
    });
  }
}