import { ReactNode } from 'react';

interface DoodleBoxProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'black';
  rotate?: string;
}

export default function DoodleBox({ 
  children, 
  className = "", 
  variant = 'default',
  rotate = "rotate-0"
}: DoodleBoxProps) {
  const shadowClass = variant === 'default' ? 'geo-shadow' : 'geo-shadow-blue';
  
  return (
    <div className={`
      bg-white border-4 border-slate-border rounded-geo p-6 
      ${shadowClass} ${rotate} ${className}
      transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none
    `}>
      {children}
    </div>
  );
}
