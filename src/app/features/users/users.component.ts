import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component'
import { MaterialModule } from '#shared/material/material.module';
import { UserService } from '#features/users/services/user.service'; 
import { User, UserResponse } from '#types/user';
import { ApiResponse } from '#types/api_response';
import { RoleResponse } from '#app/core/types/role';

import { catchError, throwError, BehaviorSubject, map, of } from 'rxjs';
import { DataState } from '#types/data_state';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-users',
  imports: [MaterialModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.sass'
})
export class UsersComponent implements OnInit {
  // Track error state
  isLoading = false;
  hasError = false;
  displayedColumns: string[] = ['username', 'email', 'firstName', 'lastName', 'roles'];

  dataSource = new MatTableDataSource<UserResponse>();
  
  private usersSubject = new BehaviorSubject<DataState<UserResponse[]>>({
    status: 'idle',
    error: null
  });

  viewModel$ = this.usersSubject.asObservable();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchControl = new FormControl('');

  constructor(
    private userService: UserService,
    private router: Router
  ) { 
    // Set up search filter
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.applyFilter(value || '');
      });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.viewModel$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.dataSource = new MatTableDataSource(state.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: UserResponse, filter: string) => {
      return data.username.toLowerCase().includes(filter) ||
             data.email.toLowerCase().includes(filter) ||
             data.firstName.toLowerCase().includes(filter) ||
             data.lastName.toLowerCase().includes(filter) ||
             data.roles.some(role => role.name.toLowerCase().includes(filter));
    };
    this.dataSource.filter = filterValue;
  }

  loadUsers() {
    this.usersSubject.next({ status: 'loading', error: null });

    this.userService.getUsers()
      .pipe(
        map((response) => {

          return {
            status: 'success' as const,
            data: response.data,
            error: null
          }
        }),
        catchError((error) => of({
          status: 'error' as const,
          error: error.message
        }))
      ).subscribe(state => {
        this.usersSubject.next(state);
      })
  }

  navigateToUserDetails(userId: number) {
    this.router.navigate(['/dashboard/users', userId]);
  }

}
