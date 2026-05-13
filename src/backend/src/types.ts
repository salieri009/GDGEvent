export interface Pet {
  id: string;
  name: string;
  quote: string;
  description: string;
  imageUrl: string;
  age: string;
  breed: string;
  likes: string[];
  tags: string[];
  status: 'available' | 'pending' | 'adopted';
  refId: string;
}

export interface AdoptionApplicationPayload {
  petId: string;
  applicantName: string;
  favoriteSnack: string;
  promiseGiven: boolean;
}

