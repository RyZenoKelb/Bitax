// src/types.d.ts
// Déclarations de types globales

import { TargetAndTransition, Transition, Variant, VariantLabels } from "framer-motion";

declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Type pour les informations réseau
export interface NetworkInfo {
  name: string;
  nativeTokenSymbol: string;
  color: string;
  icon: string;
}

// Types des réseaux supportés
export type NetworkType = 'eth' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'solana' | 'avalanche' | 'bsc';