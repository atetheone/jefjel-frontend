import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router'
import { MaterialModule } from '#shared/material/material.module'
import { AuthService } from '#services/auth.service'
import { MenuItem } from '#types/menu'
import { MenuService } from '#services/menu.service'
@Component({
  selector: 'app-sidenav',
  imports: [MaterialModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.sass'
})
export class SidenavComponent implements OnInit {
  @Input() isExpanded = true;
  menuItems: MenuItem[] = [];

  constructor(
    private menuService: MenuService,
    // private authService: AuthService,
    // private router: Router
  ) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems();
  }


}
