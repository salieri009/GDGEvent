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

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
