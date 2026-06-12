export interface CampingSite {
  idSite?: number;
  nom: string;
  localisation: string;
  capacite: number;
  prixParNuit: number;
  imageUrl?: string;
  description: string;
  statutDispo: 'DISPONIBLE' | 'FERME' | 'COMPLET';
  ownerId?: string;
  remainingCapacity?: number;
}

export interface CampingSiteCreatePayload {
  nom: string;
  localisation: string;
  capacite: number;
  prixParNuit: number;
  description: string;
  statutDispo: string;
  imageUrl?: string;
}

export interface SiteBooking {
  idInscription?: number;
  dateDebut: string;
  dateFin: string;
  numberOfGuests: number;
  statut?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  siteId: number;
  utilisateurId?: number;
  utilisateurEmail?: string;
  siteCamping?: CampingSite;
  checkoutUrl?: string;
}

export interface UpdateSiteBooking {
  statut: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface SiteAvailability {
  available: boolean;
  message?: string;
  remainingCapacity?: number;
}

export interface SiteRating {
  siteId: number;
  averageRating: number;
  totalRatings: number;
}

export interface Avis {
  idAvis?: number;
  note: number;
  commentaire: string;
  dateCreation?: string;
  siteCampingId: number;
  utilisateurId?: string;
  siteNom?: string;
}
