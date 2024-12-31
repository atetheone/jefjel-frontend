import { Component } from '@angular/core';
import { MaterialModule } from '#shared/material/material.module'

@Component({
  selector: 'app-footer',
  imports: [MaterialModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent {

}
