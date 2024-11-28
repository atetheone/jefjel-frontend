import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '#shared/material/material.module';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-sidenav',
  imports: [MaterialModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.sass'
})
export class SidenavComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  toggle() {
    this.sidenav.toggle();
  }
}
