export interface Lead {
  id: number;
  name: string;
  email: string;
  source: string;
  consent: boolean;
  appointmentDate: string | null;
  status: string;
  activity: number;
  demographicScore: number;
  izzkiScore?: number;
  conversionProb?: string;
}

export interface FilteredLead extends Lead {
  reason: string;
}

export interface Booking {
  id: number;
  leadId: number;
  name: string;
  date: string;
  time: string;
  score: number;
  status: string;
}

export interface BookingDetails {
  date: string;
  time: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}
