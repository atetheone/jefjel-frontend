import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/delivery.service';
import { ToastService } from '#shared/services/toast.service';
import { MaterialModule } from '#shared/material/material.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ZoneService } from '#shared/services/zone.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryResponse } from '#types/delivery';
import { DeliveryZoneResponse } from '#types/zone';

@Component({
  selector: 'app-my-zones',
  imports: [MaterialModule]
  templateUrl: './my-zones.component.html'
})
export class MyZonesComponent implements OnInit {
  loading = false;
  zoneForm: FormGroup;
  selectedZones = new Set<number>();
  
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private zonesSubject = new BehaviorSubject<DeliveryZoneResponse[]>([]);
  private myZonesSubject = new BehaviorSubject<DeliveryZoneResponse[]>([]);

  viewModel$ = combineLatest([
    this.loadingSubject,
    this.zonesSubject,
    this.myZonesSubject
  ]).pipe(
    map(([loading, allZones, myZones]) => ({
      loading,
      allZones,
      myZones
    }))
  );

  constructor(
    private deliveryService: DeliveryService,
    private zoneService: ZoneService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.zoneForm = this.fb.group({});
  }

  ngOnInit() {
    this.loadZones();
  }

  private loadZones() {
    this.loadingSubject.next(true);
    
    // Load all available zones
    this.zoneService.getZones().subscribe({
      next: (zones) => {
        this.zonesSubject.next(zones);
        this.loadMyZones();
      },
      error: (error) => {
        this.loadingSubject.next(false);
        this.toastService.error('Failed to load zones');
      }
    });
  }

  private loadMyZones() {
    this.deliveryService.getMyZones().subscribe({
      next: (myZones) => {
        this.myZonesSubject.next(myZones);
        myZones.forEach(zone => this.selectedZones.add(zone.id));
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.loadingSubject.next(false);
        this.toastService.error('Failed to load your zones');
      }
    });
  }

  isZoneSelected(zoneId: number): boolean {
    return this.selectedZones.has(zoneId);
  }

  toggleZone(zoneId: number) {
    if (this.selectedZones.has(zoneId)) {
      this.selectedZones.delete(zoneId);
    } else {
      this.selectedZones.add(zoneId);
    }
  }

  saveZones() {
    this.loading = true;
    const zoneIds = Array.from(this.selectedZones);

    this.deliveryService.updateMyZones(zoneIds).subscribe({
      next: (zones) => {
        this.loading = false;
        this.toastService.success('Delivery zones updated successfully');
        this.myZonesSubject.next(zones);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error('Failed to update zones');
      }
    });
  }
}