import Reveal from './Reveal';

export default function SectionHeading({ title, aside }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 pb-7">
      <Reveal as="h2" className="display-md m-0">{title}</Reveal>
      {aside && <Reveal as="span" delay={0.15} className="font-mono text-sm text-muted-2">{aside}</Reveal>}
    </div>
  );
}
