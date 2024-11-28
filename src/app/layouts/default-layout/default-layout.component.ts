import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { NavbarComponent } from "#shared/navbar/navbar.component";

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.sass'
})
export class DefaultLayoutComponent {

}
