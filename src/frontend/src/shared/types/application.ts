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
