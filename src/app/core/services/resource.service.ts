import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceResponse } from '#types/resource';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataState } from '#types/data_state';
import { ApiResponse } from '#types/api_response';
import { ToastService } from '#app/shared/services/toast.service';
import { UpdateResourceDto } from '#types/resource';
import { environment } from '#env/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/resources`;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  getResources(): Observable<ResourceResponse[]> {
    return this.http
      .get<ApiResponse<ResourceResponse[]>>('/api/resources')
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error loading resources:', error);
          this.toastService.error('Error loading resources: ' + error);
          return throwError(() => error);
        })
      );
  }

  createResource(data: any): Observable<ResourceResponse> {
    return this.http
      .post<ApiResponse<ResourceResponse>>(`${this.apiUrl}`, data)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error creating resource:', error);
          this.toastService.error('Error creating resource: ' + error);
          return throwError(() => error);
        })
      );
  }

  updateResource(
    resourceId: number,
    res: UpdateResourceDto
  ): Observable<ResourceResponse> {
    return this.http
      .put<ApiResponse<ResourceResponse>>(`${this.apiUrl}/${resourceId}`, res)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error updating resource:', error);
          this.toastService.error('Error updating resource: ' + error);
          return throwError(() => error);
        })
      );
  }

  deleteResource(resourceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resourceId}`).pipe(
      catchError((error) => {
        console.log('Error deleting resource:', error);
        this.toastService.error('Error deleting resource: ' + error);
        return throwError(() => error);
      })
    );
  }

  syncPermissions(id: number): Observable<ResourceResponse> {
    return this.http.post<ApiResponse<ResourceResponse>>(`${this.apiUrl}/${id}/sync`, {}).pipe(
      tap(() => this.toastService.success('Permissions synced successfully')),
      map(response => response.data),
      catchError(error => {
        this.toastService.error('Failed to sync permissions');
        return throwError(() => error);
      })
    );
  }
}
