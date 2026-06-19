export interface Pet {
  id: string;
  name: string;
  quote: string | null;
  description: string | null;
  imageUrl: string | null;
  age: string | null;
  breed: string | null;
  likes: string[];
  tags: string[];
  status: 'available' | 'pending' | 'adopted';
  refId: string | null;
}

export interface AdoptionApplicationPayload {
  petId: string;
  applicantName: string;
  favoriteSnack: string;
  promiseGiven: boolean;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  applicantName: string;
  favoriteSnack: string | null;
  promiseGiven: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export type ReviewAction = 'approve' | 'reject';

