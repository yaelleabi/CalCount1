import type { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    className?: string;
    label: string
}

export const Row = ({ label, children, className = "" }: LayoutProps) => {
    return (
        <div className={`flex flex-wrap ${className}`}>
            <label>{label}</label>
            {children}
        </div>
    );
};

export const Col = ({ children, className = "" }: LayoutProps) => {
    return (
        <div className={`flex-1 ${className}`}>
            {children}
        </div>
    );
};
