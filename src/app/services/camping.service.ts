import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SiteCamping {
  idSite?: number;
  nom: string;
  localisation: string;
  capacite: number;
  prixParNuit: number;
  imageUrl?: string;
  description: string;
  statutDispo: 'DISPONIBLE' | 'FERME' | 'COMPLET';
  ownerId?: string;
}

export interface InscriptionSite {
  idInscription?: number;
  dateDebut: string;
  dateFin: string;
  numberOfGuests: number;
  statut?: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';
  siteId: number;
  utilisateurId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/site-camping`;
  private bookingUrl = `${environment.apiUrl}/inscriptionsite`;

  // --- Camping Sites ---

  getAllCampings(): Observable<SiteCamping[]> {
    return this.http.get<SiteCamping[]>(`${this.baseUrl}/getAll`);
  }

  getCampingById(id: number): Observable<SiteCamping> {
    return this.http.get<SiteCamping>(`${this.baseUrl}/getsite/${id}`);
  }

  addCamping(site: SiteCamping): Observable<SiteCamping> {
    return this.http.post<SiteCamping>(`${this.baseUrl}/addSite`, site);
  }

  getMySites(): Observable<SiteCamping[]> {
    return this.http.get<SiteCamping[]>(`${this.baseUrl}/my-sites`);
  }

  // --- Bookings ---

  bookCamping(booking: Partial<InscriptionSite>): Observable<InscriptionSite> {
    return this.http.post<InscriptionSite>(`${this.bookingUrl}/add`, booking);
  }

  getMyBookings(userId: string): Observable<InscriptionSite[]> {
    return this.http.get<InscriptionSite[]>(`${this.bookingUrl}/my-inscriptions/${userId}`);
  }
}
