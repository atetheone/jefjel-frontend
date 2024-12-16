import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module'
import { AuthService } from '#services/auth.service'
import { MenuItem, MenuResponse } from '#types/menu'
import { MenuService } from '#services/menu.service'



@Component({
  selector: 'app-sidenav',
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.sass'
})
export class SidenavComponent implements OnInit {
  @Input() isExpanded = true;
  menuItems$: Observable<MenuItem[]>;

  constructor(
    private menuService: MenuService,
    // private authService: AuthService,
    // private router: Router
  ) {
    this.menuItems$ = this.menuService.menu$;
  }

  ngOnInit(): void {
    this.menuService.loadMenu();
  }

}
