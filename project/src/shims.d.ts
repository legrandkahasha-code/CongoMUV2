// Temporary module declarations to satisfy TypeScript until proper types are installed
declare module 'lucide-react' {
  import * as React from 'react';
  export const X: React.ComponentType<any>;
  export const User: React.ComponentType<any>;
  export const Phone: React.ComponentType<any>;
  export const Calendar: React.ComponentType<any>;
  export const Plus: React.ComponentType<any>;
  export const Trash2: React.ComponentType<any>;
  export const CreditCard: React.ComponentType<any>;
  export const Ticket: React.ComponentType<any>;
  export const QrCode: React.ComponentType<any>;
  export const MapPin: React.ComponentType<any>;
  export const Navigation: React.ComponentType<any>;
  export const CheckCircle: React.ComponentType<any>;
  export const Clock: React.ComponentType<any>;
  export const Users: React.ComponentType<any>;
  export const ArrowRight: React.ComponentType<any>;
  export const LogOut: React.ComponentType<any>;
  export const Info: React.ComponentType<any>;
  export const Mail: React.ComponentType<any>;
  export const Lock: React.ComponentType<any>;
  export const Eye: React.ComponentType<any>;
  export const EyeOff: React.ComponentType<any>;
  export const AlertCircle: React.ComponentType<any>;
  export const Shield: React.ComponentType<any>;
  export const ShieldCheck: React.ComponentType<any>;
  export const Star: React.ComponentType<any>;
  export const Search: React.ComponentType<any>;
  export const Quote: React.ComponentType<any>;
  export const Award: React.ComponentType<any>;
  export const Zap: React.ComponentType<any>;
  export const Globe: React.ComponentType<any>;
  export const Globe2: React.ComponentType<any>;
  export const ChevronRight: React.ComponentType<any>;
  // fallback
  const Icon: React.ComponentType<any>;
  export default Icon;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any;
  export function jsxs(type: any, props?: any, key?: any): any;
  export function Fragment(props: any): any;
}
