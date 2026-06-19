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
