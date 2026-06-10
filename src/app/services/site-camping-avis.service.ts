import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Avis, SiteRating } from '../models/camping-models';

@Injectable({
  providedIn: 'root'
})
export class SiteCampingAvisService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/avis`; // Adjust according to backend API

  getAvisBySite(siteId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.baseUrl}/site/${siteId}`);
  }

  addAvis(avis: Avis): Observable<Avis> {
    return this.http.post<Avis>(`${this.baseUrl}/add`, avis);
  }
}
