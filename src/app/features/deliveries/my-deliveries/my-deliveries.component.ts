import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../services/delivery.service';
import { ToastService } from '#shared/services/toast.service';
import { MaterialModule } from '#shared/material/material.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ZoneService } from '#shared/services/zone.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryResponse } from '#types/delivery';
import { DeliveryZoneResponse } from '#types/zone';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-deliveries',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './my-deliveries.component.html',
  styles: [`
    .delivery-card
      transition: transform 0.2s

    .delivery-card:hover
      transform: translateY(-2px)
  `]
})
export class MyDeliveriesComponent implements OnInit {
  loading = false;
  selectedStatus = '';
  private deliveriesSubject = new BehaviorSubject<DeliveryResponse[]>([]);
  deliveries$ = this.deliveriesSubject.asObservable();

  constructor(
    private deliveryService: DeliveryService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDeliveries();
  }

  loadDeliveries() {
    this.loading = true;
    this.deliveryService.getMyDeliveries(this.selectedStatus).subscribe({
      next: (deliveries) => {
        this.deliveriesSubject.next(deliveries);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error('Failed to load deliveries');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'primary';
      case 'picked': return 'accent';
      case 'returned': return 'warn';
      default: return 'primary';
    }
  }

  updateStatus(deliveryId: number, status: string) {
    // const dialogRef = this.dialog.open(DeliveryNotesDialog, {
    //   width: '400px',
    //   data: { status }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.deliveryService.updateDeliveryStatus(deliveryId, status, result.notes).subscribe({
    //       next: () => {
    //         this.toastService.success('Delivery status updated successfully');
    //         this.loadDeliveries();
    //       },
    //       error: () => this.toastService.error('Failed to update delivery status')
    //     });
    //   }
    // });
  }
}