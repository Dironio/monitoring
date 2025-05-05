import React, { useState } from 'react';

interface Page {
    id: string;
    name: string;
    path: string;
    siteId: string;
}

interface PageSelectorProps {
    pages: Page[];
    selectedPageId: string | null;
    onChange: (pageId: string | null) => void;
    onToggleActive: (active: boolean) => void;
    isActive: boolean;
    isDisabled: boolean;
    isLoading: boolean;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
    pages,
    selectedPageId,
    onChange,
    onToggleActive,
    isActive,
    isDisabled,
    isLoading
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleToggleActive = () => {
        if (!isDisabled) {
            const newActiveState = !isActive;
            onToggleActive(newActiveState);
        }
    };

    const handleSelect = (page: Page) => {
        onChange(page.id);
        setIsOpen(false);
    };

    const selectedPage = pages.find(page => page.id === selectedPageId);

    return (
        <div className="relative">
            <div className="flex items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Page</label>
                <div className="ml-2">
                    <button
                        type="button"
                        className={`${isDisabled
                                ? 'bg-gray-200 cursor-not-allowed'
                                : isActive
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                            } relative inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        onClick={handleToggleActive}
                        disabled={isDisabled}
                    >
                        <span
                            className={`${isActive ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                        />
                    </button>
                </div>
                <span className="ml-2 text-xs text-gray-500">
                    {isActive ? 'Filter active' : 'Filter inactive'}
                </span>
            </div>

            <div className="mt-1 relative">
                <button
                    type="button"
                    className={`bg-white relative w-full border ${selectedPageId ? 'border-blue-500' : 'border-gray-300'} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${(!isActive || isDisabled) ? 'opacity-50' : ''}`}
                    onClick={() => !isDisabled && isActive && setIsOpen(!isOpen)}
                    disabled={isDisabled || !isActive || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading pages...</span>
                        </div>
                    ) : selectedPage ? (
                        <div className="flex items-center">
                            <span className="block truncate">{selectedPage.name}</span>
                            <span className="ml-1 text-xs text-gray-500">({selectedPage.path})</span>
                        </div>
                    ) : (
                        <span className="block truncate text-gray-500">
                            {isDisabled ? 'Select a website first' : 'All pages'}
                        </span>
                    )}

                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>

                {isOpen && !isDisabled && isActive && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        <div
                            className={`${!selectedPageId ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50`}
                            onClick={() => onChange(null)}
                        >
                            <span className="block truncate font-medium">All pages</span>

                            {!selectedPageId && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </div>

                        {pages.length > 0 ? (
                            pages.map((page) => (
                                <div
                                    key={page.id}
                                    className={`${selectedPageId === page.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                        } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50`}
                                    onClick={() => handleSelect(page)}
                                >
                                    <div className="flex items-center">
                                        <span className="block truncate">{page.name}</span>
                                        <span className="ml-1 text-xs text-gray-500">({page.path})</span>
                                    </div>

                                    {selectedPageId === page.id && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-2 px-3 text-gray-500">No pages available</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};