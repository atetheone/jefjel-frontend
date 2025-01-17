import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { NavbarComponent } from "#shared/components/navbar/navbar.component";
import { FooterComponent } from '#shared/components/footer/footer.component'
import { BreadcrumbComponent } from '#shared/components/breadcrumb/breadcrumb.component';
import { MaterialModule } from '#app/shared/material/material.module';

@Component({
  selector: 'app-default-layout',
  imports: [
    RouterOutlet,
    NavbarComponent, 
    FooterComponent, 
    MaterialModule,
    BreadcrumbComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.sass'
})
export class DefaultLayoutComponent {

}