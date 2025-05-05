import React, { useState } from 'react';

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface FilterState {
    selectedSiteId: string | null;
    selectedPageId: string | null;
    dateRange: DateRange;
}

interface DashboardState {
    filters: FilterState;
    activeSection: 'monitoring' | 'analysis';
}

interface PDFExportProps {
    dashboardState: DashboardState;
}

export const PDFExport: React.FC<PDFExportProps> = ({ dashboardState }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
    const [includeRawData, setIncludeRawData] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('User Behavior Analytics Report');

    // Format date for display
    const formatDate = (date: Date | null): string => {
        if (!date) return 'All time';
        return date.toLocaleDateString();
    };

    const getReportDescription = (): string => {
        const { filters, activeSection } = dashboardState;

        let description = `${activeSection === 'monitoring' ? 'Monitoring' : 'Analysis'} report`;

        if (filters.selectedSiteId) {
            description += ` for Site ID: ${filters.selectedSiteId}`;

            if (filters.selectedPageId) {
                description += `, Page ID: ${filters.selectedPageId}`;
            }

            if (filters.dateRange.startDate || filters.dateRange.endDate) {
                description += `, Period: ${formatDate(filters.dateRange.startDate)} to ${formatDate(filters.dateRange.endDate)}`;
            }
        }

        return description;
    };

    const handleGeneratePDF = () => {
        setIsGenerating(true);

        // In a real implementation, this would call an API to generate the PDF
        // For now, we'll just simulate a delay
        setTimeout(() => {
            setIsGenerating(false);
            setIsDialogOpen(false);

            // Mock successful PDF generation
            alert('PDF report generated successfully! This would trigger a download in a real implementation.');
        }, 2000);
    };

    return (
        <>
            <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsDialogOpen(true)}
            >
                Export to PDF
            </button>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Export Report as PDF</h3>
                        </div>

                        <div className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="report-title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Report Title
                                    </label>
                                    <input
                                        type="text"
                                        id="report-title"
                                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <p className="block text-sm font-medium text-gray-700 mb-1">
                                        Report Description
                                    </p>
                                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                        {getReportDescription()}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="block text-sm font-medium text-gray-700">
                                        Report Options
                                    </p>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-explanations"
                                            checked={includeExplanations}
                                            onChange={(e) => setIncludeExplanations(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="include-explanations" className="ml-2 block text-sm text-gray-700">
                                            Include explanations and insights
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="include-raw-data"
                                            checked={includeRawData}
                                            onChange={(e) => setIncludeRawData(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="include-raw-data" className="ml-2 block text-sm text-gray-700">
                                            Include raw data tables
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                onClick={handleGeneratePDF}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    'Generate PDF'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};