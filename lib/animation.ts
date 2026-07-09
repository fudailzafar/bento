import { cubicBezier } from 'framer-motion';

// Curves lifted from bento.me's landing page interactions.
export const bentoEase = [0.251, 0.015, 0, 0.991] as const;
export const bentoBlurEase = [0.287, 0.003, 0, 0.991] as const;
export const bentoVideoEase = [0, 0.857, 0, 0.991] as const;
export const bentoLoginEase = [0.298, 0.015, 0, 0.991] as const;
export const bentoScrollEase = cubicBezier(0.333, 0.079, 0.363, 0.98);
