import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { Observable } from 'rxjs';
import { AuthService } from '#services/auth.service';
import { UserResponse } from '#types/user';



@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<UserResponse>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.user$
  }

  ngOnInit() {
    this.authService.getUser().subscribe();
  }

}
