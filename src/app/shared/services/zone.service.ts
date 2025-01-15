import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { DeliveryZoneResponse } from '#types/zone';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  zoneApiUrl = `${environment.apiUrl}/zones`

  constructor(
    private http: HttpClient
  ) { }

  getZones(): Observable<DeliveryZoneResponse[]> {
    return this.http.get<ApiResponse<DeliveryZoneResponse[]>>(this.zoneApiUrl)
      .pipe(
        map(response => response.data)
      );
  }
}
