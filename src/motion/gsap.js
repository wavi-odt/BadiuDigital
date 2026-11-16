// Ponto único de entrada do GSAP: regista os plugins uma vez e cria o ease da marca.
// Importar SEMPRE daqui (import { gsap, ScrollTrigger } from '@/motion/gsap').
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, CustomEase, ScrambleTextPlugin);

// Easing próprio da marca
CustomEase.create('badiu', 'M0,0 C0.7,0 0.2,1 1,1');

// Valores por omissão: entradas expo.out
gsap.defaults({ ease: 'expo.out', duration: 1.1 });

// Em desenvolvimento, expor para depuração na consola
if (import.meta.env.DEV && typeof window !== 'undefined') { window.gsap = gsap; window.ScrollTrigger = ScrollTrigger; }

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, ScrambleTextPlugin, useGSAP };
