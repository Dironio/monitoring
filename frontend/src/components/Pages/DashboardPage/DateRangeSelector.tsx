import React, { useState } from 'react';

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface DateRangeSelectorProps {
    dateRange: DateRange;
    onChange: (dateRange: DateRange) => void;
    onToggleActive: (active: boolean) => void;
    isActive: boolean;
    isDisabled: boolean;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
    dateRange,
    onChange,
    onToggleActive,
    isActive,
    isDisabled
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [localStartDate, setLocalStartDate] = useState<string>(
        dateRange.startDate ? formatDateForInput(dateRange.startDate) : ''
    );
    const [localEndDate, setLocalEndDate] = useState<string>(
        dateRange.endDate ? formatDateForInput(dateRange.endDate) : ''
    );

    // Format Date object to YYYY-MM-DD string for input
    function formatDateForInput(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    // Format date for display
    function formatDateForDisplay(date: Date | null): string {
        if (!date) return '';
        return date.toLocaleDateString();
    }

    const handleToggleActive = () => {
        if (!isDisabled) {
            const newActiveState = !isActive;
            onToggleActive(newActiveState);

            // Reset dates if deactivating
            if (!newActiveState) {
                setLocalStartDate('');
                setLocalEndDate('');
            }
        }
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalStartDate(value);

        if (value) {
            const newStartDate = new Date(value);
            onChange({
                startDate: newStartDate,
                endDate: dateRange.endDate
            });
        } else {
            onChange({
                startDate: null,
                endDate: dateRange.endDate
            });
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalEndDate(value);

        if (value) {
            const newEndDate = new Date(value);
            // Set time to end of day for the end date
            newEndDate.setHours(23, 59, 59, 999);

            onChange({
                startDate: dateRange.startDate,
                endDate: newEndDate
            });
        } else {
            onChange({
                startDate: dateRange.startDate,
                endDate: null
            });
        }
    };

    const handleApplyPreset = (days: number) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        setLocalStartDate(formatDateForInput(startDate));
        setLocalEndDate(formatDateForInput(endDate));

        onChange({
            startDate,
            endDate
        });

        setIsOpen(false);
    };

    const getDisplayText = () => {
        if (!isActive) return 'Date filter inactive';
        if (!dateRange.startDate && !dateRange.endDate) return 'All time';
        if (dateRange.startDate && !dateRange.endDate) return `From ${formatDateForDisplay(dateRange.startDate)}`;
        if (!dateRange.startDate && dateRange.endDate) return `Until ${formatDateForDisplay(dateRange.endDate)}`;
        return `${formatDateForDisplay(dateRange.startDate)} - ${formatDateForDisplay(dateRange.endDate)}`;
    };

    return (
        <div className="relative">
            <div className="flex items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Date Range</label>
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
                    className={`bg-white relative w-full border ${(dateRange.startDate || dateRange.endDate) ? 'border-blue-500' : 'border-gray-300'} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${(!isActive || isDisabled) ? 'opacity-50' : ''}`}
                    onClick={() => !isDisabled && isActive && setIsOpen(!isOpen)}
                    disabled={isDisabled || !isActive}
                >
                    <span className="block truncate">
                        {isDisabled
                            ? 'Select a website first'
                            : getDisplayText()
                        }
                    </span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>

                {isOpen && !isDisabled && isActive && (
                    <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg rounded-md py-2 px-3 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={localStartDate}
                                    onChange={handleStartDateChange}
                                    max={localEndDate || undefined}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={localEndDate}
                                    onChange={handleEndDateChange}
                                    min={localStartDate || undefined}
                                />
                            </div>

                            <div className="border-t border-gray-200 pt-2">
                                <p className="text-xs font-medium text-gray-700 mb-2">Quick select:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => handleApplyPreset(7)}
                                    >
                                        Last 7 days
                                    </button>
                                    <button
                                        type="button"
                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => handleApplyPreset(30)}
                                    >
                                        Last 30 days
                                    </button>
                                    <button
                                        type="button"
                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => handleApplyPreset(90)}
                                    >
                                        Last 90 days
                                    </button>
                                    <button
                                        type="button"
                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => {
                                            setLocalStartDate('');
                                            setLocalEndDate('');
                                            onChange({
                                                startDate: null,
                                                endDate: null
                                            });
                                            setIsOpen(false);
                                        }}
                                    >
                                        All time
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};