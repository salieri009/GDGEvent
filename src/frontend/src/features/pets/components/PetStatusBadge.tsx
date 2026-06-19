import type { Pet } from '@/shared/types/pet';
import { statusBadgeClass, statusLabel, statusLabelShort } from '@/shared/lib/petStatus';

interface PetStatusBadgeProps {
  status: Pet['status'];
  variant?: 'detail' | 'card';
  className?: string;
}

export default function PetStatusBadge({ status, variant = 'detail', className = '' }: PetStatusBadgeProps) {
  const label = variant === 'detail' ? statusLabel(status) : statusLabelShort(status);
  return (
    <span className={`${statusBadgeClass(status)} ${className}`} role="status">
      {label}
    </span>
  );
}
