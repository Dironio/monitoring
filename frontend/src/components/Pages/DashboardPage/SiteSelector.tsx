import React, { useState } from 'react';

interface Site {
    id: string;
    name: string;
}

interface SiteSelectorProps {
    sites: Site[];
    selectedSiteId: string | null;
    onChange: (siteId: string | null) => void;
    isLoading: boolean;
    required: boolean;
}

export const SiteSelector: React.FC<SiteSelectorProps> = ({
    sites,
    selectedSiteId,
    onChange,
    isLoading,
    required
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleSelect = (site: Site) => {
        onChange(site.id);
        setIsOpen(false);
    };

    const selectedSite = sites.find(site => site.id === selectedSiteId);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="mt-1 relative">
                <button
                    type="button"
                    className={`bg-white relative w-full border ${selectedSiteId ? 'border-blue-500' : 'border-gray-300'} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading sites...</span>
                        </div>
                    ) : selectedSite ? (
                        <span className="block truncate">{selectedSite.name}</span>
                    ) : (
                        <span className="block truncate text-gray-500">Select a website</span>
                    )}

                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {sites.length > 0 ? (
                            sites.map((site) => (
                                <div
                                    key={site.id}
                                    className={`${selectedSiteId === site.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                        } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50`}
                                    onClick={() => handleSelect(site)}
                                >
                                    <span className="block truncate">{site.name}</span>

                                    {selectedSiteId === site.id && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-2 px-3 text-gray-500">No sites available</div>
                        )}
                    </div>
                )}
            </div>

            {required && !selectedSiteId && (
                <p className="mt-1 text-sm text-red-600">Website selection is required</p>
            )}
        </div>
    );
};