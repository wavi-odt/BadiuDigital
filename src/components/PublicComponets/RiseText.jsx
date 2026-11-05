import { cn } from '@/utils/cn';

/** Texto que sobe palavra a palavra (animação de entrada) */
export default function RiseText({ text, delay = 0.7, step = 0.07, accent = [], className, wordClassName }) {
  const words = text.split(' ');
  return (
    <span className={cn('flex flex-wrap gap-x-[0.22em]', className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="rise-mask">
          <span
            className={cn('rise', accent.includes(word) && 'text-orange', wordClassName)}
            style={{ animationDelay: `${(delay + i * step).toFixed(2)}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
