import { ThemeAccent } from '../types';

export interface AccentThemeClasses {
  name: string;
  nameAr: string;
  primary: string;
  bgGlow: string;
  borderHover: string;
  textAccent: string;
  badgeBg: string;
  btnPrimary: string;
  dotColor: string;
}

export const ACCENT_THEMES: Record<ThemeAccent, AccentThemeClasses> = {
  cyan: {
    name: 'Cyber Cyan',
    nameAr: 'سيان سايبر',
    primary: 'cyan-400',
    bgGlow: 'from-cyan-500/15 to-blue-600/10',
    borderHover: 'hover:border-cyan-500/50',
    textAccent: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    btnPrimary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20',
    dotColor: '#22d3ee',
  },
  emerald: {
    name: 'Matrix Emerald',
    nameAr: 'زمردي ماتريكس',
    primary: 'emerald-400',
    bgGlow: 'from-emerald-500/15 to-teal-600/10',
    borderHover: 'hover:border-emerald-500/50',
    textAccent: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    btnPrimary: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20',
    dotColor: '#34d399',
  },
  violet: {
    name: 'Quantum Violet',
    nameAr: 'بنفسجي كمومي',
    primary: 'violet-400',
    bgGlow: 'from-violet-500/15 to-purple-600/10',
    borderHover: 'hover:border-violet-500/50',
    textAccent: 'text-violet-400',
    badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    btnPrimary: 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold shadow-lg shadow-violet-500/20',
    dotColor: '#a78bfa',
  },
  amber: {
    name: 'Solar Amber',
    nameAr: 'كهرماني شمسي',
    primary: 'amber-400',
    bgGlow: 'from-amber-500/15 to-orange-600/10',
    borderHover: 'hover:border-amber-500/50',
    textAccent: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    btnPrimary: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20',
    dotColor: '#fbbf24',
  },
  rose: {
    name: 'Neon Rose',
    nameAr: 'وردي نيون',
    primary: 'rose-400',
    bgGlow: 'from-rose-500/15 to-pink-600/10',
    borderHover: 'hover:border-rose-500/50',
    textAccent: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    btnPrimary: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold shadow-lg shadow-rose-500/20',
    dotColor: '#fb7185',
  },
};
