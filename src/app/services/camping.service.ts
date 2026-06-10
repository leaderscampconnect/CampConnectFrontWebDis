import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CampingSite, CampingSiteCreatePayload, SiteAvailability, SiteBooking } from '../models/camping-models';


@Injectable({
  providedIn: 'root'
})
export class CampingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/site-camping`;
  private bookingUrl = `${environment.apiUrl}/inscriptionsite`;

  // --- Camping Sites ---
  
  getAllCampingSites(): Observable<CampingSite[]> {
    return this.http.get<CampingSite[]>(`${this.baseUrl}/getAll`);
  }

  getCampingSiteById(id: number): Observable<CampingSite> {
    return this.http.get<CampingSite>(`${this.baseUrl}/getsite/${id}`);
  }

  addCampingSite(site: CampingSiteCreatePayload | FormData): Observable<CampingSite> {
    return this.http.post<CampingSite>(`${this.baseUrl}/addSite`, site);
  }

  updateCampingSite(id: number, site: CampingSiteCreatePayload | FormData): Observable<CampingSite> {
    return this.http.patch<CampingSite>(`${this.baseUrl}/updateSite/${id}`, site);
  }

  closeCampingSite(id: number): Observable<CampingSite> {
    return this.http.patch<CampingSite>(`${this.baseUrl}/close/${id}`, {});
  }

  getMyCampingSites(ownerId: number): Observable<CampingSite[]> {
    return this.http.get<CampingSite[]>(`${this.baseUrl}/my-sites?ownerId=${ownerId}`);
  }

  // --- Bookings ---

  createBooking(booking: Partial<SiteBooking>): Observable<SiteBooking> {
    return this.http.post<SiteBooking>(`${this.bookingUrl}/add`, booking);
  }

  getMyBookings(userId: number): Observable<SiteBooking[]> {
    return this.http.get<SiteBooking[]>(`${this.bookingUrl}/my-inscriptions/${userId}`);
  }

  getMyCampBookingList(): Observable<SiteBooking[]> {
    return this.http.get<SiteBooking[]>(`${this.bookingUrl}/my-camp-booking-list`);
  }

  getAllBookings(): Observable<SiteBooking[]> {
    return this.http.get<SiteBooking[]>(`${this.bookingUrl}/getAll`);
  }

  getDetailedBookingsBySite(siteId: number): Observable<SiteBooking[]> {
    return this.http.get<SiteBooking[]>(`${this.bookingUrl}/bySite/${siteId}`);
  }

  cancelBooking(id: number): Observable<SiteBooking> {
    return this.http.patch<SiteBooking>(`${this.bookingUrl}/cancel/${id}`, {});
  }

  confirmPayment(id: number): Observable<SiteBooking> {
    return this.http.patch<SiteBooking>(`${this.bookingUrl}/confirm-payment/${id}`, {});
  }

  getSiteAvailability(siteId: number, startDate: string, endDate: string): Observable<SiteAvailability> {
    return this.http.get<SiteAvailability>(`${this.baseUrl}/${siteId}/availability?dateDebut=${startDate}&dateFin=${endDate}`);
  }

  downloadInvoice(bookingId: number): Observable<Blob> {
    // Stub implementation: requires actual backend PDF generation
    return this.http.get(`${this.bookingUrl}/invoice/${bookingId}`, { responseType: 'blob' });
  }

  downloadTicket(bookingId: number): Observable<Blob> {
    // Stub implementation: requires actual backend PDF generation
    return this.http.get(`${this.bookingUrl}/ticket/${bookingId}`, { responseType: 'blob' });
  }
}
