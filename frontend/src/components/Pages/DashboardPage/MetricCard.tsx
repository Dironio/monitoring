import React from 'react';

interface MetricCardProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    children,
    icon
}) => {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">{title}</h4>
                {icon && (
                    <div className="text-gray-500">
                        {icon}
                    </div>
                )}
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};