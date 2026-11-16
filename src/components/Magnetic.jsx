import { useRef } from 'react';
import { useMagnet } from '@/motion/useMagnet';

/** Envolve um botão/link principal com o efeito magnético (o transform fica no wrapper). */
export default function Magnetic({ children, strength, strengthY, className = '' }) {
  const ref = useRef(null);
  useMagnet(ref, { strength, strengthY });
  return (
    <span ref={ref} className={`magnet ${className}`}>
      {children}
    </span>
  );
}
