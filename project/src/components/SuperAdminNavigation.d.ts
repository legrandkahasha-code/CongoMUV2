interface SuperAdminNavigationProps {
    onNavigate: (path: string) => void;
    currentPath: string;
}
export declare function SuperAdminNavigation({ onNavigate, currentPath }: SuperAdminNavigationProps): JSX.Element;
export {};
