import React, { useState, useEffect } from 'react';
import { FilterBar } from './components/FilterBar';
import { ReportSection } from './components/ReportSection';
import { MetricCard } from './components/MetricCard';
import { PDFExport } from './components/PDFExport';
import { Tab, Tabs, TabList, TabPanel } from './components/Tabs';
import { VisitMetrics } from './components/metrics/VisitMetrics';
import { HeatmapVisualization } from './components/visualizations/HeatmapVisualization';
import { ClusteringVisualization } from './components/visualizations/ClusteringVisualization';
import { UMAPVisualization } from './components/visualizations/UMAPVisualization';
import { UserPathsVisualization } from './components/visualizations/UserPathsVisualization';
import { MarkovChainModel } from './components/analytics/MarkovChainModel';
import { EngagementScoreMetric } from './components/analytics/EngagementScoreMetric';
import { RetentionAnalysis } from './components/analytics/RetentionAnalysis';

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

interface FilterState {
    selectedSiteId: string | null;
    selectedPageId: string | null;
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
}

const DashboardPage: React.FC = () => {
    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        selectedSiteId: null,
        selectedPageId: null,
        dateRange: {
            startDate: null,
            endDate: null
        }
    });

    // Mock data - would come from API
    const [sites, setSites] = useState<Site[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeSection, setActiveSection] = useState<'monitoring' | 'analysis'>('monitoring');

    // Fetch sites
    useEffect(() => {
        // Mock API call
        setTimeout(() => {
            setSites([
                { id: '1', name: 'Main Website' },
                { id: '2', name: 'E-commerce Store' },
                { id: '3', name: 'Blog' }
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    // Fetch pages when site changes
    useEffect(() => {
        if (filters.selectedSiteId) {
            setIsLoading(true);
            // Mock API call
            setTimeout(() => {
                setPages([
                    { id: '101', name: 'Home', path: '/', siteId: filters.selectedSiteId },
                    { id: '102', name: 'Products', path: '/products', siteId: filters.selectedSiteId },
                    { id: '103', name: 'About Us', path: '/about', siteId: filters.selectedSiteId },
                    { id: '104', name: 'Contact', path: '/contact', siteId: filters.selectedSiteId }
                ]);
                setIsLoading(false);
            }, 300);
        } else {
            setPages([]);
        }
    }, [filters.selectedSiteId]);

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    // Generate query parameters for API requests
    const getQueryParams = () => {
        const params: Record<string, string> = {};

        // Site is required
        if (filters.selectedSiteId) {
            params.siteId = filters.selectedSiteId;
        } else {
            return null; // Cannot generate params without site
        }

        // Optional filters
        if (filters.selectedPageId) {
            params.pageId = filters.selectedPageId;
        }

        if (filters.dateRange.startDate) {
            params.startDate = filters.dateRange.startDate.toISOString();
        }

        if (filters.dateRange.endDate) {
            params.endDate = filters.dateRange.endDate.toISOString();
        }

        return params;
    };

    // Check if we can fetch data
    const canFetchData = !!filters.selectedSiteId;

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white shadow-sm p-4">
                <h1 className="text-2xl font-bold text-gray-800">User Behavior Analytics Dashboard</h1>
            </header>

            <FilterBar
                sites={sites}
                pages={pages}
                selectedSiteId={filters.selectedSiteId}
                selectedPageId={filters.selectedPageId}
                dateRange={filters.dateRange}
                onFilterChange={handleFilterChange}
                isLoading={isLoading}
            />

            <div className="p-4 flex gap-4">
                <button
                    className={`px-4 py-2 rounded-md ${activeSection === 'monitoring' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveSection('monitoring')}
                >
                    Monitoring Metrics
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${activeSection === 'analysis' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveSection('analysis')}
                >
                    Analysis Metrics
                </button>
            </div>

            <main className="flex-grow p-4 overflow-auto">
                {!canFetchData ? (
                    <div className="text-center p-8 bg-white rounded-lg shadow">
                        <p className="text-lg text-gray-600">Please select a website to view analytics data</p>
                    </div>
                ) : (
                    <>
                        {activeSection === 'monitoring' && (
                            <div className="space-y-6">
                                <ReportSection title="Visit Overview">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <MetricCard title="Total Visits">
                                            <VisitMetrics queryParams={getQueryParams()} metricType="total" />
                                        </MetricCard>
                                        <MetricCard title="Unique Visitors">
                                            <VisitMetrics queryParams={getQueryParams()} metricType="unique" />
                                        </MetricCard>
                                        <MetricCard title="Avg. Visit Duration">
                                            <VisitMetrics queryParams={getQueryParams()} metricType="duration" />
                                        </MetricCard>
                                    </div>
                                </ReportSection>

                                <ReportSection title="Visit History" collapsible resizable>
                                    <VisitMetrics queryParams={getQueryParams()} metricType="history" />
                                </ReportSection>

                                <ReportSection title="User Paths" collapsible resizable>
                                    <UserPathsVisualization queryParams={getQueryParams()} />
                                </ReportSection>
                            </div>
                        )}

                        {activeSection === 'analysis' && (
                            <div className="space-y-6">
                                <ReportSection title="Behavioral Analysis" collapsible>
                                    <Tabs>
                                        <TabList>
                                            <Tab>Heatmaps</Tab>
                                            <Tab>Clustering</Tab>
                                            <Tab>UMAP</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <HeatmapVisualization queryParams={getQueryParams()} />
                                        </TabPanel>
                                        <TabPanel>
                                            <ClusteringVisualization queryParams={getQueryParams()} />
                                        </TabPanel>
                                        <TabPanel>
                                            <UMAPVisualization queryParams={getQueryParams()} />
                                        </TabPanel>
                                    </Tabs>
                                </ReportSection>

                                <ReportSection title="Advanced Analytics" collapsible resizable>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <MetricCard title="Markov Chain Navigation Model">
                                            <MarkovChainModel queryParams={getQueryParams()} />
                                        </MetricCard>
                                        <MetricCard title="User Engagement Score">
                                            <EngagementScoreMetric queryParams={getQueryParams()} />
                                        </MetricCard>
                                        <MetricCard title="Retention Analysis">
                                            <RetentionAnalysis queryParams={getQueryParams()} />
                                        </MetricCard>
                                    </div>
                                </ReportSection>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="bg-white p-4 shadow-inner flex justify-between items-center">
                <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
                <PDFExport dashboardState={{
                    filters,
                    activeSection
                }} />
            </footer>
        </div>
    );
};

export default DashboardPage;