import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DeliveryService } from '#shared/services/delivery.service';
import { DeliveryPersonService } from '#shared/services/delivery-person.service';
import { ToastService } from '#shared/services/toast.service';
import { DeliveryResponse, DeliveryPersonResponse } from '#types/delivery';
import { DataState } from '#types/data_state';

@Component({
  selector: 'app-delivery-management',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <!-- Header with Actions -->
      <div class="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Delivery Management</h1>
        <div class="flex items-center gap-4">
          <mat-form-field class="w-80">
            <mat-label>Search Deliveries</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
          
          <button mat-raised-button color="primary" (click)="openAssignDeliveryDialog()">
            <mat-icon>local_shipping</mat-icon>
            Assign Delivery
          </button>
        </div>
      </div>

      <!-- Deliveries Table -->
      @if (viewModel$ | async; as vm) {
        @switch (vm.status) {
          @case ('loading') {
            <div class="flex justify-center p-8">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          }
          @case ('error') {
            <div class="text-center p-8">
              <mat-icon class="text-6xl text-red-500">error_outline</mat-icon>
              <p class="mt-2">{{ vm.error }}</p>
              <button mat-raised-button color="primary" class="mt-4" (click)="loadDeliveries()">
                Retry
              </button>
            </div>
          }
          @case ('success') {
            @if (vm.data!.length) {
              <table mat-table [dataSource]="dataSource" matSort class="w-full">
                <!-- Order ID Column -->
                <ng-container matColumnDef="orderId">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Order ID</th>
                  <td mat-cell *matCellDef="let delivery">{{ delivery.orderId }}</td>
                </ng-container>

                <!-- Delivery Person Column -->
                <ng-container matColumnDef="deliveryPerson">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Delivery Person</th>
                  <td mat-cell *matCellDef="let delivery">
                    {{ delivery.deliveryPerson?.user?.firstName }} 
                    {{ delivery.deliveryPerson?.user?.lastName }}
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                  <td mat-cell *matCellDef="let delivery">
                    <mat-chip [color]="getStatusColor(delivery)" selected>
                      {{ getStatusLabel(delivery) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Assigned At Column -->
                <ng-container matColumnDef="assignedAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Assigned At</th>
                  <td mat-cell *matCellDef="let delivery">
                    {{ delivery.assignedAt | date:'medium' }}
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let delivery">
                    <button mat-icon-button [matMenuTriggerFor]="menu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #menu="matMenu">
                      <button mat-menu-item (click)="viewDeliveryDetails(delivery)">
                        <mat-icon>visibility</mat-icon>
                        <span>View Details</span>
                      </button>
                      <button mat-menu-item (click)="updateDeliveryStatus(delivery)">
                        <mat-icon>update</mat-icon>
                        <span>Update Status</span>
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr 
                  mat-row 
                  *matRowDef="let row; columns: displayedColumns;"
                  class="hover:bg-gray-100 cursor-pointer"
                ></tr>
              </table>

              <mat-paginator 
                [pageSizeOptions]="[5, 10, 25]"
                aria-label="Select page of deliveries"
                showFirstLastButtons
              ></mat-paginator>
            } @else {
              <div class="text-center p-8">
                <mat-icon class="text-6xl text-gray-400">local_shipping</mat-icon>
                <p class="mt-2 text-gray-600">No deliveries found</p>
              </div>
            }
          }
        }
      }
    </div>
  `
})
export class DeliveryManagementComponent implements OnInit {
  private deliveriesSubject = new BehaviorSubject<DataState<DeliveryResponse[]>>({
    status: 'loading',
    data: [],
    error: null
  });
  viewModel$ = this.deliveriesSubject.asObservable();
  
  displayedColumns: string[] = ['orderId', 'deliveryPerson', 'status', 'assignedAt', 'actions'];
  dataSource = new MatTableDataSource<DeliveryResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  destroy$: any;

  constructor(
    private deliveryService: DeliveryService,
    private deliveryPersonService: DeliveryPersonService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDeliveries();
  }

  ngAfterViewInit() {
    this.viewModel$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.dataSource = new MatTableDataSource(state.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadDeliveries() {
    this.deliveriesSubject.next({ status: 'loading', data: [], error: null });

    this.deliveryService.getMyDeliveries().subscribe({
      next: (response) => {
        this.deliveriesSubject.next({
          status: 'success',
          data: response.data,
          error: null
        });
      },
      error: (error) => {
        this.deliveriesSubject.next({
          status: 'error',
          data: [],
          error: 'Failed to load deliveries'
        });
        console.error('Error loading deliveries:', error);
      }
    });
  }

  getStatusColor(delivery: DeliveryResponse): string {
    if (delivery.deliveredAt) return 'primary';
    if (delivery.pickedAt) return 'accent';
    return 'warn';
  }

  getStatusLabel(delivery: DeliveryResponse): string {
    if (delivery.deliveredAt) return 'Delivered';
    if (delivery.pickedAt) return 'In Progress';
    if (delivery.assignedAt) return 'Assigned';
    return 'Pending';
  }



  openAssignDeliveryDialog() {
    const dialogRef = this.dialog.open(AssignDeliveryDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.assignDelivery(result);
        }
      });
  }

  assignDelivery(data: { orderId: number; deliveryPersonId: number }) {
    this.deliveryService.assignDelivery(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.success('Delivery assigned successfully');
          this.loadDeliveries();
        },
        error: (error) => {
          this.toastService.error('Failed to assign delivery');
          console.error('Error assigning delivery:', error);
        }
      });
  }

  updateDeliveryStatus(delivery: DeliveryResponse) {
    const dialogRef = this.dialog.open(UpdateDeliveryStatusDialogComponent, {
      width: '500px',
      data: { delivery }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.updateStatus(delivery.id, result.status, result.notes);
        }
      });
  }

  updateStatus(deliveryId: number, status: string, notes?: string) {
    this.deliveryService.updateDeliveryStatus(deliveryId, status, notes)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.success('Delivery status updated successfully');
          this.loadDeliveries();
        },
        error: (error) => {
          this.toastService.error('Failed to update delivery status');
          console.error('Error updating delivery status:', error);
        }
      });
  }

  viewDeliveryDetails(delivery: DeliveryResponse) {
    this.dialog.open(DeliveryDetailsDialogComponent, {
      width: '600px',
      data: { delivery }
    });
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}