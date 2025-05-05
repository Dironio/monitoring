import React, { useState, useRef } from 'react';

interface ReportSectionProps {
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
    resizable?: boolean;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
    title,
    children,
    collapsible = false,
    resizable = false
}) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [height, setHeight] = useState<number | null>(null);
    const resizeRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [startY, setStartY] = useState<number>(0);
    const [startHeight, setStartHeight] = useState<number>(0);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (resizeRef.current && resizable) {
            setIsResizing(true);
            setStartY(e.clientY);
            setStartHeight(resizeRef.current.clientHeight);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing && resizeRef.current) {
            const newHeight = Math.max(startHeight + (e.clientY - startY), 100);
            setHeight(newHeight);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    React.useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>

                <div className="flex space-x-2">
                    {collapsible && (
                        <button
                            type="button"
                            className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={handleToggleCollapse}
                        >
                            {isCollapsed ? (
                                <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {!isCollapsed && (
                <div
                    ref={resizeRef}
                    className="p-4 overflow-auto"
                    style={{ height: height ? `${height}px` : 'auto' }}
                >
                    {children}
                </div>
            )}

            {!isCollapsed && resizable && (
                <div
                    className="h-2 bg-gray-100 border-t border-gray-200 cursor-ns-resize flex justify-center items-center hover:bg-gray-200"
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                </div>
            )}
        </div>
    );
};