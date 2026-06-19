interface LoadingMessageProps {
  children: string;
  className?: string;
}

/** ux-ui-rules: large uppercase italic pulse, centered */
export default function LoadingMessage({ children, className = 'p-48' }: LoadingMessageProps) {
  return (
    <div className={`${className} text-center font-black text-4xl uppercase animate-pulse italic`}>
      {children}
    </div>
  );
}
