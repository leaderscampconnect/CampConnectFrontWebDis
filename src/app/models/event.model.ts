export type EventCategory =
  | 'ADVENTURE'
  | 'CAMPING_ACTIVITY'
  | 'GUIDED_TOUR'
  | 'SOCIAL_EVENT'
  | 'WELLNESS'
  | 'WORKSHOP'
  | 'EDUCATIONAL'
  | 'OTHER';

export type EventStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'POSTPONED';

export interface EventRequest {
  title: string;
  description: string;
  category: EventCategory;
  startAt: string;
  endAt: string;
  location: string;
  organizerId: string;
  capacity: number;
  waitlistCapacity: number;
  price: number;
  published: boolean;
}

export interface EventResponse extends EventRequest {
  id: string;
  status: EventStatus;
  registeredCount: number;
  waitlistCount: number;
  availableSeats: number;
  fullyBooked: boolean;
  occupancyRate: number;
  participantIds: string[];
  waitlistParticipantIds: string[];
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationResponse {
  participantId: string;
  registrationStatus: 'CONFIRMED' | 'WAITLISTED';
  waitlistPosition: number;
  event: EventResponse;
}

export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  location?: string;
  published?: boolean;
}

export interface EventAvailabilityResponse {
  eventId: string;
  capacity: number;
  registeredCount: number;
  availableSeats: number;
  waitlistCount: number;
  waitlistCapacity: number;
  fullyBooked: boolean;
  occupancyRate: number;
}

export interface EventNotificationResponse {
  id: string;
  recipientId: string;
  eventId: string | null;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface EventsWithNotificationsResponse {
  events: EventResponse[];
  notifications: EventNotificationResponse[];
}
