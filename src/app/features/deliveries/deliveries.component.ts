import { Component } from "@angular/core";
import { MaterialModule } from "#shared/material/material.module";
import { MyDeliveriesComponent } from "./my-deliveries/my-deliveries.component";
import { MyZonesComponent } from "./my-zones/my-zones.component";

@Component({
  selector: 'app-deliveries',
  imports: [MaterialModule, MyDeliveriesComponent, MyZonesComponent],
  template: `
    <mat-tab-group>
      <mat-tab label="My Deliveries">
        <app-my-deliveries></app-my-deliveries>
      </mat-tab>
      <mat-tab label="My Zones">
        <app-my-zones></app-my-zones>
      </mat-tab>
    </mat-tab-group>
  `
})
export class DeliveriesComponent {}