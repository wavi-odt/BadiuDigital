import { useRef } from 'react';
import { useSplitReveal } from '@/motion/useSplitReveal';
import { useVelocitySkew } from '@/motion/velocitySkew';

/** Título H2 da marca: entra carácter a carácter ao aparecer e inclina com a velocidade do scroll. */
export default function SplitHeading({ as: Tag = 'h2', children, skew = true, ...rest }) {
  const ref = useRef(null);
  useSplitReveal(ref);
  useVelocitySkew(skew ? ref : { current: null });
  return <Tag ref={ref} {...rest}>{children}</Tag>;
}
