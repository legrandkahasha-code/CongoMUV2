declare module '*.tsx' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '*/pages/OperatorDashboard' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '*/pages/PassengerApp' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}
