import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "#app/shared/material/material.module";
import { ResourceService } from "#services/resource.service";
import { ToastService } from '#shared/services/toast.service';
import { ResourceResponse, UpdateResourceDto } from "#types/resource";
import { catchError, throwError, BehaviorSubject, map, of } from "rxjs";
import { DataState } from "#types/data_state";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ConfirmDialogComponent } from "#app/shared/components/confirm-dialog/confirm-dialog.component";
import { ResourceDialogComponent } from "./resource-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.component.html',
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ResourcesListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'description', 'actions', 'status', 'manage'];
  dataSource: MatTableDataSource<ResourceResponse>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private resourceService: ResourceService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {
    this.dataSource = new MatTableDataSource<ResourceResponse>();
  }

  ngOnInit() {
    this.loadResources();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadResources() {
    this.resourceService.getResources().subscribe({
      next: (response: ResourceResponse[]) => {
        this.dataSource.data = response;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getActionColor(action: string): string | undefined {
    switch (action) {
      case 'create': return 'primary';
      case 'delete': return 'warn';
      case 'update': return 'accent';
      default: return undefined;
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ResourceDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.loadResources();
    });
  }

  openEditDialog(resource: ResourceResponse) {
    const dialogRef = this.dialog.open(ResourceDialogComponent, {
      width: '600px',
      data: { resource, title: 'Edit Resource' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.loadResources();
    });
  }

  toggleStatus(resource: ResourceResponse) {
    const update: UpdateResourceDto = {
      isActive: !resource.isActive
    };

    this.resourceService.updateResource(resource.id, update).subscribe({
      next: () => {
        this.toastService.success('Resource status updated successfully');
        this.loadResources();
      },
      error: () => this.toastService.error('Failed to update resource status')
    });
  }

  syncPermissions(resource: ResourceResponse) {
    this.resourceService.syncPermissions(resource.id).subscribe({
      next: () => {
        this.toastService.success('Resource permissions synced successfully');
        this.loadResources();
      },
      error: () => this.toastService.error('Failed to sync permissions')
    });
  }

  confirmDelete(resource: ResourceResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Resource',
        message: `Are you sure you want to delete the resource "${resource.name}"? This will also delete all associated permissions.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.resourceService.deleteResource(resource.id).subscribe({
          next: () => {
            this.toastService.success('Resource deleted successfully');
            this.loadResources();
          },
          error: () => this.toastService.error('Failed to delete resource')
        });
      }
    });
  }
}