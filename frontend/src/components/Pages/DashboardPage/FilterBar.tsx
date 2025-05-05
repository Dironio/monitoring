import React, { useState } from 'react';
import { SiteSelector } from './SiteSelector';
import { PageSelector } from './PageSelector';
import { DateRangeSelector } from './DateRangeSelector';

interface Site {
    id: string;
    name: string;
}

interface Page {
    id: string;
    name: string;
    path: string;
    siteId: string;
}

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface FilterBarProps {
    sites: Site[];
    pages: Page[];
    selectedSiteId: string | null;
    selectedPageId: string | null;
    dateRange: DateRange;
    onFilterChange: (filters: any) => void;
    isLoading: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    sites,
    pages,
    selectedSiteId,
    selectedPageId,
    dateRange,
    onFilterChange,
    isLoading
}) => {
    // Track active filter states
    const [isPageFilterActive, setIsPageFilterActive] = useState<boolean>(false);
    const [isDateFilterActive, setIsDateFilterActive] = useState<boolean>(false);

    // Handle site change
    const handleSiteChange = (siteId: string | null) => {
        onFilterChange({
            selectedSiteId: siteId,
            // Reset page selection when site changes
            selectedPageId: null
        });
    };

    // Handle page filter toggle
    const handlePageFilterToggle = (active: boolean) => {
        setIsPageFilterActive(active);
        if (!active) {
            // Clear page selection when filter is deactivated
            onFilterChange({ selectedPageId: null });
        }
    };

    // Handle page change
    const handlePageChange = (pageId: string | null) => {
        onFilterChange({ selectedPageId: pageId });
    };

    // Handle date filter toggle
    const handleDateFilterToggle = (active: boolean) => {
        setIsDateFilterActive(active);
        if (!active) {
            // Clear date range when filter is deactivated
            onFilterChange({
                dateRange: {
                    startDate: null,
                    endDate: null
                }
            });
        }
    };

    // Handle date range change
    const handleDateRangeChange = (newDateRange: DateRange) => {
        onFilterChange({ dateRange: newDateRange });
    };

    return (
        <div className="bg-white p-4 shadow-sm border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <SiteSelector
                        sites={sites}
                        selectedSiteId={selectedSiteId}
                        onChange={handleSiteChange}
                        isLoading={isLoading}
                        required={true}
                    />
                </div>

                <div>
                    <PageSelector
                        pages={pages}
                        selectedPageId={selectedPageId}
                        onChange={handlePageChange}
                        onToggleActive={handlePageFilterToggle}
                        isActive={isPageFilterActive}
                        isDisabled={!selectedSiteId}
                        isLoading={isLoading && !!selectedSiteId}
                    />
                </div>

                <div>
                    <DateRangeSelector
                        dateRange={dateRange}
                        onChange={handleDateRangeChange}
                        onToggleActive={handleDateFilterToggle}
                        isActive={isDateFilterActive}
                        isDisabled={!selectedSiteId}
                    />
                </div>
            </div>
        </div>
    );
};