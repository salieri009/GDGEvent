import type { Pet } from '@/shared/types/pet';

export function statusLabel(status: Pet['status']): string {
  switch (status) {
    case 'available':
      return 'Available!';
    case 'pending':
      return 'Pending';
    case 'adopted':
      return 'Adopted';
    default:
      return status;
  }
}

export function statusLabelShort(status: Pet['status']): string {
  switch (status) {
    case 'available':
      return 'Available';
    case 'pending':
      return 'Pending';
    case 'adopted':
      return 'Adopted';
    default:
      return status;
  }
}

export function statusBadgeClass(status: Pet['status']): string {
  switch (status) {
    case 'available':
      return 'bg-primary text-white';
    case 'pending':
      return 'bg-yellow-300 text-on-surface';
    case 'adopted':
      return 'bg-slate-400 text-white';
    default:
      return 'bg-primary text-white';
  }
}

export function isPetAvailable(pet: Pet): boolean {
  return pet.status === 'available';
}
